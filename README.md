# Fractal

> A flexible toolkit for working with filesystem-based component libraries.

[![Build Status](https://img.shields.io/travis/frctl/fractal/v2.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
<!-- [![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal) -->

---

This branch is for development of the work-in-progress Fractal version **2.0** release.
Feel free to play around with it but be warned that breaking changes are likely to happen until we get to a stable release candidate :rocket:

---

### Current status (v2.0)

A prototype build of Fractal v2.0, put together as a proof-of-concept, has been up and running for a little while now and has allowed us to explore a few options for the best way to implement some of the features and improvements discussed in [Moving Fractal forwards](https://github.com/frctl/fractal/issues/197). We are now ready to move public development into this `frctl/v2` branch to clean up the prototype code and work towards getting a proper beta release out. To this end we will now start migrating existing prototype code into this branch bit by bit, cleaning it up and adding tests as we go.

As soon as we have a beta release candidate together we will be soliciting feedback from anyone who feels brave enough to have a play with it :-)

### Development and contributing

We are moving development of Fractal v2.0 and all first-party add-ons into a 'monorepo' format, using [Lerna](https://github.com/lerna/lerna) to help manage linking and publishing individual packages within the monorepo and with [Yarn](https://github.com/yarnpkg/yarn) as the preferred NPM client.

#### Running locally

1. Clone this repository
2. Install dependencies - `npm install`
3. Bootstrap the packages together using Lerna - `npm run bootstrap`

#### Tests

Code is linted via xo/eslint using the [Fractal eslint config](https://github.com/frctl/eslint-config-frctl), and tests are written using Mocha & Chai.

Test can be run with `npm test`. There are also NPM scripts available for running subsets of the tests if required.

### Requirements

Fractal requires [Node.js](https://nodejs.org) v7.6.0 or greater.

### Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our other excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
