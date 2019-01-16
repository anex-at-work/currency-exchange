import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "src/environments/environment";
import {
  ExchangeRate,
  ExchangeHistoryRate
} from "src/app/_shared/models/exchange-rate.model";

@Injectable({
  providedIn: "root"
})
export class NomicsService {
  constructor(private http: HttpClient) {}

  rates(): Observable<ExchangeRate[]> {
    return this._httpGet("/exchange-rates").pipe(
      map(res => <ExchangeRate[]>res)
    );
  }

  ratesHistory(
    currency: string,
    start: Date
  ): Observable<ExchangeHistoryRate[]> {
    return this._httpGet("/exchange-rates/history", {
      currency: currency,
      start: start.toISOString()
    }).pipe(map(res => (<ExchangeHistoryRate[]>res).reverse()));
  }

  private _httpGet(url: string, params: Object | null = null): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}${url}`, {
      params: Object.assign({ key: environment.apiKey }, params)
    });
  }
}
