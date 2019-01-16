import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserGuard } from "src/app/_shared/guards/user.guard";
import { ExchangeStoredResolver } from "./_shared/resolvers/exchange-stored.resolver";
import { LoginComponent } from "./login/login.component";
import { ConvertComponent } from "./convert/convert.component";
import { HistoryComponent } from "./history/history.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [UserGuard],
    redirectTo: "/convert",
    pathMatch: "full"
  },
  {
    path: "",
    canActivateChild: [UserGuard],
    children: [
      {
        path: "convert",
        component: ConvertComponent
      },
      {
        path: "convert/:id",
        component: ConvertComponent,
        resolve: {
          stored: ExchangeStoredResolver
        }
      },
      {
        path: "history",
        component: HistoryComponent
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UserGuard, ExchangeStoredResolver]
})
export class AppRoutingModule {}
