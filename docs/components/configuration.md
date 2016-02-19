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
  - [preview](#preview)
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

### preview

Which layout (specified by [handle](/docs/components/overview.md#referencing-components---@handle-syntax)) to use to when rendering previews of this layout. See the [preview layouts](/docs/components/layouts.md) documentation for more details

```yaml
preview: '@my-preview-layout'
```

### context

The [context data](/docs/components/context.md) to pass to the template when rendering previews. 

`context` is an **inheritable property**. Any context data set on the component will be *merged* with context data set upstream in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
context: 
  buttonText: 'Click here!'
  listItems: ['foo','bar','baz']
```

### notes

Any notes about the component. Displayed in the web preview UI if present. Any notes set here override content taken from the component's README.md file, if there is one.  Accepts markdown.

```yaml
notes: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore 	magna aliqua.
```

### tags

An array of tags to add to the component. Can be used by plugins and tasks to filter components.

`tags` is an **inheritable property**. Tags set on the component will be *merged* with tags set upstream in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
tags: ['sprint-1', 'foobar']
```

### isHidden

Specifies whether the component [is hidden](/docs/components/tips-and-tricks.md#hiding-components-from-listings) (i.e. does not show up in listings or navigation) or not. Overrides the inferred value from an underscore-prefixed file name if set.

```yaml
isHidden: true
```
### order

An integer order value, used when sorting components. Overrides any order value set as a property of the filename if set.

```yaml
order: 4
``` 

### display

CSS property key/value pairs that preview UIs *may* choose to use to apply to the preview rendering area. Useful for doing things like setting max-widths for components that are designed to only be used in sidebars.

This *does not* leak into the styling of the component itself; it is just applied to the area (typically an iframe) that the component is previewed within in plugins such as the web preview UI.

```yaml
display:
  max-width: 400px
  min-width: 250px
``` 

### variants

An array of variant configuration objects. See the variant properties options (below) and the [variants documentation](/docs/components/variants.md) for more information on working with variants.

Many variant properties are **inherited from the parent component**, and all apart from the `name` value are optional.

```yaml
variants:
  - name: 'large'
    status: 'ready'
    context:
      buttonText: "I'm a large button!"
  - name: 'small'
    context:
      isSmall: true
``` 
## Variant properties

Variants can be defined in the parent components configuration file. See the [variants documentation](/docs/components/variants.md) for full details on creating and configuring variants.

### name

The name of the variant. This is the only **mandatory property** for variant definitions.

A variant with a name of 'large' that belongs to the component named 'button' will have a [handle](/docs/components/overview.md#referencing-components---@handle-syntax) of **@button--large**.

```yaml
name: 'unicorn'
``` 
### status

The status of the variant. Overrides the default status of it's parent component.

```yaml
status: 'wip'
```
* **Choices:** `prototype | wip | ready`

### context

The [context data](/docs/components/context.md) to pass to the variant view template when rendering previews. 

Any context set on a variant will be merged with it's parent component's (inherited and merged) context data.

```yaml
context: 
  buttonText: 'It's a unicorn button!'
```

### view

The view file to use. If not specified and a view file matching the variant's handle is found (i.e. `component--variant.hbs` or similar) then that view will be used. If none is specified and no matching template is found, then the view file for the parent component will be used.

```yaml
view: 'component--funky.hbs'
```
### notes

Any notes about the variant. Displayed in the web preview UI if present. Accepts markdown.

```yaml
notes: "Different from the default component because this one is *funky*."
```
### display

See the component display property description for details. This is merged with any display properties assigned to the parent content.

```yaml
display:
  max-width: 90000px
``` 

### preview

Which layout (specified by [handle](/docs/components/overview.md#referencing-components---@handle-syntax)) to use to when rendering previews of this layout. See the [preview layouts](/docs/components/layouts.md) documentation for more details.

This overrides any the (inherited) `preview` value of the parent component.

```yaml
preview: '@my-special-layout'
```

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
		notes: 'Only use this when you need a really big button!',
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