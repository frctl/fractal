# Providing Context Data to Components

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Overview](#overview)
  - [Context and template partials](#context-and-template-partials)
    - [Passing context data from parent to child templates](#passing-context-data-from-parent-to-child-templates)
  - [Referencing context from other components](#referencing-context-from-other-components)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Each component or variant can have some **context data** associated with it. Context data is the **data that is used when rendering previews** of the component or variant.

As a very simple example, we could have a `simple-text` component with the following view template:

```handlebars
<!-- simple-text.hbs -->
<p>{{ text }}</p>
```

...and a configuration file that looks like this:

```yaml
# simple-text.config.yml
context:
  text: "This is some paragraph text"
```
...will look like this when rendered as a preview:

```html
<p>This is some paragraph text</p>
```

## Context and template partials

When including a components as a partial in another component, it's important to understand that **only the markup, not the context data** is included.

For example, a template that includes the above `simple-text` component as a partial may look like this:

```handlebars
<!-- parent.hbs -->
<div class="parent">
    <h1>{{ title }}</h1>
    {{> @simple-text }}
</div>
```
If the parent component has a configuration file that looks like this:

```yaml
# parent.config.yml
context:
  title: "A title for the component"
```
Then the output will not have any value for the `{{ text }}` placeholder in the child template:

```html
<div class="parent">
    <h1>A title for the component</h1>
    <p></p> <!-- no value! -->
</div>
```
That is because only the markup from the child template has been included, not any context data. This can be addressed (in most template engines - see the next section for details) by making sure to add a `text` value to the parent' component's context:

```yaml
# parent.config.yml
context:
  title: "A title for the component"
  text: 'Some text set by the parent component'
```

Often this is behaviour is beneficial - it means your 'parent' components are completely in control of configuring their 'child' components. However in some cases it can lead to repetition of context data in config files. In this case, you can use a special syntax to import context from one component into another - see below for details.

### Passing context data from parent to child templates

As mentioned above, most (but certainly not all!) template engines will pass through context data from the parent template to any included 'partial' child templates. An example of this was where the value of the `text` property was passed through to the `simple-text` partial even thought it was set in the parent components context data.

However it is worth noting that this behaviour is completely dependent on the [rendering engine](/docs/engines/overview.md) that you choose to use for your components, so check out the documentation for your chosen template engine for details!

## Referencing context from other components

It is possible to access context data from other components when rendering your templates. This is often useful when you want to use a component as an include/partial, but don't want to have to recreate the child component's context data in the parent's configuration file.

It also means you can create some [dynamically generated context](/docs/guides/dynamic-context.md) for use in one component, and then access that context in another component to prevent repetition of effort, and to keep the two in sync.

This is possible by using the `@handle` component reference syntax in your context data definitions. For example, if we create a configuration file for a component called `list-items` that looks like this:

```yaml
context:
  title: My favourite list items
  items:
    - one
    - two
    - three
    - four
```
It is then possible to access the `list-items` component's context data in another component as follows:

```yaml
context:
  list: '@list-items'

# When resolved, the above context data (which will get passed to the template when rendered) will look as follows:

context:
  list:
    title: My favourite list items
    items:
      - one
      - two
      - three
      - four
```
You can also choose to access only part of another component's context data by using a dot-notation string after the main identifier handle:

```yaml
context:
  list: '@list-items.items'

# resolves to:

context:
  list:
    - one
    - two
    - three
    - four
``
