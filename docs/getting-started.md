# Getting started with the v2 beta

The following guide outlines how to get you up and running with a fresh v2-based project for the purposes of experimenting with the latest beta release.

## 1. Install the CLI

> During the beta period the new v2 CLI will be installed under the command name `fractal-beta` to prevent it conflicting with the v1 CLI tool. This will change once a stable release is available.

You can install the CLI tool globally via NPM:

```
npm install --global @frctl/cli@beta
```

Once that has run, you can use following command to check that it has installed correctly:

```
fractal-beta
```

You should see a list of available commands and some other information printed out in the terminal.

## 2. Create a new project

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

### Project configuration

All project configuration data lives in the `fractal.config.js` file. Within this file, configuration for the core parsing/rendering engine should be added under the `app` key.

Tools built on top of the core engine (such as the CLI, Inspector and Pages) can each have configuration data provided under the appropriate namespace within this project configuration file.

## 3. Start the Inspector

The **Fractal Inspector** is a browser-based tool to help preview and test components during development.

> The Inspector is currently at a very early stage of development and will likely change significantly during the beta period.

It's already included in default starter project as a dependency so you can start it by running the following command in the root of your project:

```
fractal-beta inspect
```
This will start a local server and display the URL you can access it at in the terminal output. Paste this URL into a browser to bring up the Inspector UI.

You should be able to see a list of the components in the starter project in the sidebar on the left. Clicking on a component will give you a preview of all the variants of that component using the 'scenario' data supplied in the component's `config.js` configuration file.

## 4. Generate a styleguide

**Fractal Pages** is a 'component aware' static site builder that lets you build styleguides and prototypes using a system that has full access to your component library via the Fractal API.

It is intentionally similar to Jekyll, and uses Nunjucks for templating. However its most powerful aspect is a configuration-based routing mechanism to allow you to dynamically generate pages based on items in a collection - for example components in your library.

The default starter project already includes a few basic templates to demonstrate how to build a styleguide with Fractal Pages. These can be found in the `styleguide` directory within the root of the starter project.

### Starting the Pages dev server

To launch the Pages development server, open a new terminal window and run the command:

```
fractal-beta author
```

This will start another local web server and provide you with a URL at which you can browse the example site.

> In development mode (the default state) the pages are generated on request and in-memory, and are not written to the file system.

### Performing a static build

To run a full static build of the site, stop the development server (using `^C`) and then run the following command:

```
fractal-beta author --build
```

The site will be generated into the `dist` directory and can then be deployed or shared as required.

### Configuration

Config data for Fractal Pages sites lives in the main `fractal.config.js` file under the `pages` key.
