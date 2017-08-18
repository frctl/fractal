# Fractal CLI core preset

Core set of commands for the Fractal CLI.

## Installation & usage

> This preset is automatically included by the Fractal CLI unless one or more other presets are specified.

Install from NPM:

```
npm i @frctl/cli-preset-core
```

Then add `'@frctl/cli-preset-core'` to the `cli.presets` array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  cli {
    presets: [
      '@frctl/cli-preset-core'
    ]
  }
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
