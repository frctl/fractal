## Project settings

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Configuring plugins](#configuring-plugins)
  - [Configuring individual components and pages](#configuring-individual-components-and-pages)
- [General project settings](#general-project-settings)
    - [Project title](#project-title)
- [Components settings](#components-settings)
  - [Directory path](#directory-path)
  - [Template engine](#template-engine)
  - [File extension](#file-extension)
  - [Preview layout](#preview-layout)
  - [Default status](#default-status)
  - [Title](#title)
- [Documentation settings](#documentation-settings)
  - [Directory path](#directory-path-1)
  - [Template engine](#template-engine-1)
  - [File extension](#file-extension-1)
  - [Parse as markdown](#parse-as-markdown)
  - [Index label](#index-label)
  - [Title](#title-1)
- [Web UI settings](#web-ui-settings)
  - [Static assets path](#static-assets-path)
  - [Theme](#theme)
  - [Static build directory](#static-build-directory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Every Fractal project needs a file called `fractal.js` located in it's root directory. This file is used to import the Fractal module and then to set application-level configuration options as required.

Config values can be set using `fractal.set(key, value)`. The `key` argument can be a dot notation path in order to set nested values. For example:

```js
var fractal = require('@frctl/fractal');

fractal.set('components.path', 'path/to/components');
fractal.set('project.title', 'My Project Name');
fractal.set('components.default.status', 'wip');
```
### Configuring plugins

Fractal plugins can optionally expose their own set of configuration items. These are all access under the paths prefixed by `plugins.pluginName.` - for example, to set the `theme` configuration option for the [web preview plugin](https://github.com/frctl/web-plugin) you would use:

```js
fractal.set('plugins.web.theme', 'my-custom-theme');
```

Configuration options for plugins that are not bundled with the default install of Fractal should be detailed in that plugin's documentation.

### Configuring individual components and pages

The `fractal.js` file is where you will set all your **global** configuration options. Individual components and pages can also have their own local configuration files - details of these are covered in their respective docs.

## General project settings

#### Project title

Plugins such as the [web preview plugin](https://github.com/frctl/web-plugin) will use this in their UI if set.

```js
fractal.set('project.title', 'My Amazing Component Library');
```

## Components settings

### Directory path

The path to the directory where your components live.

```js
fractal.set('components.path', 'src/components');
```

### Template engine

Which template engine to use for your component views. Fractal uses [Handlebars](http://handlebarsjs.com) by default, but you can use many others by installing the appropriate adapter. See the [template engines documentation](/docs/engines/overview.md) for more information.

```js
fractal.set('components.engine', 'handlebars');
```

### File extension

The file extension for your component views that Fractal will look for when parsing the components directory.

```js
fractal.set('components.ext', '.hbs');
```

### Preview layout

The default [preview layout](/docs/components/layouts.md) to use. Defaults to `null` if unspecified.

```js
fractal.set('components.default.preview', '@my-preview');
```

### Default status

The default status to use for a component. Statuses are fully configurable - see the [components documentation](/docs/components/statuses.md) for details.

To disable the setting of a default status, you can set the value to `null`.

```js
fractal.set('components.default.status', 'wip');
```
* **Choices:** `prototype | wip | ready`
* **Default:** `ready`

### Title

The title to give the components section in any UIs that use it.

```js
fractal.set('components.title', 'Patterns');
```

## Documentation settings

### Directory path

The path to the directory where your documentation pages live.

```js
fractal.set('docs.path', 'src/docs');
```
### Template engine

Which template engine to use to render your documentation pages. Fractal uses [Handlebars](http://handlebarsjs.com) by default, but you can use many others by installing the appropriate adapter. See the [template engines documentation](/docs/engines/overview.md) for more information.

```js
fractal.set('docs.engine', 'handlebars');
```

### File extension

The file extension for your documentation pages.

```js
fractal.set('docs.ext', '.md');
```

### Parse as markdown

Whether or not to parse the body of documentation pages as markdown.

```js
fractal.set('docs.markdown', true);
```
* **Default:** `true`

### Index label

The default label to use for index pages. Can be overridden on a page-by-page basis.

```js
fractal.set('docs.indexLabel', 'Overview');
```

### Title

The title to give the documentation section in any UIs that use it.

```js
fractal.set('docs.title', 'Styleguide');
```

## Web UI settings

See the [web UI documentation](/docs/web/overview.md) for full details on configuration and usage.

### Static assets path

The path to the directory where your static assets live. Any assets within this directory will be made available to your components and preview layouts at a URL path relative to this directory.

```js
fractal.set('plugins.web.static.path', 'public');
```
### Theme

The theme you'd like to use for the web preview UI. Note that you must install the theme as a NPM dependency as well as specifying it's name here. See the [web UI themes documentation](/docs/web/themes.md) for more information.

```js
fractal.set('plugins.web.theme', 'my-custom-theme');
```

### Static build directory

The directory within which any static builds of the web UI should be generated.

```js
fractal.set('plugins.web.build.path', 'build');
```
