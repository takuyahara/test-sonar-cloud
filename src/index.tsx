import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';
import App from './App';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
