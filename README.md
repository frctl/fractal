# Fractal

Fractal is a tool to help you **build** and **document** web component libraries and then **integrate** them into your projects.

[![Build Status](https://img.shields.io/travis/frctl/fractal/master.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)
[![Slack Status](http://slack.fractal.build/badge.svg)](http://slack.fractal.build)

**Read the Fractal documentation at http://fractal.build/guide.**

## Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you assemble, preview and document website component libraries, and then integrate them into your web sites, apps and build processes to create joined up, 'living' projects.

Fractal can be run from the command line or integrated into your project via its API.

Check out the the [Fractal documentation](http://fractal.build/guide) for more information.

## Demo

There is no 'official' demo for Fractal up yet, but [bits.24ways.org](http://bits.24ways.org) (repository: https://github.com/24ways/frontend) is an excellent example of a component library built on Fractal. Kudos to [@paulrobertlloyd](https://github.com/paulrobertlloyd) for his great work!

## Requirements

Fractal requires [Node.js](https://nodejs.org) v4.4.7+

It is the intention that Fractal’s Node.js version support will track the latest Node LTS release version.

## Testing

Fractal is a project that has recently evolved rapidly and organically from a proof-of-concept prototype into a more stable, mature tool. Because of this it's currently pretty far behind where it should be in terms of test coverage. Any contributions on this front would be most welcome!

Existing tests can be run using the `npm test` command.

## Password protection

to password protect the website, please set the following environment variables
```
FRACTAL_USERNAME=A_USERNAME
FRACTAL_PASSWORD=A_PASSWORD

```

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>
