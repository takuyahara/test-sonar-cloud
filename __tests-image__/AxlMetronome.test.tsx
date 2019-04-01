import devices from 'puppeteer/DeviceDescriptors';
const iPhone = devices[`iPhone 6`];

describe(`AxlMetronome`, () => {
  beforeEach(async () => {
    await page.emulate(iPhone);
    await page.goto(`http://localhost:6006/iframe.html?id=axl-metronome--axl-metronome`);
  });

  it(`Default`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });
});
