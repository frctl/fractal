# Fractal v2 [beta]

**A toolkit for working with filesystem-based component libraries.**

---

This branch is for development of the work-in-progress Fractal version **2.0** release.

Feel free to play around with it but be warned that breaking changes are likely to happen until we get to a stable release candidate :rocket:

For the current v1.x release codebase please switch to the [master branch](https://github.com/frctl/fractal/tree/master).

---

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![Coverage Status](https://img.shields.io/coveralls/frctl/fractal/v2.svg?style=flat-square)](https://coveralls.io/github/frctl/fractal?branch=v2)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal/beta.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)

## Fractal v2 - overview

v2 is a major update to Fractal with many breaking changes from the v1.x branch. It is not compatible with component libraries developed using previous versions.

The new version is based around a **plugin-based filesystem parser** and **adapter-based component renderer** which can be configured and extended to closely fit the needs of your project.

The v1 'web UI' has been replaced by two separate, (optional) tools, both of which are built on top of the core parsing/rendering engine:

- **Fractal Inspector** - A locally-run web app for previewing and debugging your components in the browser
- **Fractal Pages** - A static site builder with deep integration into your component library to let you build completely bespoke styleguides, prototypes and more.

The core library also exposes a greatly improved **programmatic API** which can be used to integrate Fractal directly into your site or build tools.

And lastly, the v2 **Command Line Interface (CLI)** tool has been simplified to make it easier to develop and use third-party commands. Access to the core API gives commands much more flexibility and better insight into your component library.

Other key features of Fractal v2 include:

* Improved project configuration
* Variant-specific views using template pre-processing
* Flexible preview data definition for components and variants based on 'scenarios'
* Webpack-style aliasing of dependency paths within config files
* Much better test coverage and linting
* And more...

## Getting started with the v2 beta

If you are curious about the v2 beta and want to get up and running with a project to let you experiment with it then please see the [Getting Started guide](docs/getting-started.md).

**Please be aware that until the beta period is complete major (breaking) changes may still be made.** Where possible we will of course try to avoid this but please do not yet start building your production codebase on these early v2 beta versions unless you are prepared to spend time and effort updating between potentially unstable releases.

## Development and contributing

We are moving development of Fractal v2.0 and all first-party add-ons into a 'monorepo' format, using [Lerna](https://github.com/lerna/lerna) to help manage linking and publishing individual packages within the monorepo.

### Running locally

1. Clone this repository
2. Install dependencies - `npm install`
3. Bootstrap the packages together using Lerna - `npm run bootstrap`

### Tests

Code is linted via xo/eslint using the [Fractal eslint config](https://github.com/frctl/eslint-config-frctl), and tests are written using Mocha & Chai.

Test can be run with `npm test`. There are also NPM package scripts available for running subsets of the tests if required.

## Requirements

Fractal requires [Node.js](https://nodejs.org) v7.6.0 or greater.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our other excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
