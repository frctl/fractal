# Fractal core preset

Core set of plugins, adapters and transforms for Fractal.

## Installation & usage

> This preset is automatically included by Fractal unless one or more other presets are specified.

Install from NPM:

```
npm i @frctl/fractal-preset-core
```

Then add `'@frctl/fractal-preset-core'` to the `fractal.presets` array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  fractal {
    presets: [
      '@frctl/fractal-preset-core'
    ]
  }
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
