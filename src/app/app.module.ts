import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";

import { AuthService } from "src/app/_shared/services/auth.service";
import { NomicsService } from "src/app/_shared/services/nomics.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ConvertComponent } from "./convert/convert.component";
import {
  HistoryComponent,
  ConfirmationDeleteDialog
} from "src/app/history/history.component";
import { ExchangeHistoryComponent } from "src/app/convert/exchange-history/exchange-history.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToolbarComponent,
    ConvertComponent,
    HistoryComponent,
    ConfirmationDeleteDialog,
    ExchangeHistoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  entryComponents: [ConfirmationDeleteDialog],
  providers: [AuthService, NomicsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
