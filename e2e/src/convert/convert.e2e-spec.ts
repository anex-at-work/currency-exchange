import { element, browser, by } from "protractor";
import { ConvertPage } from "./convert.po";

describe("convert page", () => {
  let page: ConvertPage;

  beforeEach(() => {
    page = new ConvertPage();
    page.navigateTo();
  });

  it("has correct header", () => {
    expect(element(by.css("h1")).getText()).toMatch("I want to conver");
  });

  it("has EUR and USD currencies", () => {
    page.presetUsdAndEur().then(() => {
      expect(
        element(by.css(".convert-info__rate:first-child")).getText()
      ).toMatch("1 EUR = ");
      expect(
        element(by.css(".convert-info__rate:last-child")).getText()
      ).toMatch("1 USD = ");
    });
  });

  it("has able to change currencies", () => {
    page.presetUsdAndEur().then(() => {
      page.changeButton.click();
      browser.waitForAngular();
      expect(
        element(by.css(".convert-info__rate:first-child")).getText()
      ).toMatch("1 USD = ");
      expect(
        element(by.css(".convert-info__rate:last-child")).getText()
      ).toMatch("1 EUR = ");
    });
  });

  it("has convert", () => {
    page.presetUsdAndEur().then(() => {
      element(by.css('[formcontrolname="amount"]')).sendKeys(100);
      browser.waitForAngular();
      expect(page.convertButton.isEnabled()).toBe(true);
      page.convertButton.click();
      browser.waitForAngular();
      expect(element(by.css(".convert-info__result-from")).getText()).toMatch(
        "100 EUR ="
      );
    });
  });
});
