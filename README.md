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

The following guide outlines how to get you up and running with a fresh v2-based project for the purposes of experimenting with the latest beta release.

**Please be aware that until the beta period is complete major (breaking) changes may still be made.** Where possible we will of course try to avoid this but please do not yet start building your production codebase on these early v2 beta versions unless you are prepared to spend time and effort updating between potentially unstable releases.

### 1. Install the CLI

> During the beta period the new v2 CLI will be installed under the command name `fractal-beta` to prevent it conflicting with the v1 CLI tool. This will change once a stable release is available.

You can install the CLI tool globally via NPM:

```
npm install --global @frctl/cli
```

Once that has run, you can use following command to check that it has installed correctly:

```
fractal-beta
```

You should see a list of available commands and some other information printed out in the terminal.

### 2. Create a new project

The `fractal-beta new` command uses the [Fractal default starter project](https://github.com/frctl/fractal-starter-default) to  create a new v2 skeleton project structure and installs all required dependencies:

```
fractal-beta new DIRECTORY_NAME
```

Replace `DIRECTORY_NAME` with the name of the project folder you want to create and the starter project files will be installed in that location.

Once the command has run, you should get a success message telling you that everything has been downloaded and installed correctly.

The standard starter directory structure contains:

- `fractal.config.js` - the main project configuration file.
- `lib/components/` - a component library directory containing a couple of example components.
- `styleguide` - a directory containing some basic templates to demonstrate how to build a styleguide with Fractal Pages.
- ...and a few other Git/NPM related files that you are probably familiar with.

#### Project configuration

All project configuration data lives in the `fractal.config.js` file. Within this file, configuration for the core parsing/rendering engine should be added under the `app` key.

Tools built on top of the core engine (such as the CLI, Inspector and Pages) can each have configuration data provided under the appropriate namespace within this project configuration file.

### 3. Start the Inspector

The **Fractal Inspector** is a browser-based tool to help preview and test components during development.

> The Inspector is currently at a very early stage of development and will likely change significantly during the beta period.

It's already included in default starter project as a dependency so you can start it by running the following command in the root of your project:

```
fractal-beta inspect
```
This will start a local server and display the URL you can access it at in the terminal output. Paste this URL into a browser to bring up the Inspector UI.

You should be able to see a list of the components in the starter project in the sidebar on the left. Clicking on a component will give you a preview of all the variants of that component using the 'scenario' data supplied in the component's `config.js` configuration file.

### 4. Generate a styleguide

**Fractal Pages** is a 'component aware' static site builder that lets you build styleguides and prototypes using a system that has full access to your component library via the Fractal API.

It is intentionally similar to Jekyll, and uses Nunjucks for templating. However its most powerful aspect is a configuration-based routing mechanism to allow you to dynamically generate pages based on items in a collection - for example components in your library.

The default starter project already includes a few basic templates to demonstrate how to build a styleguide with Fractal Pages. These can be found in the `styleguide` directory within the root of the starter project.

#### Starting the Pages dev server

To launch the Pages development server, open a new terminal window and run the command:

```
fractal-beta author
```

This will start another local web server and provide you with a URL at which you can browse the example site.

> In development mode (the default state) the pages are generated on request and in-memory, and are not written to the file system.

#### Performing a static build

To run a full static build of the site, stop the development server (using `^C`) and then run the following command:

```
fractal-beta author --build
```

The site will be generated into the `dist` directory and can then be deployed or shared as required.

#### Configuration

Config data for Fractal Pages sites lives in the main `fractal.config.js` file under the `pages` key.


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
