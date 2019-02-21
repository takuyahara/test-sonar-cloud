import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { withViewport } from '@storybook/addon-viewport';
import { QrcodeDecorator } from './addon-qrcode';

// https://github.com/storybooks/storybook/tree/v4.0.0-alpha.23/addons/options
withOptions({
  addonPanelInRight: false
});
addDecorator(withNotes);
addDecorator(withKnobs);
addDecorator(withViewport());
addDecorator(QrcodeDecorator);

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /.stories.tsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ""
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action("NavigateTo:")(pathname)
}

configure(loadStories, module)
