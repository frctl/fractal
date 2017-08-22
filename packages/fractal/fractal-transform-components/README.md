# Fractal component transform

Core component transform for Fractal.

Bundled as part of the Fractal core preset so you probably don't need to install this directly.

## Installation & usage

Install from NPM:

```
npm i @frctl/fractal-transform-components
```

Then add `'@frctl/fractal-transform-components'` to the `fractal.transforms` array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  fractal {
    transforms: [
      '@frctl/fractal-transform-components'
    ]
  }
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
