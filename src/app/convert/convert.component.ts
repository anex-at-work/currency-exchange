import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { User } from "src/app/_shared/models/user.model";
import { AuthService } from "src/app/_shared/services/auth.service";
import { NomicsService } from "src/app/_shared/services/nomics.service";
import { IndexedDbService } from "src/app/_shared/services/indexed-db.service";
import {
  ExchangeRate,
  IExchangeStored,
  IFromTo
} from "src/app/_shared/models/exchange-rate.model";

interface ITypeRate {
  from: number;
  to: number;
}

interface IConvertedAmount extends IFromTo {
  amount: number;
  result: number;
}

@Component({
  selector: "app-convert",
  templateUrl: "./convert.component.html",
  styleUrls: ["./convert.component.scss"]
})
export class ConvertComponent implements OnInit {
  public formGroup = new FormGroup({
    amount: new FormControl("", [Validators.required]),
    from: new FormControl("", [Validators.required]),
    to: new FormControl("", [Validators.required])
  });
  public rates: ITypeRate = { from: 0.0, to: 0.0 };
  public converted: IConvertedAmount;
  public exchangeRates: ExchangeRate[];
  public fromTo: IFromTo = { from: null, to: null };
  private currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private nomicsService: NomicsService,
    private indexedDbService: IndexedDbService
  ) {}

  ngOnInit() {
    ["from", "to"].forEach(control => {
      this.formGroup
        .get(control)
        .valueChanges.subscribe(_ => this._calculateRates());
    });
    this.nomicsService.rates().subscribe(rates => {
      this.exchangeRates = rates;
      ["from", "to"].forEach(control => {
        this.formGroup.get(control).setValue(rates[0]);
      });
      this.route.data.subscribe(data => {
        if (data["stored"]) {
          this._setFromStored(data["stored"]);
        }
      });
    });
    this.authService.current.subscribe(user => (this.currentUser = user));
    this.authService.isLogged().subscribe();
  }

  changeCurrencies(): boolean {
    const buffer = this.fromCurrency;
    this.formGroup.get("from").setValue(this.toCurrency);
    this.formGroup.get("to").setValue(buffer);
    return false;
  }

  convertCurrencies(): boolean {
    this.converted = {
      from: this.fromCurrency,
      to: this.toCurrency,
      amount: this.amount,
      result: this.amount * this.rates.from
    };
    this._storeToDb();
    return false;
  }

  get isValues(): boolean {
    const from = <ExchangeRate>this.formGroup.get("from").value,
      to = <ExchangeRate>this.formGroup.get("to").value;
    return !!from && !!to;
  }

  get amount(): number | null {
    return this.formGroup.get("amount").value;
  }

  get fromCurrency(): ExchangeRate {
    return <ExchangeRate>this.formGroup.get("from").value;
  }

  get toCurrency(): ExchangeRate {
    return <ExchangeRate>this.formGroup.get("to").value;
  }

  private _calculateRates(): void {
    const from = this.fromCurrency,
      to = this.toCurrency;
    if (from && to) {
      this.rates.from = from.rate / to.rate;
      this.rates.to = to.rate / from.rate;
      this.fromTo = {
        from: from,
        to: to
      };
    }
  }

  private _storeToDb(): void {
    this.indexedDbService.save(
      Object.assign(this.converted, {
        username: this.currentUser.username,
        created: Date.now()
      })
    );
  }

  private _setFromStored(stored: IExchangeStored) {
    this.converted = stored;
    ["from", "to"].forEach(control => {
      this.formGroup
        .get(control)
        .setValue(
          this.exchangeRates.find(el => el.currency == stored[control].currency)
        );
    });
  }
}
