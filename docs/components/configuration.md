# Component Configuration Reference

Each component can have it's own (optional) configuration file associated with it, allowing you to pass preview data to your components, customise their titles, change the status of components, configure variants and much more.

If you haven't already, you should read the [configuration file documentation](/docs/configuration-files.md) to learn more about how configuration files need to be named and formatted.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Component properties](#component-properties)
  - [name](#name)
  - [label](#label)
  - [title](#title)
  - [status](#status)
  - [context](#context)
  - [notes](#notes)
  - [display](#display)
  - [tags](#tags)
  - [isHidden](#ishidden)
  - [order](#order)
  - [view](#view)
  - [variants](#variants)
- [Variant properties](#variant-properties)
  - [name](#name-1)
  - [status](#status-1)
  - [view](#view-1)
  - [notes](#notes-1)
  - [display](#display-1)
  - [context](#context-1)
- [Example configuration file](#example-configuration-file)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Component properties

### name

Overrides the component name, which is otherwise extracted from the component view filename. Name values must be all lowercase, and contain only alphanumeric characters with hyphens or underscores for word seperators.

Setting this will also have the affect of changing the [component's **handle**](/docs/components/overview.md#referencing-components---@handle-syntax).

```yaml
name: 'mega-buttons'
```

### label

The label is typically displayed in any UI navigation items that refer to the component. Defaults to a title-cased version of the component name if not specified.

```yaml
label: 'Mega Buttons'
```

### title

The title of a component is typically what is displayed at the top of any pages related to the component. Defaults to the same as the `label` if not specified.

```yaml
title: 'Amazing Mega Buttons'
```
### status

The status of a component. See the [statuses documentation](/docs/statuses.md) for information on using and customising component statuses.

`status` is an **inheritable property**. If not set directly on the component it will inherit any status set further up in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
status: 'wip'
```
* **Choices:** `prototype | wip | ready`

####preview

### context

### notes

### display

### tags

### isHidden

### order

### view

### variants

## Variant properties

### name

### status

### view

### notes

### display

### context

### preview

<!--The following primitive properties are inherited from upstream sources if not specified directly:

* `status` (default: `'ready'`)
* `preview` (default: `null`)
* `isHidden` (default: `false`)
* `prefix` (default: `null`)-->

## Example configuration file

A fairly full-featured, JS-formatted example component config file may look something like this:

```js
module.exports = {
	title: "Amazing Mega Buttons",
	status: "prototype",
	tags: ['sprint-1', 'author:mark'],
	preview: '@preview-layout',
	context: {
		"button-text": "Click me!",
		"is-sparkly": true
	},
	variants: [{
		name: 'large',
		context: {
			modifier: 'is-large'
		}
	},{
		name: 'warning',
		status: 'wip',
		context: {
			modifier: 'is-warning',
			button-text: 'Do not click'
		}
	}]
};
```