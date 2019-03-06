import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withTests } from '@storybook/addon-jest';
import { withA11y } from '@storybook/addon-a11y';
import results from '../stories/jest-test-results.json';

addParameters({
  backgrounds: [
    { name: 'white', value: '#ffffff', default: true },
    { name: 'light', value: '#eeeeee' },
    { name: 'gray', value: '#cccccc' },
    { name: 'dark', value: '#222222' },
    { name: 'black', value: '#000000' },
  ],
})
addDecorator(withKnobs);
addDecorator(withTests({
  results,
}));
addDecorator(withA11y)

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

configure(loadStories, module);
