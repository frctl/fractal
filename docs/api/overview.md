<!-- DOCTOC SKIP -->

# Fractal API

## Overview

If you are using Node for your site, app or build tools then you can use Fractal as a dependency to give you programmatic access to your component library. There are a number of ways to do this; the most common two are described below.

### Either: require Fractal directly

The easiest way is to  `require` the `@frctl/fractal` package as a dependency in your app:

```js
// somefile.js
'use strict';

const fractal = require('@frctl/fractal');

//...  do stuff here!

```

You can then configure your Fractal instance just as you would [in your fractal.js file](/docs/project-settings.md).

### Or: Import a pre-configured Fractal instance

If you've already configured your Fractal install in the `fractal.js` file, then you should instead import the configured Fractal instance from that to avoid having to duplicate configuration information. This involves two steps:

#### 1. Export the configured Fractal instance

At the end of your fractal.js file, export the configured fractal instance as follows:

```js
// fractal.js
'use strict';

const fractal = require('@frctl/fractal');

fractal.set('project.title', 'Some Project Title');

//... other configuration setting here

module.exports = fractal; // <-- Export the configured Fractal instance

```

#### 2. Import it into your application

In whichever file you want to use Fractal in you can now `require` your `fractal.js` file:

```js
// somefile.js
'use strict';

const fractal = require('./fractal.js'); // <-- Import the fractal.js module instead of requiring the @frctl/fractal package directly

//... do stuff here!

```

<!--  For more information on how to best integrate your component library with your production application, see the [integration guide](/docs/guides/integration.md). -->

## Methods

#### .set(settingPath, settingValue)

#### .get(settingPath)

#### .exec(command, [stdoutCallback])

#### .watch()

#### .unwatch()

#### .load()

#### .plugin(moduleName, [config])

#### .command(name, [options], action)

#### .engine(name, moduleName, [config])

#### .on(event, callback)

## Properties

#### .components

#### .docs

#### .version