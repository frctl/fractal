# Component Configuration

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Configuration file formats](#configuration-file-formats)
  - [JSON format](#json-format)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview 

Every component can have it's own (optional) configuration file associated with it, allowing you to pass preview data to your  components, customise their titles, change the status of components, configure variants and much more.

**A full list of all the available configuration options is available in the  [component configuration reference](/docs/components/configuration-reference.md)**.

In order to be recognised, component configuration files must:

* Reside in the same directory as the main component view file
* Have a file name in the format `component-name.config.{js|json|yml}` - for example `button.config.json` or `blockquote.config.yml`

## Configuration file formats

Configuration files can be formatted as [JSON](http://json.org/), [YAML](http://yaml.org/) or as a JavaScript file in the style of a CommonJS module that exports a configuration object.

### JSON format

Component config files authored using JSON will have a filename that looks like `component-name.config.json`. A simple example of the contents of this file may look like:

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
