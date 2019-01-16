import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/_shared/services/auth.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  public isLogged: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.current.subscribe(user => (this.isLogged = !!user));
  }

  logout(): void {
    this.authService.logout();
  }
}
