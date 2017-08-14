# Fractal info command

A Fractal CLI command to display information about the current Fractal project and environment.

## Installation & usage

> This command is for use with the Fractal CLI tool, which must be installed separately.

Install from NPM:

```
npm i @frctl/fractal-command-info
```

Then add `'@frctl/fractal-command-info'` to the commands array in your project's Fractal configuration file:

```js
// fractal.config.js
module.exports = {
  commands: [
    '@frctl/fractal-command-info'
  ]
}
```

Unless otherwise configured it will now be available as the default CLI command - run `fractal` from the command line to view info about the current project and more.

## Requirements

## Requirements

* Node >= v7.6
* Fractal >= v2.0
* Fractal CLI >= v2.0
