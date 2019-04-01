import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

let browser: puppeteer.Browser;
let page: puppeteer.Page;
describe(`Time`, () => {
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto(`http://localhost:6006/iframe.html?id=counter--time`);
  });

  it(`Default`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
