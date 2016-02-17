# Component Configuration

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Configuration file formats](#configuration-file-formats)
  - [JavaScript module format](#javascript-module-format)
  - [JSON format](#json-format)
  - [YAML format](#yaml-format)
- [Available configuration options](#available-configuration-options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview 

Every component can have it's own (optional) configuration file associated with it, allowing you to pass preview data to your  components, customise their titles, change the status of components, configure variants and much more.

**A full list of all the available configuration options is available in the  [component configuration reference](/docs/components/configuration-reference.md)**.

In order to be recognised, component configuration files must:

* Reside in the same directory as the main component view file
* Have a file name in the format `component-name.config.{js|json|yml}` - for example `button.config.json` or `blockquote.config.yml`

## Configuration file formats

Configuration files can be formatted as [JSON](http://json.org/), [YAML](http://yaml.org/) or as a JavaScript file in the style of a CommonJS module that exports a configuration object.

The latter is recommended as it offers a lot more flexibility, but you may want to choose JSON or YAML if you have a particular need to keep things simple and declarative.

### JavaScript module format

Component config files authored in this format must have a filename that looks like `component-name.config.js`.

Using the JavaScript (CommonJS) module format for your configuration files is a little more involved than using JSON or YAML, but is a **lot more powerful** as it allows you to do things like dynamically generating [context data](/docs/components/context.md).

The file itself should be in the format of a Node CommonJS-style module that exports a configuration object. If you don't know what that is, don't worry! Just make sure it's contents looks like this:

```js
module.exports = {
	// config data here
};
```

For example:

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

Component config files authored using JSON must have a filename that looks like `component-name.config.json`.

A simple example of a JSON-formatted config file might look like:

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

Component config files authored using YAML must have a filename that looks like `component-name.config.yml`.

A simple example of a YAML-formatted config file might look like:

```yaml
title: "Sparkly Buttons"
status: "prototype"
context:
    button-text: "Click me!"
    is-sparkly: true
```

## Available configuration options

See the  [component configuration reference](/docs/components/configuration-reference.md) for all available configuration options.