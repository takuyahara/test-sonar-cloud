import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

const sel = (id: string) => `[data-testid="${id}"]`;

describe(`Ring`, () => {
  beforeEach(async () => {
    await page.emulate(iPhone);
    await page.goto(`http://localhost:6006/iframe.html?id=counter--non-stepped-ring`);
  });

  it(`Default`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
  it(`Progress: 50%`, async () => {
    const bcr = await page.evaluate((selector: string) => {
      const element = document.querySelector(selector)!;
      // tslint:disable-next-line:no-shadowed-variable
      const { x, y } = element.getBoundingClientRect() as DOMRect;
      return { left: x, top: y };
    }, sel(`ring-taparea`));

    const x = 150 + bcr.left;
    const y = 75 + bcr.top;
    await page.mouse.click(x, y);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
