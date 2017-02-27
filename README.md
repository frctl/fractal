# Fractal

Fractal is a tool for parsing and querying filesystem-based component libraries.

It features a plugin-based engine to provide simple but powerful customisation and can be used to help you build, document and maintain component-library based projects from initial conception right through to production.

> _This is a WIP v2 rewrite of Fractal and should not be considered stable. Use at your own risk!_

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)

```js
const fractal = require('@frctl/fractal');

const parser = fractal({
  src: './path/to/src'
});

parser.parse(function(err, library) {
  if (err) {
    return console.log(err);
  }
  for (const component of library.getComponents()) {
    console.log(component.name);
  }
});

```

<!-- ## v2 Key goals

* Simplify and clarify component library structure and naming conventions
* Provide support for multiple concurrent template/view languages
* Add a robust plugin/extension system to allow for deep customisation -->

## Documentation

* [Component library structure and file naming conventions](/docs/directory-structure.md)
* [Parser API](/docs/parser.md)
* [Library API](/docs/library.md)
* [Data schema](/docs/data.md)

## Installation

```bash
npm i @frctl/fractal@v2 --save
```

## Requirements

Fractal requires [Node.js](https://nodejs.org) v6.0.0 or greater.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](http://clearleft.com) makes this project possible. Thank you!

[![Clearleft](http://clearleft.com/assets/img/logo.png)](http://clearleft.com)
