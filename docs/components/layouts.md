# Preview Layouts

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Creating a preview layout](#creating-a-preview-layout)
- [Specifying a preview layout for a component](#specifying-a-preview-layout-for-a-component)
  - [Global (default) preview layout](#global-default-preview-layout)
  - [In a parent collection's configuration file](#in-a-parent-collections-configuration-file)
  - [In a component's configuration file](#in-a-components-configuration-file)
- [Context in preview layouts](#context-in-preview-layouts)
  - [The _target property](#the-_target-property)
- [Preview rendering details](#preview-rendering-details)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

By default, when Fractal renders a component, it does so without wrapping it in any 'page' structure markup. That means that it is effectively an HTML *fragment*, as opposed to an HTML *page*. As a result, your components will appear unstyled; Fractal **does not** automatically insert any styles or behaviour into the rendered markup.

In order to faithfully render a component in the same way as it will look in your live site, Fractal supports the use of **preview layouts**. These are used when rendering component previews, and allow you to 'wrap' your component in some page markup so you can link to your stylesheets, javascript and so on, just as you would in your site proper.

## Creating a preview layout

Preview layouts are just another component, and so must reside in your component directory. Like any other components, preview layouts can be [hidden](/docs/components/tips-and-tricks.md) by prefixing their name with an underscore if you don't want them to show up in listings or navigation.

For example, we could create a preview layout called `_preview.hbs` in the root our components directory:

```
├── components
│   └── _preview.hbs
```

The contents of that file might look something like this:

```handlebars
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link media="all" rel="stylesheet" href="/example.css">
    <title>Preview Layout</title>
</head>
<body>

{{{ yield }}}

</body>
</html>
```

Note the `{{{ yield }}}` placeholder. That is where the rendered component will be included into the final generated markup.

> The triple `{{{` mustache tags around the `yield` placeholder are required so that handlebars does not automatically escape the rendered HTML of the component - if you are using a different templating language then you may need a different syntax to escape the output.

We can also see that the layout is including a stylesheet using the path `/example.css`. This is a file that lives within our [static assets directory](/docs/project-settings.md#static-assets-path) and is served up by the web preview server.

You can put as much or as little as you want into your preview layouts, but it's recommended that they match up as much as possible to the 'real' template that your components will be rendered in when used in your site.

## Specifying a preview layout for a component

You can specify the which preview layout to use on a global basis (in your `fractal.js` [project settings](/docs/project-settings.md) file) or on a [component-by-component basis](/docs/components/configuration.md#preview) (allowing different layouts for different use-cases).

You can also take advantage of the [configuration cascade](/docs/configuration-files.md#configuration-inheritance) and specify preview layouts on a per-collection basis as the default for all components in that collection.

In all cases, the preview layout must be referenced by the **handle** of the layout component.

### Global (default) preview layout

In your `fractal.js` project settings file:

```js
fractal.set('components.preview.layout', '@preview');
```

### In a parent collection's configuration file

All components within this collection will have this set as their default preview layout unless the specifically override it.

```json
// patterns.config.json
{
	"preview": "@preview"
}
```
### In a component's configuration file 

Setting it directly in a component's config file will override any defaults set further upstream.

```json
// component.config.json
{
	"preview": "@preview"
}
```

## Context in preview layouts

Preview layouts are just components and can have their own configuration files associated with them, just like any other components. That means you can specify context data for the layout in the configuration file, and you will be able to access it from within the layout.

You **will not** be able to access the layout's context data from within the component that is being rendered. The component is not *included* as a partial in the layout, but rather rendered first and then passed in as a property on the layout's context data.

### The _target property

The preview layout, when rendered as a layout and not as a component on it's own, will have access to a special context property called `_target`. This is a JSON representation of whichever component or variant is being rendered within the layout.

Having access to this means that you can do things like dynamically set the page title of your layout based on the component being rendered. For instance, in your layout template you could do:

```handlebars
<head>
<title>{{ _target.label }} | My Component Library</title>
</head>
```
Your page title would then match the component being rendered.

## Preview rendering details

It may be useful to understand the exact rendering order when a preview layout is used. The rendering works as follows:

1. The component view is rendered, using it's own set of context data.
2. The rendered output is assigned to a special property, `yield`, which is attached to the preview layout's context data.
3. A JSON representation of the component being rendered is assigned to the `_target` property of the layout's context data.
4. The layout view file is rendered using it's own preview context data, complete with the additional `yield` and `_target` properties.

