# Fractal

Fractal is a tool for parsing and querying filesystem-based component libraries.

> _This is a developer preview of the core Fractal v2 component library parser, and should not be considered stable or complete. You can get an overview of the architectural and conceptual changes coming in Fractal v2 in the '[Fractal Iterations](https://medium.com/@frctl/fractal-iterations-c9c42e19d3e0)'' article on Medium, or jump into the Fractal [Slack community](http://slack.fractal.build) for further discussion._

Fractal features a **plugin-based parsing engine** and a dynamic **entity API builder** to make it easily customisable to your needs. It is intended to be used as a dependency in tools such as static site builders, build systems and even in production applications to help deeply integrate your components into all stages of the development process.

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
<!-- [![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal) -->

```js
const Fractal = require('@frctl/fractal');

const fractal = Fractal({
  src: './path/to/src'
});

fractal.parse(function(err, components, files) {
  if (err) {
    return console.log(err);
  }
  for (const component of components.getAll()) {
    console.log(component.name);
  }
});

```

## Documentation

Fractal v2 docs are currently a work in progress, but the following should be enough to get started if you are feeling adventurous:

* [Component library structure and file naming conventions](/docs/directory-structure.md)
* [Fractal API](/docs/fractal.md)
* [Entity APIs (components, files)](/docs/entity-apis.md)
* [Entity data schemas (components, collections, files)](/docs/entity-schemas.md)

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
