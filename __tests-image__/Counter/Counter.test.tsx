import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

describe(`Counter`, () => {
  beforeEach(async () => {
    await page.emulate(iPhone);
    await page.goto(`http://localhost:6006/iframe.html?id=counter--counter`);
  });

  it(`Default`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.99',
      failureThresholdType: 'percent'
    });
  });
});
