import { Injectable } from "@angular/core";
import { Observable, Subject, from, of } from "rxjs";
import { first, map } from "rxjs/operators";

import { User, IUserData } from "src/app/_shared/models/user.model";

const USERS: User[] = [
  {
    username: "user1",
    password: "pass1",
    fullName: "John Doe"
  },
  {
    username: "user2",
    password: "pass2",
    fullName: "Adam Smith"
  }
];

const STORAGE_KEY = "auth-user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _userSubject: Subject<User> = new Subject<User>();
  constructor() {}

  login(data: IUserData): Observable<User> {
    return from(USERS).pipe(
      first(
        user =>
          user.username === data.username && user.password === data.password
      ),
      map(user => {
        localStorage.setItem(STORAGE_KEY, user.username);
        this._userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._userSubject.next(null);
  }

  get current(): Observable<User> {
    return this._userSubject.asObservable();
  }

  isLogged(): Observable<boolean> {
    const userName = localStorage.getItem(STORAGE_KEY);
    if (!userName) {
      this._userSubject.next(null);
      return of(false);
    }
    this._userSubject.next(USERS.find(user => user.username == userName));
    return of(true);
  }
}
