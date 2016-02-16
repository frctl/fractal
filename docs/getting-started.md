# Getting started

Fractal is distributed as an NPM module, and currently **requires NodeJS v5.0+** to run.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Install the CLI helper globally](#install-the-cli-helper-globally)
  - [Create a new Fractal project](#create-a-new-fractal-project)
    - [Either - Using the quick start repository](#either---using-the-quick-start-repository)
    - [Or - Manual installation and setup](#or---manual-installation-and-setup)
- [Running commands](#running-commands)
  - [Checking Fractal has installed correctly](#checking-fractal-has-installed-correctly)
  - [Starting the preview UI server](#starting-the-preview-ui-server)
  - [Building a static version of the preview UI](#building-a-static-version-of-the-preview-ui)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

### Install the CLI helper globally

If you have never worked on a Fractal project before, you will first need to install a global Fractal instance to help run commands from the command line. You only need to do this **once per machine**.

```shell
npm i @frctl/fractal -g
```

### Create a new Fractal project

There are a couple of ways to get started with Fractal:

#### Either - Using the quick start repository

The easiest way to get started with Fractal is to grab a copy of the [quick start project boilerplate](https://github.com/frctl/quick-start) from Github and then customise it to fit your needs.

1. Download the [zip file of the quick start repository](https://github.com/frctl/skeleton/archive/master.zip).
2. Unzip into a location of your choosing.
3. Open the project folder in you command line tool of choice.
4. Install the dependencies: `npm install`

See the [frctl/quick-start](https://github.com/frctl/quick-start) repository for more details.

#### Or - Manual installation and setup

Fractal needs to be installed as a per-project dependency. If you haven't already, create a new project directory and run `npm init` to create a `package.json` file.

Then install Fractal into your project using the command:

```
npm i @frctl/fractal --save
```

You should then create a `fractal.js` file in the root of your project. This is where you will configure your Fractal instance.

At a bare minimum, this file should `require` the Fractal at the top as follows, and tell Fractal where to find your components directory:

```js
const fractal = require('@frctl/fractal');

fractal.set('components.path', 'path/to/components');
```

## Running commands

The standard way to interact with Fractal is via the command line. All commands must be run from within the root directory of your project and take the following format:

```shell
fractal <command> [args] [opts]
```
The default installation of Fractal provides two commands - `start` and `build`.

### Checking Fractal has installed correctly

You can check Fractal has installed correctly and see the available commands by running the `fractal` command with no further arguments:

```shell
fractal
```

You should see some information about Fractal, as well as a list of currently available commands that can be run.

### Starting the preview UI server

The `start` command starts a web server to provide a nice visual way to browse the patterns in your component library. You can start the server from the CLI using the command:

```shell
fractal start
```

### Building a static version of the preview UI

If you want to export a static HTML version of the web preview interface, you can use the build command as follows:

```shell
fractal build
```

This will export a static version of the web UI into a directory in the root of your project.
