import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { IExchangeStored } from "src/app/_shared/models/exchange-rate.model";

@Injectable({
  providedIn: "root"
})
export class IndexedDbService {
  private static DB_NAME = "currency-converter";
  private static DB_STORE = "exchanges";

  constructor() {
    if (!window.indexedDB) throw "IndexedDB is not supported!";
    const dbOpen = window.indexedDB.open(IndexedDbService.DB_NAME, 1);
    dbOpen.onupgradeneeded = (e: Event) => {
      const db = <IDBDatabase>(<IDBRequest>e.target).result;
      const store = db.createObjectStore(IndexedDbService.DB_STORE, {
        autoIncrement: true,
        keyPath: "id"
      });
      store.createIndex("id", "id");
      store.createIndex("username", "username", { unique: false });
      db.close();
    };
  }

  save(...datas: IExchangeStored[]): void {
    this._run(e => {
      const db = <IDBDatabase>(<IDBRequest>e.target).result;
      const trans = db.transaction(IndexedDbService.DB_STORE, "readwrite");
      const store = trans.objectStore(IndexedDbService.DB_STORE);
      datas.forEach(data => {
        store.put(data);
      });
      db.close();
    });
  }

  read(key: string, filter: any | null): Observable<IExchangeStored[]> {
    const ret = new Subject<IExchangeStored[]>();
    this._run(e => {
      let data: IExchangeStored[] = [];
      const db = <IDBDatabase>(<IDBRequest>e.target).result;
      const trans = db.transaction(IndexedDbService.DB_STORE, "readonly");
      const store = trans.objectStore(IndexedDbService.DB_STORE);
      const index = store.index(key);
      index.openCursor(IDBKeyRange.only(filter), "prev").onsuccess = (
        ev: Event
      ) => {
        const cursor = (<IDBRequest>ev.target).result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          ret.next(<IExchangeStored[]>data);
          ret.complete();
          db.close();
        }
      };
    });
    return ret.asObservable();
  }

  delete(id: number, success: () => void): void {
    this._run(e => {
      const db = <IDBDatabase>(<IDBRequest>e.target).result;
      const trans = db.transaction(IndexedDbService.DB_STORE, "readwrite");
      const store = trans.objectStore(IndexedDbService.DB_STORE);
      store.openCursor(IDBKeyRange.only(id)).onsuccess = (ev: Event) => {
        const cursor = (<IDBRequest>ev.target).result;
        if (cursor) {
          cursor.delete();
          success();
        }
      };
      db.close();
    });
  }

  private _run(success: (event: Event) => void): void {
    const db = window.indexedDB.open(IndexedDbService.DB_NAME, 1);
    db.onsuccess = success;
  }
}
