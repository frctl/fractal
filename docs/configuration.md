## Global Configuration

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Configuring plugins](#configuring-plugins)
  - [Configuring individual components and pages](#configuring-individual-components-and-pages)
- [General configuration options](#general-configuration-options)
      - [Project title](#project-title)
- [Components configuration options](#components-configuration-options)
    - [Directory path](#directory-path)
    - [Template engine](#template-engine)
    - [File extension](#file-extension)
    - [Default status](#default-status)
- [Docs configuration options](#docs-configuration-options)
    - [Directory path](#directory-path-1)
    - [Template engine](#template-engine-1)
    - [File extension](#file-extension-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Every Fractal project needs a file called `fractal.js` located in it's root directory. This file is used to import the Fractal module and then set any configuration options as required.

Config values can be set using `fractal.set(key, value)`. The `key` argument can be a dot notation path in order to set nested values. For example:

```js
var fractal = require('@frctl/fractal');

fractal.set('components.path', 'path/to/components');
fractal.set('project.title', 'My Project Name');
fractal.set('components.status.default', 'wip');
```
### Configuring plugins

Fractal plugins can optionally expose their own set of configuration items. These are all access under the paths prefixed by `plugins.pluginName.` - for example, to set the `theme` configuration option for the [web preview plugin](https://github.com/frctl/web-plugin) you would use:

```js
fractal.set('plugins.web.theme', 'my-custom-theme');
```

Configuration options for plugins that are not bundled with the default install of Fractal should be detailed in that plugin's documentation.

### Configuring individual components and pages

The `fractal.js` file is where you will set all your **global** configuration options. Individual components and pages can also have their own local configuration files - details of these are covered in their respective docs.

## General configuration options

##### Project title

Plugins such as the [web preview plugin](https://github.com/frctl/web-plugin) will use this in their UI if set.

```js
fractal.set('project.title', 'My Amazing Component Library');
```

## Components configuration

#### Directory path

The path to the directory where your components live.

```js
fractal.set('components.path', 'src/components');
```

#### Template engine

Which template engine to use for your component views. See the [template engines documentation](/docs/engines/overview.md) for more options and details on how to implement a custom engine if your desired template language is not supported out of the box.

```js
fractal.set('components.engine', 'handlebars');
```
* **Choices:** `handlebars | nunjucks | mustache`
* **Default:** `handlebars`

#### File extension

The file extension for your component views that Fractal will look for when parsing the components directory.

```js
fractal.set('components.ext', '.hbs');
```

#### Default status

The default status to use for a component. Statuses are fully configurable - see the [components documentation](/docs/components/overview.md) for details.

```js
fractal.set('components.status.default', 'wip');
```
* **Choices:** `prototype | wip | ready`
* **Default:** `ready`

## Docs configuration

#### Directory path

The path to the directory where your documentation pages live.

```js
fractal.set('docs.path', 'src/docs');
```
#### Template engine

Which template engine to use to render your documentation pages. See the [template engines documentation](/docs/engines/overview.md) for more options and details on how to implement a custom engine if your desired template language is not supported out of the box.

```js
fractal.set('docs.engine', 'handlebars');
```
* **Choices:** `handlebars | nunjucks | mustache`
* **Default:** `handlebars`

#### File extension

The file extension for your documentation pages.

```js
fractal.set('docs.ext', '.md');
```
