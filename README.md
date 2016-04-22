# Fractal

A tool to help you **build**, **document** and **integrate** component/pattern libraries into your web projects.

[![Build Status](https://img.shields.io/travis/frctl/fractal.svg?style=flat-square)](https://travis-ci.org/frctl/fractal)
[![NPM Version](https://img.shields.io/npm/v/@frctl/fractal.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/fractal)
[![Dependencies](https://img.shields.io/david/frctl/fractal.svg?style=flat-square)](https://david-dm.org/frctl/fractal)


## Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you **assemble**, **preview** and **document** website component libraries, and then **integrate** them into your web projects and build processes using custom commands and plugins.

Fractal can be run from the command line or integrated into your project via it's API.

> _**Important:** Fractal is currently considered to be in beta. Until it reaches a 1.0 release there may be breaking changes in minor point-releases (in accordance with [SemVer](http://semver.org/))._

Read the [Fractal documentation](/docs/README.md).

## Why Fractal?

Existing tools to help you build these component libraries often force you to use a particular template language, a specific build tool or a pre-determined way to organise the individual elements within your library. They generate a web preview to allow you to browse your rendered components, but generally aren't able to help much when it comes to integrating your component library into your build process or live site.

**Fractal is different:**

* **Flexible**: Complete freedom to use whichever templating language, build tool and organisational model best suits your project. Build your components using the same tools that you use for your production site.
* **Integrated**: Fractal can help you seamlessly integrate your component library into your site, app or build tools by including it as a dependency in your build. Plugins and custom commands can help you build a smart, component-focussed workflow to ensure your component library is a living part of your application.
* **Data-driven**: Component preview data can hardcoded or dynamically generated any way you like - for instance using libraries such as Faker or from HTTP API calls.

The [web UI plugin](/docs/web/overview.md) provides a web-based way to browse your component library, either running as a local web server or as a static HTML export. A **powerful theme API** means you can create your own web UI themes from scratch or by customising the default theme to your liking.

## Quick Start

1. Install the Fractal CLI helper globally: `npm i  -g @frctl/fractal`
2. Create a new project skeleton and install dependencies: `fractal new project-name`
3. Switch into the project directory: `cd project-name`
4. Launch the [web UI](/docs/web/overview.md) server using the `fractal start --watch` [command](/docs/commands.md) and then browse to `http://localhost:3000` (there won't be much there to begin with!)
5. Start [building components](/docs/guides/creating-components.md) and [writing documentation](/docs/documentation/overview.md), or slow down and read the [full documentation](/docs/README.md) first :-)

## Documentation

Fractal documentation is currently a work-in-progress. Feel free to [open an issue](https://github.com/frctl/fractal/issues) if you find anything that is misleading or unclear!

[**Read the documentation**](/docs/README.md).

## Requirements

Fractal makes use of a number of ES6 features that mean it currently requires [Node.js](https://nodejs.org) v4.0+ to run.

## Testing

Fractal is a project that has recently evolved rapidly and organically from a proof-of-concept prototype into a more stable, mature tool. Because of this it's currently pretty far behind where it should be in terms of test coverage. Any contributions on this front would be most welcome!

Existing tests can be run using the `npm test` command.

## Credits

Fractal is developed and maintained by [Mark Perkins](http://github.com/allmarkedup) and the dev team at [Clearleft](http://clearleft.com).

Additional thanks to [Paul Lloyd](https://twitter.com/paulrobertlloyd) for his tireless work sniffing out bugs and his design input on the [default web UI theme](https://github.com/frctl/mandelbrot).

[![Clearleft](http://clearleft.com/assets/img/logo.png)](http://clearleft.com)
