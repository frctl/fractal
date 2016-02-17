# Components

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [What defines a component?](#what-defines-a-component)
- [Component formats](#component-formats)
  - [Simple components](#simple-components)
  - [Compound components](#compound-components)
- [Referencing components - @handle syntax](#referencing-components---@handle-syntax)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

'Component' is a generic term used by Fractal to describe individual pieces of your website's UI.

**Fractal considers every piece of you markup to be a component**. A component could be a tiny chunk of HTML for a text input, it could be a whole page or it could be something in between.

Unlike some other systems, Fractal does not enforce any specific nomenclature or taxonomy on your components - you are free to organise and name them as you wish.

## What defines a component?

In order for Fractal to recognise your components, they must:

1. Live within the component directory that you specified in your [project settings file](/docs/project-settings.md).
2. Have a 'view' file, containing the markup required to render your component. This should have a file extension that matches the one specified in your [project settings file](/docs/project-settings.md) (or be `.hbs` by default).

Optionally, components can also:

* Have per-component configuration and preview data.
* Be organised into directories and sub-directories as required.
* Include as many related files (such as JavaScript, CSS, tests and READMEs) as you like.
* Have one or more *variants* - useful for when you have one 'parent' component with a number of very similar variations.

The markup for a component can either be written as 'vanilla' HTML or using a template language of your choosing. By default, Fractal expects that you are using [Handlebars](handlebarsjs.com) templates for your component view files, and that these files will have a `.hbs` file extension.

See the [template engine documentation](/docs/engines/overview.md) for more details on how to configure and use different template engines with Fractal.

## Component formats

Components can be created in two ways. The simplest format is just as a single file containing your markup, whilst more complex, 'compound' components can be created as a directory of associated files.

### Simple components

The simplest component consists of just a single view file. The name of the component will be taken to be the name of that file, minus the file extension.

So a `button.hbs` file in the components directory will be identified as a component with the name of 'button'.

```
├── components
│   └── button.hbs
```

Simple components can have [configuration files](/docs/configuration-files.md) associated with them. These must must reside in the same directory and have the same name as the component but have a `.config.{js|json|yml}` file extension. So a JSON configuration file for the button component would be called `button.config.json`.

```
├── components
│   ├── button.config.json
│   └── button.hbs
```

The one caveat regarding naming simple components is that they **must not have the same name as the parent folder** that contains them. This is to prevent them being identified as compound components.

### Compound components

Compound components allow you to group associated files (such as asset files, tests, READMEs etc) along with your primary component files.

The simplest compound component consists of a directory containing a single view file. The name of the view file **must** match the name of the directory. A 'block quote' component might therefore look like this:

```
├── components
│   └── blockquote
│   │   └── blockquote.hbs
```

Configuration files can of course be added, again following the same naming convention (`[component-name].config.{js|json|yml}`). Other files added to the directory will then be associated with the component. These files do not have to adhere to any particular naming convention. So a full example may look like:

```
├── components
│   └── blockquote
│   │   ├── blockquote.config.yml
│   │   ├── blockquote.hbs
│   │   ├── fancy-quote.js
│   │   ├── README.md
│   │   └── styles.css
```

## Referencing components - @handle syntax

When using Fractal, components (and their variants) are not referenced by their *path*, but instead by their **handle**. A handle is a bit like an ID, and using it instead of a file path means that you can move your components around without having to make updates to files that they are referenced in.

Handles take the form:

```js
@component-name // component
@component-name--variant-name // variant - note the double hyphen seperator.
```

And can be used in many places, such as when including another component via a partial. For instance, one component may include another component like this:

```handlebars
<div class="Parent-component">
    <p>Parent component</p>
    {{> @child-component}}
</div>
```

Other places that handles are used include when specifying a [preview layout](/docs/components/layouts.md) for a component or when referencing another components [context data](/docs/components/context.md).
