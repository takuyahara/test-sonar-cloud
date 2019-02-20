import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AxlMetronome from './AxlMetronome';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import ConfigCat, { IConfig } from './ConfigCat';

const defaultConfig = {
  tempoFrom: 90,
  tempoTo: 150,
  rangeFrom: 60,
  rangeTo: 780,
  maxDelta: 100,
  remaining: 30 * 60,
  isDescEnabled: true,
};
function render(config: IConfig): void {
  ReactDOM.render(
    <AxlMetronome 
      tempo={{
        from: config.tempoFrom as number,
        to: config.tempoTo as number,
      }}
      range={{
        from: config.rangeFrom as number,
        to: config.rangeTo as number,
      }}
      maxDelta={config.maxDelta as number}
      remaining={config.remaining as number}
      isDescEnabled={config.isDescEnabled as boolean}
    />,
    document.getElementById('root') as HTMLElement,
  );
}
// render(defaultConfig);

if (process.env.NODE_ENV === 'production') {
  const bugsnagClient = bugsnag({
    apiKey: process.env.BS_API!,
    appVersion: process.env.npm_package_version,
  });
  bugsnagClient.use(bugsnagReact, React);
  const configcat = new ConfigCat(process.env.CC_API_PROD!, {
    identifier: process.env.CC_ID!,
  });
  configcat.setDefaultConfig(defaultConfig).load(render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
