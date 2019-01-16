import { browser, by, element, ElementFinder } from "protractor";

export class LoginPage {
  private creditials = {
    username: "user1",
    password: "pass1"
  };

  navigateTo() {
    return browser.get("/login");
  }

  fillUserInfo(creditials: {} = this.creditials) {
    for (let info in creditials) {
      element(by.css(`[formcontrolname="${info}"]`)).sendKeys(creditials[info]);
    }
  }

  get loginButton(): ElementFinder {
    return element(by.css('[type="submit"]'));
  }
}
