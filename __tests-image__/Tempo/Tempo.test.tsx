import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

let browser: puppeteer.Browser;
let page: puppeteer.Page;
describe(`Tempo`, () => {
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.emulate(iPhone);
  });

  it(`Default - From`, async () => {
    await page.goto(`http://localhost:6006/iframe.html?id=tempo--from`);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
  it(`Default - To`, async () => {
    await page.goto(`http://localhost:6006/iframe.html?id=tempo--to`);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
