import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IndexedDbService } from "src/app/_shared/services/indexed-db.service";
import { IExchangeStored } from "src/app/_shared/models/exchange-rate.model";

@Injectable()
export class ExchangeStoredResolver implements Resolve<IExchangeStored> {
  constructor(protected indexedDbService: IndexedDbService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IExchangeStored> {
    const id = route.paramMap.get("id");
    return this.indexedDbService.read("id", +id).pipe(
      map(res => {
        return <IExchangeStored>res[0];
      })
    );
  }
}
