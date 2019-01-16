import { browser, by, element, ElementFinder } from "protractor";

export class ExchangeHistoryPage {
  private optionSelector = ".mat-option-text";

  navigateTo() {
    browser.get("/");
    browser.executeScript("window.localStorage.setItem('auth-user', 'user1');");
    return browser.get("/convert");
  }

  get historyTable(): ElementFinder {
    return element(by.css(".exchange-history__tables table:first-child"));
  }
}
