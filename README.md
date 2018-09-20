---
## Current project status - please read!

As you may be aware, changes in Fractal's core team meant that new development on this project was restricted for a time.

In order to safeguard its future, we decided to ask our community for help, and the response has been overwhelming. **We've received so many offers of support in all forms that we can safely say that development will be starting up again shortly. Thank you all!**

Please see [issue #449](https://github.com/frctl/fractal/issues/449) ('An update on Fractal's future development') for more details about how we are planning on moving Fractal forwards in the future.

Currently the 1.x (master) branch is stable and is being used in many projects. Documentation for this version is available at https://fractal.build. The 2.0 (beta) branch is _not_ recommended for use as there are many outstanding issues + bugs, limited documentation and no active development at this time.

---

# Fractal

Fractal is a tool to help you **build** and **document** web component libraries and then **integrate** them into your projects.

[![Build Status](https://img.shields.io/travis/frctl/fractal/master.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![Greenkeeper badge](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)

**Read the Fractal documentation at http://fractal.build/guide.**

## Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you assemble, preview and document website component libraries, and then integrate them into your web sites, apps and build processes to create joined up, 'living' projects.

Fractal can be run from the command line or integrated into your project via its API.

Check out the the [Fractal documentation](http://fractal.build/guide) for more information.

## Demo

There is no 'official' demo for Fractal up yet, but [bits.24ways.org](http://bits.24ways.org) (repository: https://github.com/24ways/frontend) is an excellent example of a component library built on Fractal. Kudos to [@paulrobertlloyd](https://github.com/paulrobertlloyd) for his great work!

## Requirements

Any LTS (Long-term stable) version of NodeJS. At the time of writing this is 6 (Boron) and 8 (Carbon).

If you're on an earlier (unsupported) version of NodeJS, then see the below compatibility table.

| NodeJS version | Fractal version |
| -------------- | --------------- |
| 4.x            | 1.17            |
| 5.x            | 1.17            |

## Testing

Fractal is a project that has recently evolved rapidly and organically from a proof-of-concept prototype into a more stable, mature tool. Because of this it's currently pretty far behind where it should be in terms of test coverage. Any contributions on this front would be most welcome!

Existing tests can be run using the `npm test` command.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
