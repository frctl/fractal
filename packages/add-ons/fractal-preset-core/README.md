# Fractal core preset

Core set of commands, plugins and adapters for Fractal.

## Installation & usage

> This preset is automatically included by Fractal unless one or more other presets are specified.

Install from NPM:

```
npm i @frctl/fractal-preset-core
```

Then add `'@frctl/fractal-preset-core'` to the `extends` array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  extends: [
    '@frctl/fractal-preset-core'
  ]
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
