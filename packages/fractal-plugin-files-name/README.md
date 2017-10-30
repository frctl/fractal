# Fractal file name plugin

Adds a name property to Fractal File objects, stripping positional prefixes.

## Installation & usage

Install from NPM:

```
npm i @frctl/fractal-plugin-files-name
```

Then add `'@frctl/fractal-plugin-files-name'` to the `app.plugins` array in your project's Fractal configuration file:

```js
// fractal.config.js

module.exports = {
  app {
    plugins: [
      '@frctl/fractal-plugin-files-name'
    ]
  }
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
