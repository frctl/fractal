# Configuration

## Overview

Every Fractal project needs a file called `fractal.js` located in it's root directory. This file is used to import the Fractal module and then set any configuration options as required.

> If you don't already have a `fractal.js` file for your project, you can generate one by running `fractal init` in your project folder.

A very simple `fractal.js` example might look like this:

```js
var app = require('@frctl/fractal');

app.set('project.title', 'My Amazing Component Library');

```

Generally, the `fractal.js` file is where you will set global configuration options. Components and pages can also have their own local configuration files, the details of which are covered in their respective documentation.
