import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "src/app/_shared/services/auth.service";
import { IUserData } from "src/app/_shared/models/user.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public formGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(): void {
    this.authService.login(<IUserData>this.formGroup.value).subscribe(
      _ => {
        this.router.navigate(["/"]);
      },
      _ => {
        this.formGroup.get("username").setErrors({
          incorrect: "Login incorrect"
        });
      }
    );
  }
}
