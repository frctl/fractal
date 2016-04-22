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

If you've already configured your Fractal install for CLI use in a `fractal.js` file, then you should instead import the configured Fractal instance from there to avoid having to duplicate configuration information. This involves two steps:

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

const fractal = require('./fractal.js'); // <-- Import the fractal.js file instead of requiring the @frctl/fractal package directly

//... do stuff here!

```

<!--  For more information on how to best integrate your component library with your production application, see the [integration guide](/docs/guides/integration.md). -->

## Methods

#### .set(path, value)

* `path` - *String*
* `value` - *String | Object*

Set the value of a configuration setting, identified by it's `path`. For a complete list of configuration values see the [project settings](/docs/project-settings.md) documentation.

```js
fractal.set('components.statuses.prototype.color', 'pink');

fractal.set('components.default', {
	preview: '@preview',
	context: {
		foo: 'bar'
	}
});
```

#### .get(path)

* `path` - *String*

Get the value of a configuration setting, identified by it's `path`. For a complete list of configuration values see the [project settings](/docs/project-settings.md) documentation.

```js
console.log(fractal.get('components.statuses.prototype.color'));
// -> 'pink'
```

#### .exec(command, [stdoutCallback])

* `command` - *String*
* `stdoutCallback` - *Function* [optional]

Execute [a command](/docs/commands/overview.md), optionally providing a callback to handle the output.

```js
fractal.exec('build');

fractal.exec('start --watch', function(stdout){
	myApp.logger.log(stdout);
});
```

#### .load()

Perform an initial parse of the component and documentation directories. Returns a `Promise`.

```js
fractal.load().then(function(){
	console.log('Finished parsing components and documentation!');
});
```

#### .watch()

Start a watch task to monitor the project component and documentation directories for changes.

#### .unwatch()

Stop any currently running watch tasks.

#### .on(event, callback)

* `event` - *String*
* `callback` - *Function* 

Listen out and respond to lifecycle events.

```js
fractal.on('changed', function(type, source, data){
	console.log(`Change in ${type} directory`);
});
```

#### .plugin(moduleName, [config])

#### .command(name, [options], action)

#### .engine(name, moduleName, [config])



## Properties

#### .components

#### .docs

#### .version
