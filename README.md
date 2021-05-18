<!-- markdownlint-disable MD033 MD041 -->
<p align=center>
  <a href="https://fractal.build/" align=center>
    <img
        src="https://d33wubrfki0l68.cloudfront.net/5d2e88eb1e2b69f3f8b3a3372b6e4b3b4f095130/2159b/hero.png"
        alt=""
        width="110px">
  </a>
  <h1 align="center">Fractal</h1>
</p>

<br />
<div align="center">
  <!-- Github Actions -->
  <a href="https://github.com/frctl/fractal/actions" title="Build status">
    <img src="https://img.shields.io/github/workflow/status/frctl/fractal/test/main" alt="">
  </a>
  <!-- NPM Version -->
  <a href="https://www.npmjs.com/package/@frctl/fractal" title="Current version">
    <img src="https://img.shields.io/npm/v/@frctl/fractal.svg" alt="">
  </a>
  <!-- Discord -->
  <a href="https://discord.gg/vuRz4Yx" title="Chat with us on Discord">
    <img src="https://img.shields.io/badge/discord-join-7289DA" alt="">
  </a>
  <!-- NPM Downloads -->
  <a href="https://www.npmjs.com/package/@frctl/fractal" title="NPM monthly downloads">
    <img src="https://img.shields.io/npm/dm/@frctl/fractal" alt="">
  </a>
  <!-- License -->
  <a href="https://github.com/frctl/fractal/blob/main/LICENSE" title="MIT license">
    <img alt="GitHub" src="https://img.shields.io/github/license/frctl/fractal">
  </a>
</div>

<br />

Fractal is a tool to help you **build** and **document** web component libraries and design systems.

[Read the full Fractal documentation][docs]

## Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you assemble, preview and document website component libraries, or even scale up to document entire design systems for your organisation.

Check out the [documentation][docs] for more information.

## Requirements

You'll need a [supported LTS version](https://github.com/nodejs/Release) of Node. Fractal may work on unsupported versions, but there is no active support from Fractal and new features may not be backwards compatible with EOL versions of Node.

## Getting started

### Install into your project (recommended)

```shell
npm install @frctl/fractal --save-dev
```

Then create your `fractal.config.js` file in the project root, and configure using the [official documentation][docs].

Then you can either run `npx fractal start` to start up the project, or create an alias under the `scripts` section in your package.json as a shortcut.

e.g.

```json
"scripts": {
    "fractal:start": "fractal start --sync",
    "fractal:build": "fractal build"
}
```

then

```shell
npm run fractal:start
```

### Installing globally

```shell
npm i -g @frctl/fractal
```

This will also give you global access to the `fractal` command which you can use to scaffold a new Fractal project with `fractal new`.

The downside is that it's then difficult to use different Fractal versions on different projects.

This option is not recommended until a global Fractal install is capable of offloading to a project specific version.

## Examples

- Official demo (using Nunjucks): [demo.fractal.build](https://demo.fractal.build/)

  Repository: [demo.fractal.build](https://github.com/frctl/demo.fractal.build)
- Official examples are available in the [examples](./examples) directory. Although we primarily use them for developing and testing Fractal, they probably are a great resource for users as well.
- Additional public examples can be found on the [Awesome Fractal](https://github.com/frctl/awesome-fractal) repo.

## Contributing

Fractal has an active group of contributors but we are always looking for more help. If you are interested in contributing then please come and say hi on [Fractal's Discord server](https://discord.gg/vuRz4Yx).

Please note we have a [code of conduct](.github/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

### Reporting issues & requesting features

We use GitHub issues to track bugs and feature requests. Thank your for taking the time to submit your issue in one of [our repositories](https://github.com/frctl).

If you rather have a question, please ask it on [our Discord server](https://discord.gg/vuRz4Yx).

### Submitting pull requests

We will always welcome pull requests on any of the [frctl organisation](https://github.com/frctl) repositories. Please submit PRs against `main` branch with an explanation of your intention.

We use [conventional commits](https://www.conventionalcommits.org/), which means that every pull request title should conform to the standard.

### Development

This repository is a monorepo managed by Lerna. There is only one lockfile in root. This means that all packages must be installed in root, manually added to the packages' package.json files and then bootstrapped with lerna.

To do some work, run the following commands in root:
1. `npm ci`
2. `npm run bootstrap`

## Testing

Fractal is a project that evolved rapidly and organically from a proof-of-concept prototype into a more stable, mature tool. Because of this it's currently pretty far behind where it should be in terms of test coverage. Any contributions on this front would be most welcome!

Existing tests can be run using the `npm test` command.

## Contributors ✨

Thanks goes to [all wonderful people](https://github.com/frctl/fractal/graphs/contributors) who have helped us out.

Contributions of any kind welcome!

## License

[MIT](https://github.com/frctl/fractal/blob/main/LICENSE)

[docs]: https://fractal.build
