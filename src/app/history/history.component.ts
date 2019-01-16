import { Component, OnInit, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { User } from "src/app/_shared/models/user.model";
import { AuthService } from "src/app/_shared/services/auth.service";
import { IndexedDbService } from "src/app/_shared/services/indexed-db.service";
import { IExchangeStored } from "src/app/_shared/models/exchange-rate.model";

interface DialogData {
  id: number;
  record: string;
}

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  public displayedColumns: string[] = ["date", "event", "actions"];
  public dataSource: Observable<IExchangeStored[]>;
  private currentUser: User;

  constructor(
    private authService: AuthService,
    private indexedDbService: IndexedDbService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.current.subscribe(user => (this.currentUser = user));
    this.authService.isLogged().subscribe();
    this._setDataSource();
  }

  eventStr(data: IExchangeStored): string {
    return `Converted an amount of ${data.amount} from ${
      data.from.currency
    } to ${data.to.currency}`;
  }

  onDelete(data: IExchangeStored): boolean {
    const dialogRef = this.dialog.open(ConfirmationDeleteDialog, {
      width: "400px",
      data: { id: data.id, record: this.eventStr(data) }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.result) {
        this.indexedDbService.delete(res.id, () => {
          this._setDataSource();
        });
      }
    });
    return false;
  }

  private _setDataSource(): void {
    this.dataSource = this.indexedDbService.read(
      "username",
      this.currentUser.username
    );
  }
}

@Component({
  selector: "confirmation-delete-dialog",
  templateUrl: "confirmation-delete.dialog.html"
})
export class ConfirmationDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
