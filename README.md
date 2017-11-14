# Fractal v2 [beta]

**A toolkit for working with filesystem-based component libraries.**

---

This branch is for development of the work-in-progress Fractal **v2.0** release. Feel free to play around with it but be warned that breaking changes are likely to happen until we get to a stable release candidate :rocket:

For the current v1.x release codebase please switch to the [master branch](https://github.com/frctl/fractal/tree/master).

---

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![Coverage Status](https://img.shields.io/coveralls/frctl/fractal/v2.svg?style=flat-square)](https://coveralls.io/github/frctl/fractal?branch=v2)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal/beta.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)

## Getting started with the v2 beta

If you are curious about the v2 beta then please read the [overview](/docs/overview.md) first to get a feel for the scope and current status of the current beta release.

> **Please be aware that until the beta period is complete major (breaking) changes may still be made.** Where possible we will of course try to avoid this but please do not yet start building your production codebase on these early v2 beta versions unless you are prepared to spend time and effort updating between potentially unstable releases.

To get up and running with a sample project then there is some early documentation available in the [docs](/docs/) directory of this repository:

* [v2 overview and current beta status](/docs/overview.md)
* [Getting started](/docs/getting-started.md)
* [Project configuration](/docs/project-config.md)
* [Components, variants and scenarios](/docs/components-variants-scenarios.md)
* [View templates](/docs/view-templates.md)
* [Plugins and transforms](/docs/plugins-transforms.md)

You may also want to check out the [default starter project repo](https://github.com/frctl/fractal-starter-default) to get a feel for how some of the pieces fit together. (This repo is cloned when creating a new project via the `fractal-beta new` command).

## Requirements

Fractal v2 requires **Node v8.0+** (LTS) to run.

## Development and contributing

We are moving development of Fractal v2.0 and all first-party add-ons into a 'monorepo' format, using [Lerna](https://github.com/lerna/lerna) to help manage linking and publishing individual packages within the monorepo.

### Running locally

1. Clone this repository
2. Install dependencies - `npm install`
3. Bootstrap the packages together using Lerna - `npm run bootstrap`

### Tests

Code is linted via xo/eslint using the [Fractal eslint config](https://github.com/frctl/eslint-config-frctl), and tests are written using Mocha & Chai.

Test can be run with `npm test`. There are also NPM package scripts available for running subsets of the tests if required.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our other excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
