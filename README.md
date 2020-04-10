<!-- markdownlint-disable MD033 MD041 -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://allmarkedup.com"><img src="https://avatars1.githubusercontent.com/u/126726?v=4" width="100px;" alt=""/><br /><sub><b>Mark Perkins</b></sub></a><br /><a href="#question-allmarkedup" title="Answering Questions">💬</a> <a href="https://github.com/frctl/fractal/issues?q=author%3Aallmarkedup" title="Bug reports">🐛</a> <a href="https://github.com/frctl/fractal/commits?author=allmarkedup" title="Code">💻</a> <a href="#content-allmarkedup" title="Content">🖋</a> <a href="#design-allmarkedup" title="Design">🎨</a> <a href="https://github.com/frctl/fractal/commits?author=allmarkedup" title="Documentation">📖</a> <a href="#infra-allmarkedup" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/frctl/fractal/pulls?q=is%3Apr+reviewed-by%3Aallmarkedup" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/dkhuntrods"><img src="https://avatars0.githubusercontent.com/u/852397?v=4" width="100px;" alt=""/><br /><sub><b>dkhuntrods</b></sub></a><br /><a href="https://github.com/frctl/fractal/commits?author=dkhuntrods" title="Code">💻</a> <a href="#content-dkhuntrods" title="Content">🖋</a> <a href="https://github.com/frctl/fractal/commits?author=dkhuntrods" title="Documentation">📖</a> <a href="#eventOrganizing-dkhuntrods" title="Event Organizing">📋</a> <a href="#ideas-dkhuntrods" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-dkhuntrods" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/Chapabu"><img src="https://avatars0.githubusercontent.com/u/1395471?v=4" width="100px;" alt=""/><br /><sub><b>Matt Chapman</b></sub></a><br /><a href="#question-Chapabu" title="Answering Questions">💬</a> <a href="https://github.com/frctl/fractal/issues?q=author%3AChapabu" title="Bug reports">🐛</a> <a href="https://github.com/frctl/fractal/commits?author=Chapabu" title="Code">💻</a> <a href="https://github.com/frctl/fractal/commits?author=Chapabu" title="Documentation">📖</a> <a href="#ideas-Chapabu" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Chapabu" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Chapabu" title="Maintenance">🚧</a> <a href="#projectManagement-Chapabu" title="Project Management">📆</a> <a href="https://github.com/frctl/fractal/pulls?q=is%3Apr+reviewed-by%3AChapabu" title="Reviewed Pull Requests">👀</a> <a href="#tool-Chapabu" title="Tools">🔧</a></td>
    <td align="center"><a href="http://eida.st"><img src="https://avatars1.githubusercontent.com/u/1892091?v=4" width="100px;" alt=""/><br /><sub><b>Mihkel Eidast</b></sub></a><br /><a href="#question-risker" title="Answering Questions">💬</a> <a href="https://github.com/frctl/fractal/issues?q=author%3Arisker" title="Bug reports">🐛</a> <a href="https://github.com/frctl/fractal/commits?author=risker" title="Code">💻</a> <a href="#maintenance-risker" title="Maintenance">🚧</a> <a href="https://github.com/frctl/fractal/pulls?q=is%3Apr+reviewed-by%3Arisker" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://www.benoitburgener.ch"><img src="https://avatars1.githubusercontent.com/u/793344?v=4" width="100px;" alt=""/><br /><sub><b>Benoît Burgener</b></sub></a><br /><a href="#question-LeBenLeBen" title="Answering Questions">💬</a> <a href="https://github.com/frctl/fractal/issues?q=author%3ALeBenLeBen" title="Bug reports">🐛</a> <a href="https://github.com/frctl/fractal/commits?author=LeBenLeBen" title="Code">💻</a> <a href="https://github.com/frctl/fractal/commits?author=LeBenLeBen" title="Documentation">📖</a> <a href="#ideas-LeBenLeBen" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-LeBenLeBen" title="Maintenance">🚧</a> <a href="https://github.com/frctl/fractal/pulls?q=is%3Apr+reviewed-by%3ALeBenLeBen" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/levito"><img src="https://avatars0.githubusercontent.com/u/70500?v=4" width="100px;" alt=""/><br /><sub><b>Veit Lehmann</b></sub></a><br /><a href="https://github.com/frctl/fractal/commits?author=levito" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


[docs]: https://fractal.build
