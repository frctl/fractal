<!-- markdownlint-disable MD033 MD041 -->
<p align=center>
  <a href="" align=center>
    <img
        src="https://d33wubrfki0l68.cloudfront.net/5d2e88eb1e2b69f3f8b3a3372b6e4b3b4f095130/2159b/hero.png"
        alt=""
        style="width:110px">
  </a>
  <h1 style="text-align: center">Fractal</h1>
</p>

<br />
<div style="text-align: center">
  <!-- Travis -->
  <a href="https://travis-ci.org/frctl/fractal">
    <img src="https://img.shields.io/travis/frctl/fractal?label=travis%20ci" alt="">
  </a>
  <!-- NPM Version -->
  <a href="https://www.npmjs.com/package/@frctl/fractal" title="Current version">
    <img src="https://img.shields.io/npm/v/@frctl/fractal.svg" alt="">
  </a>
  <!-- Discord -->
  <a href="https://www.npmjs.com/package/@frctl/fractal" title="Chat with us on Discord">
    <img src="https://img.shields.io/badge/discord-join-7289DA" alt="">
  </a>
  <!-- NPM Downloads -->
  <a href="https://www.npmjs.com/package/@frctl/fractal" title="NPM monthly downloads">
    <img src="https://img.shields.io/npm/dm/@frctl/fractal" alt="">
  </a>
</div>

<br />

Fractal is a tool to help you **build** and **document** web component libraries and design systems.

[Read the full Fractal documentation][docs]

## Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you assemble, preview and document website component libraries, or even scale up to document entire design systems for your organisation.

Check out the the [documentation][docs] for more information.

## Requirements

You'll need a [supported LTS version](https://github.com/nodejs/Release) of Node. Fractal may work on unsupported versions, but there is no active support from Fractal and new features not be backwards compatible with EOL verions of Node.

## Getting started

### Install into your project (recommended)

```shell
npm install @frctl/fractal
```

Then create your `fractal.js` file in the project root, and configure using the [official documentation][docs].

### Installing globally

```shell
npm i -g @frctl/fractal
```

This will also give you global access to the `fractal` command which you can use to scaffold a new Fractal project with `fractal new`.

The downside is that it's then difficult to use different Fractal versions on different projects.

This option is not recommended until a global Fractal install is capable of offloading to a project specific version.

## Demo

There is no 'official' demo for Fractal up yet, but [bits.24ways.org](http://bits.24ways.org) (repository: https://github.com/24ways/frontend) is an excellent example of a component library built on Fractal. Kudos to [@paulrobertlloyd](https://github.com/paulrobertlloyd) for his great work!

## Testing

Fractal is a project that has recently evolved rapidly and organically from a proof-of-concept prototype into a more stable, mature tool. Because of this it's currently pretty far behind where it should be in terms of test coverage. Any contributions on this front would be most welcome!

Existing tests can be run using the `npm test` command.

## Contributing

Fractal has an active group of contributors but we are always looking for more help. If you are interested in contributing then please come and say hi on [Fractal's Discord server](https://discord.gg/vuRz4Yx) - or of course we will always welcome pull requests on any of the [frctl organisation](https://github.com/frctl) repos.

Please note we have a [code of conduct](.github/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](https://clearleft.com) makes this project possible. Thank you!

<a href="https://clearleft.com"><img width="110" src="http://clearleft.s3.amazonaws.com/logo.png"></a>

[docs]: https://fractal.build
