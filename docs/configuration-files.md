# Configuration Files

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Available configuration options](#available-configuration-options)
- [Configuration file formats](#configuration-file-formats)
  - [JavaScript module format](#javascript-module-format)
  - [JSON format](#json-format)
  - [YAML format](#yaml-format)
- [Configuration inheritance](#configuration-inheritance)
  - [Properties with primitive values](#properties-with-primitive-values)
  - [Properties with object and array values](#properties-with-object-and-array-values)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Components, documentation pages and collections can all have their own (optional) configuration files associated with them.

In order to be recognised, configuration files must:

* Reside in the same directory as the item that they are configuring
* Have a file name in the format `item-name.config.{js|json|yml}` - for example `button.config.json`, `patterns.config.js` or `changelog.config.yml`

### Available configuration options

Available configuration options depend on the type of the item being configured. See the relevant configuration reference for details:

* [Components](/docs/components/configuration.md)
* [Pages](/docs/documentation/configuration.md)
* [Collections](/docs/collections.md)

## Configuration file formats

Configuration files can be formatted as [JSON](http://json.org/), [YAML](http://yaml.org/) or as a JavaScript file in the style of a CommonJS module that exports a configuration object.

The latter is recommended as it offers a lot more flexibility, but you may want to choose JSON or YAML if you have a particular need to keep things simple and declarative.

### JavaScript module format

Configuration files authored in this format must have a filename that looks like `item-name.config.js`.

Using the JavaScript (CommonJS) module format for your configuration files is a little more involved than using JSON or YAML, but is a **lot more powerful** as it allows you to do things like dynamically generating component [context data](/docs/components/context.md).

The file itself should be in the format of a Node CommonJS-style module that exports a configuration object. If you don't know what that is, don't worry! Just make sure it's contents looks like this:

```js
module.exports = {
	// config data here
};
```

For example, a component configuration file in this format might look like this:

```js
module.exports = {
	title: "Sparkly Buttons",
	status: "prototype",
	context: {
		"button-text": "Click me!",
		"is-sparkly": true
	}
};
```

> As this is JavaScript and not JSON, the exported object doesn't need to conform to the JSON specification's strict syntax rules to do for things like double quoting keys and so on.

Because it is just a JavaScript file, you can do things like use JavaScript to generate your context data for you, should you need to. Additionally, because it is imported as a NodeJS module, you can also `require` any third party NPM modules (or even your own module files) to help with any data-generation - including doing things like fetching data form external APIs.

See the guide on [Dynamic Context Generation](/docs/guides/dynamic-context.md) for more details on ways to make use of this powerful feature.

### JSON format

Configuration files authored using JSON must have a filename that looks like `item-name.config.json`.

A simple example of a JSON-formatted config file for a component might look like:

```json
{
	"title": "Sparkly Buttons",
	"status": "prototype",
	"context": {
		"button-text": "Click me!",
		"is-sparkly": true
	}
}
```

> Note that the file must be valid JSON, with double quoted property names and string values, and without any trailing commas, or it will throw an error when it is parsed.

### YAML format

Configuration files authored using YAML must have a filename that looks like `item-name.config.yml`.

A simple example of a YAML-formatted config file for a component might look like:

```yaml
title: "Sparkly Buttons"
status: "prototype"
context:
    button-text: "Click me!"
    is-sparkly: true
```

## Configuration inheritance

Some configuration items will have their values *inherited* from upstream collections or [project settings](/docs/project-settings.md) if the values are not set in the item's configuration file directly. This can also be thought of a *cascade* of configuration values from any [global settings](/docs/project-settings.md) (in your fractal.js file) down through any nested collection configurations and into the item itself.

Whilst this is a somewhat advanced concept, it can often be very useful to save having to set the same configuration values on multiple items. For example, if all components in a collection need to have their status set to `wip` then rather than having to set it on each individual component you can just set it in the collection's configuration file and it will cascade down to the components. You can then override it on selected components if necessary.

Pages and components each have different properties that can be inherited - see their respective configuration docs for details.

### Properties with primitive values

Properties with primitive (i.e. non-object) values, if specified on a downstream entity, will **override** upstream values. For instance, to figure out the value of the `status` property for a component, Fractal will do the following:

1. Check if it is set directly in the component's configuration file. If so, use that.
2. Otherwise, recursively work upwards to check any parent collections to see if any of them have a status set in it's configuration. If one is found to have a `status` specified, stop and use that.
3. If no value for the `status` is found, use the default value (which may or may not have been overridden in the global `fractal.js` settings file).

### Properties with object and array values

Properties with object or array values are treated slightly differently. Instead of overriding upstream values, they are **merged with them**.

For example, if a collection has been assigned the tags `['sprint-1', 'dashboard']` and one of it's child components has the tags `['dashboard', 'needs-review']` specified in it's component configuration, then the resolved, **aggregate** tag list for the component will be `['dashboard', 'needs-review', sprint-1']`.

Similarly, context data is inherited and merged from upstream sources. For example, the following example set of configuration data:

```js
// in the fractal.js configuration file

fractal.set('components.default.context', {
	'background': 'sparkly'
});

// in an upstream collection config file, e.g. patterns.config.json

{
	"context": {
		"special-sauce": true,
		"background": "stars"
	}
}

// in the component configuration file, e.g. button.config.json

{
	"context": {
		"text": "Click here!"
	}
}
```
Would result in the resolved, aggregate context of the component looking like:

```js
{
	"background": "stars",
	"special-sauce": true,
	"text": "Click here!"
}
```
