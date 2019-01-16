import { browser, by } from "protractor";
import { LoginPage } from "./login.po";

describe("login page", () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it("has redirect after login", () => {
    page.navigateTo();
    browser
      .wait(() => browser.isElementPresent(by.css('[type="submit"]')))
      .then(() => {
        page.fillUserInfo();
        page.loginButton.click();
        const currentUrl = browser.getCurrentUrl();
        browser
          .wait(() => currentUrl != browser.getCurrentUrl(), 1000)
          .then(() => {
            expect(browser.getCurrentUrl()).toMatch("/convert");
          });
      });
  });
});
