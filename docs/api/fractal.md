# API - Fractal

When you `require` the Fractal module, you are returned a singleton `fractal` object instance.

```
const fractal = require('@frctl/fractal'); //--> fractal instance
```

This fractal instance is your starting point for accessing the core Fractal API. The methods and properties documented below are available on any fractal object instance. For example:

```js
'use strict'
const fractal = require('@frctl/fractal');

fractal.set('components.path', 'src/components');

fractal.load().then(function(){
    const buttonStatus = fractal.components.find('@button').status.label; // get the status of the component with the handle '@button'
    console.log(buttonStatus);
});
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
    - [.set(path, value)](#setpath-value)
    - [.get(path)](#getpath)
    - [.exec(command, [stdoutCallback])](#execcommand-stdoutcallback)
    - [.load()](#load)
    - [.watch()](#watch)
    - [.unwatch()](#unwatch)
    - [.on(event, callback)](#onevent-callback)
    - [.engine(name, moduleName, [config])](#enginename-modulename-config)
    - [.plugin(moduleName, [config])](#pluginmodulename-config)
    - [.command(name, [options], action)](#commandname-options-action)
    - [.components](#components)
    - [.docs](#docs)
    - [.version](#version)
- [events](#events)
    - [source:loaded](#sourceloaded)
    - [source:changed](#sourcechanged)
    - [source:updated](#sourceupdated)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API

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
fractal.on('source:changed', function(sourceType, source, data){
	console.log(`Change in ${sourceType} directory`);
});
```

#### .engine(name, moduleName, [config])

* `name` - *String*
* `moduleName` - *String*
* `config` - *Object* [optional]

Register a custom template adapter to use for rendering components and/or documentation pages. The `name` value is a reference that can then be used to reference the configured adapter.

```js
fractal.engine('nunjucks-with-helpers', '@frctl/nunjucks-adapter', {
    loadHelpers: true
});

fractal.set('components.engine', 'nunjucks-with-helpers'); // use it to render components
```

#### .plugin(moduleName, [config])

* `moduleName` - *String*
* `config` - *Object* [optional]

Register a plugin (optionally with initial configuration data). The `moduleName` should be a string that is resolvable via NodeJS's `require` method.

```js
fractal.plugin('../plugins/my-custom-plugin');

fractal.plugin('@frctl/api-plugin');
```

#### .command(name, [options], action)

* `name` - *String*
* `options` - *String | Object* [optional]
* `action` - *Function*

Register a [custom command](/docs/commands/custom.md).

#### .components

A [Source object](/docs/api/source.md) describing the components in the project.

#### .docs

A [Source object](/docs/api/source.md) describing the documentation pages in the project.

#### .version

The version of the local Fractal install.

## events

The main Fractal instance emits events that can be listened to via using the .on() method documented above.

Available events to listen for are described below:

#### source:loaded

Emitted when Fractal has finished the initial parse of the source directory.

```js
fractal.on('source:loaded', function(source){
	console.log(`${source.name} has been loaded`);
});
```

* `source` - the [Source](/docs/api/source.md) object that has finished loading

#### source:changed

Emitted when one or more files in a component or documentation source are added, removed or edited, but _before_ Fractal has re-parsed the contents of the source directory.

```js
fractal.on('source:changed', function(source, eventData){
	console.log(`Change in ${source.name} directory`);
});
```

* `source` - the [Source](/docs/api/source.md) object for the source that has had a change to one of it's files
* `eventData` - an event data object, e.g. `{ event: 'change', path: 'path/to/file.scss', type: 'asset' }`

#### source:updated

Emitted when Fractal has finished re-parsing the source directory after a change.

```js
fractal.on('source:updated', function(source, eventData){
	console.log(`${source.name} has been updated`);
});
```

* `source` - the [Source](/docs/api/source.md) object that has been updated
* `eventData` - an event data object, e.g. `{ event: 'change', path: 'path/to/file.scss', type: 'asset' }`
