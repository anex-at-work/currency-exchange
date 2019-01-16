import { Injectable } from "@angular/core";
import {
  Router,
  CanActivateChild,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "src/app/_shared/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class UserGuard implements CanActivateChild, CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._can;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._can;
  }

  private get _can(): Observable<boolean> {
    return this.authService.isLogged().pipe(
      map(logged => {
        if (!logged) {
          this.router.navigate(["/login"]);
          return false;
        }
        return true;
      })
    );
  }
}
