# Fractal Web UI

The Fractal web UI provides a web-based interface to browse your components and their associated files, as well as read project documentation. The UI itself relies on themes to both generate the visual interface and to provide specific functionality.

The web UI functionality itself is actually just a [Fractal plugin](/docs/plugins/overview.md), although it comes bundled with Fractal by default so you won't ever need to install it separately.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started with the web UI](#getting-started-with-the-web-ui)
  - [Starting the local development server](#starting-the-local-development-server)
  - [Building a static version of the web UI](#building-a-static-version-of-the-web-ui)
- [Configuration options](#configuration-options)
  - [Static assets path](#static-assets-path)
  - [Theme](#theme)
  - [Build directory](#build-directory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started with the web UI

The web UI can be accessed in two ways:

1. You can start a **local server** to run it *dynamically*, which will mean that any local changes to your components or documentation pages are immediately reflected in the UI. This is great for when you are *developing* your component library.
2. You can generate a **static build** of the web UI, which is great for when you are ready to upload it to a server to share with others.

> This documentation assumes that you are using the [Fractal interactive CLI](/docs/commands.md#the-fractal-interactive-cli-sparkles). To enter interactive mode, run the `fractal` command in your terminal (from within your project directory) before using the commands below.

### Starting the local development server

You can use the command `start` from within your project directory to start the local web server. It will start and then give you a local URL (for example `http://localhost:3000`) that you can use to view the web UI. Fractal will automatically find an available port to run the server on and give you a URL once it has started.

You can provide the following (optional) command line options to override the default configuration:

* `-p, --port <port-number>` - the port number to use, for example `5000`.
* `-t, --theme <theme-name>` - a custom theme to use.
* `-s, --sync` - whether to use [BrowserSync](https://www.browsersync.io) to provide auto-refresh and syncing capabilities
* `-c, --colorscheme <scheme-name>` - The theme colour scheme to use (if supported by your theme)

> Note that themes must be installed before they can be used. See the [themes documentation](/docs/web/themes.md) for more information on creating and using custom themes.

As an example, the command:

```shell
start --port 4000 --theme my-custom-theme
```

Would start the preview server at the URL `http://localhost:4000` using the custom theme `my-custom-theme`

### Building a static version of the web UI

You can use the `build` command to build a static HTML/CSS/JS version of the web UI. The static version will be generated into the directory specified in your project configuration, or a directory called `build` if not specified.

You can provide the following optional  command line options to override the default configuration:

* `-t, --theme <theme-name>` - a custom theme to use.

```shell
build --theme my-custom-theme
```

Would generate a static build using the custom theme `my-custom-theme`.

## Configuration options

You can override the default web UI configuration in your [project settings file](#web-ui-settings).

> Note: Themes may additionally offer additional configuration items in addition to the basic set of web UI config outlined below.

 The available options are:

### Static assets path

The path to the directory where your static assets live. Any assets within this directory will be made available to your components and preview layouts at a URL path relative to this directory.

```js
fractal.set('plugins.web.static.path', 'public');
```
### Theme

The theme you'd like to use for the web preview UI. Note that you must install the theme as a NPM dependency as well as specifying it's name here. See the [web UI documentation](/docs/web/overview.md) for more information.

```js
fractal.set('plugins.web.theme', 'my-custom-theme');
```

### Build directory

The directory within which the static build should be generated.

```js
fractal.set('plugins.web.build.dest', 'build');
```
