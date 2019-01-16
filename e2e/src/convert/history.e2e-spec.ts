import { element, browser, by } from "protractor";
import { ExchangeHistoryPage } from "./history.po";

describe("convert page", () => {
  let page: ExchangeHistoryPage;

  beforeEach(() => {
    page = new ExchangeHistoryPage();
    page.navigateTo();
  });

  it("has correct header", () => {
    expect(element(by.css("app-exchange-history h3")).getText()).toMatch(
      "Exchange History"
    );
  });

  it("has correct amount for week", () => {
    browser
      .wait(() =>
        browser.isElementPresent(
          by.css(".exchange-history__tables table tbody tr")
        )
      )
      .then(() => {
        expect(page.historyTable.all(by.css("tbody tr")).count()).toBe(7);
      });
  });
});
