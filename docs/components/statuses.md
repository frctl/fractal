# Statuses

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Assigning Statuses](#assigning-statuses)
  - [Default status](#default-status)
  - [Item statuses](#item-statuses)
- [Custom statuses](#custom-statuses)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Each component and/or [variant](/docs/components/variants.md) can have a status associated with it. Each status has a colour and a label that plugins (like the [web interface plugin](/docs/web/overview.md)) can display to help people quickly understand the status of each component.

By default, Fractal defines three statuses, identified by the keys `ready`, `wip` and `prototype`, but you are free to define your own to suit the needs of your project, or customise the colours and labels associated with these statuses.

## Assigning Statuses

### Default status

You can assign a default status to all components in your `fractal.js` [project settings](/docs/project-settings.md) file as follows:

```js
fractal.set('components.default.status', 'wip');
``` 
By default the available options are `'ready'`, `'wip'` and `'prototype'`.

If you wish to **disable** the default status then you can set the value to `null`. Items will then not have a status unless specified in their configuration (or in a parent collection's configuration).

### Item statuses

You can specify a status for a component (and additionally for any of it's variants) in a [component configuration file](/docs/components/configuration.md). For example:

```yaml
# component.config.yml
status: wip
```

If specified in a component, all variants of that component will automatically be assigned the same status unless they specifically override it in their own configuration.

If a component [collection](/docs/collection.md) specifies a status in it's configuration, then that status will automatically be applied to all child components and variants within that collection, unless specifically overridden.

## Custom statuses

If you wish to define a custom set of statuses, you can do so in the `fractal.js` [project settings](/docs/project-settings.md) file:

```js
fractal.set('components.statuses', {
	/* status definitions here */
});
``` 

The default statuses are defined as follows:

```js
{
    prototype: {
        label: "Prototype",
        description: "Do not implement.",
        color: "#FF3333"
    },
    wip: {
        label: "WIP",
        description: "Work in progress. Implement with caution.",
        color: "#FF9233"
    },
    ready: {
        label: "Ready",
        description: "Ready to implement.",
        color: "#29CC29"
    }
}
```

So as an example, if you only wanted two statuses, `doing` and `done`, you use the following configuration:

```js
// fractal.js
fractal.set('components.statuses', {
    doing: {
        label: "Doing",
        description: "I'm doing it.",
        color: "red"
    },
    done: {
        label: "Done",
        description: "I'm done with this.",
        color: "green"
    },
});
``` 
You could then specify these new statuses in your components using the values `doing` and `done`.

Alternatively, if you just want to change the label or colour on one of the existing statuses, you can target it specifically by it's key:

```js
 fractal.set('components.statuses.prototype.color', 'pink');	
 fractal.set('components.statuses.ready.label', 'Good to go!');
```