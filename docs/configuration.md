# Configuration

* [Overview](#overview)
* [Common configuration settings](#common-configuration-settings)

## Overview

Every Fractal project needs a file called `fractal.js` located in it's root directory. This file is used to import the Fractal module and then set any configuration options as required.

> If you don't already have a `fractal.js` file for your project, you can generate one by running `fractal init` in your project folder.

A very simple `fractal.js` example might look like this:

```js
var app = require('@frctl/fractal');

app.set('project.title', 'My Amazing Component Library');
```

Generally, the `fractal.js` file is where you will set global configuration options. Components and pages can also have their own local configuration files, the details of which are covered in their respective docs.

## Common configuration settings

#### Project title

The title shown in the header of the UI.

```js
app.set('project.title', 'My Amazing Component Library');
```

#### Components directory path

The path to the directory where your components live.

```js
app.set('components.path', 'src/components');
```

#### Component template engine

Which template engine to use for your component views. See the [components documentation](/docs/components/overview.md) for more options and details on how to implement a plugin if your desired template language is not supported out of the box.

```js
app.set('components.view.engine', 'handlebars');
```
* **Choices:** `handlebars | nunjucks | mustache` (more coming soon!)
* **Default:** `handlebars`

#### Default component status

The default status to use for a component. Statuses are fully configurable - see the [components documentation](/docs/components/overview.md) for details.

```js
app.set('status.default', 'wip');
```
* **Choices:** `prototype | wip | ready`
* **Default:** `ready`

#### Pages directory path

The path to the directory where your pages live.

```js
app.set('pages.path', 'src/pages');
```

#### Static assets path

The path to a directory where any static assets (CSS, JS, images etc) can be found. Files within this directory will then be made accessible to your templates via the appropriate URL.

```js
app.set('static.path', 'public/assets');

// Now /public/assets/css/core.css -> http://localhost:3000/css/core.css
// In your component templates: <link rel="stylesheet" href="/css/core.css">
```

#### Build directory path

The path to the directory where the static site will be exported to when running `fractal build`.

```js
app.set('build.dest', 'build');
```

#### Server port

The port to use for the inbuilt development server when running `fractal start`

```js
app.set('server.port', 5555);
```

#### Logging level

What level of detail to display in the CLI.

```js
app.set('log.level', 'info');
```
* **Choices:** `error | warn | info | verbose | debug | silly`
* **Default:** `warn`
