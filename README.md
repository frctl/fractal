# Fractal

Fractal is a toolkit for parsing and querying filesystem-based component libraries.

> _This is a developer preview of the core Fractal v2 component library parser, and should not be considered stable or complete. For more detail on this release see the [article on Medium](https://medium.com/@frctl/dev-preview-fractal-component-parser-v2-d119a1d8bac7#.rl1rsdpw3) or jump into the Fractal [Slack community](http://slack.fractal.build) for further discussion._

Fractal features a **plugin-based parsing engine** and a dynamic **entity API builder** to make it easily customisable to your needs. It is intended to be used as a dependency in tools such as static site builders, build systems and even in production applications to help deeply integrate your components into all stages of the development process.

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
<!-- [![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal) -->

```js
const Fractal = require('@frctl/fractal');

const fractal = Fractal({
  src: './path/to/src'
});

fractal.parse(function(err, components) {
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
* [Entity data schemas (components, files)](/docs/entity-schemas.md)

## Installation

```bash
npm i @frctl/fractal@next --save
```

## Requirements

Fractal requires [Node.js](https://nodejs.org) v6.0.0 or greater.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
