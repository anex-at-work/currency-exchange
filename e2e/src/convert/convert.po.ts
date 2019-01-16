import { browser, by, element, ElementFinder, promise } from "protractor";

export class ConvertPage {
  private optionSelector = ".mat-option-text";

  navigateTo() {
    browser.get("/");
    browser.executeScript("window.localStorage.setItem('auth-user', 'user1');");
    return browser.get("/convert");
  }

  get convertButton(): ElementFinder {
    return element(by.css(".convert-form__convert"));
  }

  get changeButton(): ElementFinder {
    return element(by.css(".convert-form__change"));
  }

  get eurSelector(): any {
    return by.cssContainingText(this.optionSelector, " EUR ");
  }

  get usdSelector(): any {
    return by.cssContainingText(this.optionSelector, " USD ");
  }

  presetUsdAndEur(): promise.Promise<any> {
    return browser
      .wait(
        () => browser.isElementPresent(by.css(".convert-form__select")),
        3000
      )
      .then(() => {
        element
          .all(by.css(".convert-form__select"))
          .first()
          .click();
        return browser
          .wait(() => browser.isElementPresent(this.eurSelector), 1000)
          .then(() => {
            element(this.eurSelector).click();
            browser.waitForAngular();
            element
              .all(by.css(".convert-form__select"))
              .last()
              .click();
            return browser
              .wait(() => browser.isElementPresent(this.usdSelector), 1000)
              .then(() => {
                element(this.usdSelector).click();
                browser.waitForAngular();
              });
          });
      });
  }
}
