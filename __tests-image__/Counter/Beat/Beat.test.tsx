import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

describe(`Beat`, () => {
  beforeEach(async () => {
    await page.emulate(iPhone);
    await page.goto(`http://localhost:6006/iframe.html?id=counter--beat`);
  });

  it(`Default`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThreshold: '0.1',
      failureThresholdType: 'percent'
    });
  });
});
