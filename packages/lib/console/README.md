# Fractal Console

Formatted console log output for [Fractal](http://github.com/frctl/fractal) CLI commands.

[![NPM Version](https://img.shields.io/npm/v/@frctl/console.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/utils)

## Installation

```
npm i @frctl/console
```

## Usage

```js
const log = require('@frctl/console');

log.write(`
  <bold>This is a log message</bold>.
  You can use <green>XML-style tags<green> to style the output.
`);

log.error(new Error('Oops, something bad happened!'));

log.success('A pre-formatted success message <dim>(with some additional styling via tags)</dim>');

log.warning(`
  A pre-formatted warning message
  spit across
  multiple lines
`);

```

## Requirements

Requires Node >= v7.6
