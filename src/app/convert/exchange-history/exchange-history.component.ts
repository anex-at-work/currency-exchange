import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { zip } from "rxjs/operators";
import { MatTable } from "@angular/material";

import { ExchangeHistoryRate } from "src/app/_shared/models/exchange-rate.model";
import { NomicsService } from "src/app/_shared/services/nomics.service";
import { IFromTo } from "src/app/_shared/models/exchange-rate.model";

interface IHistoryDuration {
  value: number;
  text: string;
}

interface IStatistic {
  name: string;
  value: number;
}

@Component({
  selector: "app-exchange-history",
  templateUrl: "./exchange-history.component.html",
  styleUrls: ["./exchange-history.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeHistoryComponent implements OnInit {
  public displayedColumns: string[] = ["date", "rates"];
  public displayedColumnsStatistics: string[] = ["name", "value"];
  public durations: IHistoryDuration[] = [
    {
      value: 7,
      text: "7 days"
    },
    {
      value: 14,
      text: "14 days"
    },
    {
      value: 30,
      text: "30 days"
    }
  ];
  public historyRates: ExchangeHistoryRate[] = [];
  public statisticsValues: IStatistic[] = [
    {
      name: "Lowest",
      value: 0
    },
    {
      name: "Highest",
      value: 0
    },
    {
      name: "Average",
      value: 0
    }
  ];
  public duration: FormControl = new FormControl(7, []);
  @ViewChild("rates") tableRates: MatTable<ExchangeHistoryRate>;
  @ViewChild("statistics") tableStatistics: MatTable<IStatistic>;
  private _rates: IFromTo;

  constructor(private nomicsService: NomicsService) {}

  ngOnInit() {
    this.duration.valueChanges.subscribe(_ => this._fillRates());
  }

  get rates(): IFromTo {
    return this._rates;
  }

  @Input("rates")
  set rates(rates: IFromTo) {
    this._rates = rates;
    if (this._rates.from && this._rates.to) {
      this._fillRates();
    }
  }

  private _fillRates(): void {
    let date = new Date();
    date.setDate(date.getDate() - this.duration.value);
    this.nomicsService
      .ratesHistory(this._rates.to.currency, date)
      .pipe(
        zip(this.nomicsService.ratesHistory(this._rates.from.currency, date))
      )
      .subscribe(res => {
        this.historyRates.splice(0, this.historyRates.length);
        if (res[0].length != res[1].length) return;
        let min = 2 ** 64,
          max = 0,
          rate = 0,
          sum = 0;
        for (let i = 0; i < res[0].length; i++) {
          rate = res[1][i].rate / res[0][i].rate;
          this.historyRates.push({
            rate: rate,
            timestamp: res[0][i].timestamp,
            date: Date.parse(res[0][i].timestamp)
          });
          min = Math.min(min, rate);
          max = Math.max(max, rate);
          sum += rate;
        }
        this.statisticsValues[0].value = min;
        this.statisticsValues[1].value = max;
        this.statisticsValues[2].value = sum / res[0].length;
        this.tableRates.renderRows();
        this.tableStatistics.renderRows();
      });
  }
}
