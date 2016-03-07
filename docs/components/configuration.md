# Component Configuration Reference

Components and component [collections](/docs/collections.md) can have their own (optional) configuration files associated with them. [Component variants](/docs/components/variants.md) are configured within their parent component's configuration file.

If you haven't already, you should read the [configuration file documentation](/docs/configuration-files.md) to learn more about how configuration files need to be named and formatted.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Component properties](#component-properties)
  - [collated](#collated)
  - [context](#context)
  - [display](#display)
  - [hidden](#hidden)
  - [label](#label)
  - [name](#name)
  - [notes](#notes)
  - [order](#order)
  - [preview](#preview)
  - [status](#status)
  - [title](#title)
  - [tags](#tags)
  - [variants](#variants)
- [Variant properties](#variant-properties)
  - [context](#context-1)
  - [display](#display-1)
  - [name](#name-1)
  - [notes](#notes-1)
  - [preview](#preview-1)
  - [status](#status-1)
  - [view](#view)
- [Collection properties](#collection-properties)
  - [collated](#collated-1)
  - [context](#context-2)
  - [display](#display-2)
  - [preview](#preview-2)
  - [prefix](#prefix)
  - [status](#status-2)
  - [tags](#tags-1)
- [Example component configuration file](#example-component-configuration-file)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Component properties

### collated

If set to true, individual variants of this component will not be visible in the web UI - instead the preview of this component will concatenate all variants together into a single preview.

```yaml
collated: false
```
### context

The [context data](/docs/components/context.md) to pass to the template when rendering previews. 

`context` is an **inheritable property**. Any context data set on the component will be *merged* with context data set upstream in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
context: 
  buttonText: 'Click here!'
  listItems: ['foo','bar','baz']
```

### display

CSS property key/value pairs that preview UIs *may* choose to use to apply to the preview rendering area. Useful for doing things like setting max-widths for components that are designed to only be used in sidebars.

This *does not* leak into the styling of the component itself; it is just applied to the area (typically an iframe) that the component is previewed within in plugins such as the web preview UI.

```yaml
display:
  max-width: 400px
  min-width: 250px
``` 

### hidden

Specifies whether the component [is hidden](/docs/components/tips-and-tricks.md#hiding-components-from-listings) (i.e. does not show up in listings or navigation) or not. Overrides the inferred value from an underscore-prefixed file name if set.

```yaml
hidden: true
```

### label

The label is typically displayed in any UI navigation items that refer to the component. Defaults to a title-cased version of the component name if not specified.

```yaml
label: 'Mega Buttons'
```

### name

Overrides the component name, which is otherwise extracted from the component view filename. Name values must be all lowercase, and contain only alphanumeric characters with hyphens or underscores for word seperators.

Setting this will also have the affect of changing the [component's **handle**](/docs/components/overview.md#referencing-components---@handle-syntax).

```yaml
name: 'mega-buttons'
```

### notes

Any notes about the component. Displayed in the web preview UI if present. Any notes set here override content taken from the component's README.md file, if there is one.  Accepts markdown.

```yaml
notes: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore 	magna aliqua.
```

### order

An integer order value, used when sorting components. Overrides any order value set as a property of the filename if set.

```yaml
order: 4
``` 

### preview

Which layout (specified by [handle](/docs/components/overview.md#referencing-components---@handle-syntax)) to use to when rendering previews of this layout. See the [preview layouts](/docs/components/layouts.md) documentation for more details

```yaml
preview: '@my-preview-layout'
```
### status

The status of a component. See the [statuses documentation](/docs/statuses.md) for information on using and customising component statuses.

`status` is an **inheritable property**. If not set directly on the component it will inherit any status set further up in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
status: 'wip'
```
* **Choices:** `prototype | wip | ready`

### title

The title of a component is typically what is displayed at the top of any pages related to the component. Defaults to the same as the `label` if not specified.

```yaml
title: 'Amazing Mega Buttons'
```

### tags

An array of tags to add to the component. Can be used by plugins and tasks to filter components.

`tags` is an **inheritable property**. Tags set on the component will be *merged* with tags set upstream in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
tags: ['sprint-1', 'foobar']
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

### context

The [context data](/docs/components/context.md) to pass to the variant view template when rendering previews. 

Any context set on a variant will be merged with it's parent component's (inherited and merged) context data.

```yaml
context: 
  buttonText: 'It's a unicorn button!'
```

### display

Set the component display property description for details. This is merged with any display properties assigned to the parent content.

```yaml
display:
  max-width: 300px
``` 

### name

The name of the variant. This is the only **mandatory property** for variant definitions.

A variant with a name of 'large' that belongs to the component named 'button' will have a [handle](/docs/components/overview.md#referencing-components---@handle-syntax) of **@button--large**.

```yaml
name: 'unicorn'
``` 

### notes

Any notes about the variant. Displayed in the web preview UI if present. Accepts markdown.

```yaml
notes: "Different from the default component because this one is *funky*."
```

### preview

Which layout (specified by it's [handle](/docs/components/overview.md#referencing-components---@handle-syntax)) to use to when rendering previews of this layout. See the [preview layouts](/docs/components/layouts.md) documentation for more details.

This overrides any the (inherited) `preview` value of the parent component.

```yaml
preview: '@my-special-layout'
```

### status

The status of the variant. Overrides the default status of it's parent component.

```yaml
status: 'wip'
```
* **Choices:** `prototype | wip | ready`

### view

The view file to use. If not specified and a view file matching the variant's handle is found (i.e. `component--variant.hbs` or similar) then that view will be used. If none is specified and no matching template is found, then the view file for the parent component will be used.

```yaml
view: 'component--funky.hbs'
```

## Collection properties

Collections can specify properties that should be applied to all child components of that collection via [configuration inheritance](/docs/configuration-files.md#configuration-inheritance). See the [documentation on collections](/docs/collections.md) for more details on how to work with collections.

### collated

Whether or not child components of this collection [should be collated](#collated) or not.

```yaml
collated: false
```

### context

[Context data](/docs/components/context.md) to be applied to children of the collection Any context set on a collection will be merged into any contexts set by it's children.

```yaml
context: 
  buttonText: 'It's a unicorn button!'
```

### display

Display property options for child components. This is merged with any display properties set on individual child components.

```yaml
display:
  max-width: 300px
``` 

### preview

The default preview layout (specified by it's [handle](/docs/components/overview.md#referencing-components---@handle-syntax)) that child components should when being rendered as a preview. See the [preview layouts](/docs/components/layouts.md) documentation for more details.

```yaml
preview: '@my-special-layout'
```

### prefix

A string to be prefixed on to the generated [handles](/docs/components/overview.md#referencing-components---@handle-syntax) of all components (and variants) in that collection.

```yaml
prefix: 'atoms'
```
Given the prefix above, a component with the name of `button` that lives within this collection will have the handle `@atoms-button`.

### status

The default status for all children of the collection.

```yaml
status: 'wip'
```
* **Choices:** `prototype | wip | ready`

### tags

An array of tags to add to all child components. Will be merged together with any tags specified on the components themselves.

```yaml
tags: ['sprint-1', 'foobar']
```

## Example component configuration file

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