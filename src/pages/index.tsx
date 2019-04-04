import React from "react";
import Helmet from "react-helmet";
import SEO from "../components/seo";
import ttfDIN from "../fonts/DIN.ttf";
import AxlMetronome from '../components/AxlMetronome/AxlMetronome';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import { version as appVersion } from '../../package.json';

const NODE_CONFIG = JSON.parse(process.env.NODE_CONFIG!);
const defaultConfig = NODE_CONFIG.AxlMetronome;
const bsConfig = NODE_CONFIG.Bugsnag;

const IndexPage = () => (
  <>
    <SEO 
      title="Home" 
      keywords={[`gatsby`, `pwa`, `react`, `music`, `metronome`]} 
    />
    <Helmet
      style={[
        {
          type: "text/css", 
          cssText: `
            @font-face {
                font-family: "DIN Alternate";
                src: url("${ttfDIN}");
            }
          `,
        },
      ]}
    />
    <AxlMetronome 
      tempo={{
        from: defaultConfig.tempoFrom as number,
        to: defaultConfig.tempoTo as number,
      }}
      range={{
        from: defaultConfig.rangeFrom as number,
        to: defaultConfig.rangeTo as number,
      }}
      maxDelta={defaultConfig.maxDelta as number}
      remaining={defaultConfig.remaining as number}
      isDescEnabled={defaultConfig.isDescEnabled as boolean}
    />
  </>
);

if (process.env.NODE_ENV === 'production') {
  const bugsnagClient = bugsnag({
    apiKey: bsConfig.API,
    appVersion,
  });
  bugsnagClient.use(bugsnagReact, React);
}

export default IndexPage;
