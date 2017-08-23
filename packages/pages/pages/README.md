# Fractal Pages

A static site builder for Fractal.

Fractal Pages lets you generate styleguides, create documentation, or build prototypes that seamlessly incorporate your Fractal components.

## Installation

Install from NPM:

```
npm i @frctl/pages
```

Then add `'@frctl/pages'` to the `extensions` array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  extensions: [
    '@frctl/pages'
  ]
}
```

## Requirements

* Node >= v7.6
* Fractal >= v2.0
