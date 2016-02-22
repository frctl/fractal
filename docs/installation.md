# Installation

Fractal is distributed as an NPM module, and currently **requires NodeJS v4.0+** to run.

Fractal installation happens in two parts - a global CLI (command line interface) installation that only needs to done once per machine, and a per-project, local Fractal installation which is added to the project's NPM dependencies.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [1. Install the CLI helper globally](#1-install-the-cli-helper-globally)
- [2. Create a new Fractal project](#2-create-a-new-fractal-project)
  - [Using the `new` command](#using-the-new-command)
  - [Using the quick start repository](#using-the-quick-start-repository)
  - [Manual installation and setup](#manual-installation-and-setup)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 1. Install the CLI helper globally

If you have never worked on a Fractal project before, you will first need to install a global Fractal instance to help run commands from the command line. You only need to do this **once per machine**.

```shell
npm i @frctl/fractal -g
```

## 2. Create a new Fractal project

There are a few different ways to get started with Fractal:

### Using the `new` command

You can use the command `fractal new <project-name>` to create a new project file structure and install the required local Fractal dependency. The `project-name` you use will be the name of the new folder that is created. For example:

```shell
fractal new my-project
```

Will create the folder 'my-project' in the current directory.

When you run the command, it will ask you a few questions about how you want your project organised, and then create a fairly minimal new project structure for you, including a `fractal.js` project settings file all set up and ready to customise.

### Using the quick start repository

If you want a more fully-featured starting point, you can grab a copy of the [quick start project boilerplate](https://github.com/frctl/quick-start) from Github and then customise it to fit your needs.

1. Download the [zip file of the quick start repository](https://github.com/frctl/quick-start/archive/master.zip).
2. Unzip into a location of your choosing.
3. Open the project folder in you command line tool of choice.
4. Install the dependencies: `npm install`

See the [frctl/quick-start](https://github.com/frctl/quick-start) repository for more details.

### Manual installation and setup

Fractal needs to be installed as a per-project dependency. If you haven't already, create a new project directory and run `npm init` to create a `package.json` file.

Then install Fractal into your project using the command:

```
npm i @frctl/fractal --save
```

You should then create a `fractal.js` file in the root of your project. This is where you will add your global project settings.

At a bare minimum, this file should `require` the Fractal at the top as follows, and tell Fractal where to find your components directory:

```js
const fractal = require('@frctl/fractal');

fractal.set('components.path', 'path/to/components');
```
