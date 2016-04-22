# Guide: Creating Components

The following guide will walk you through the process of creating a simple static component, making it dynamic by passing data into the view file and then building it out into a more complete example of a component.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [1. Creating the view file](#1-creating-the-view-file)
- [2. Passing data to your view](#2-passing-data-to-your-view)
- [3. Providing additional configuration](#3-providing-additional-configuration)
- [4. Creating variants](#4-creating-variants)
- [5. Adding a preview layout](#5-adding-a-preview-layout)
- [6. Associating related files](#6-associating-related-files)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

It's important to note that all components _must_ reside within your components directory for Fractal to find them. The location of this directory can be set in your fractal.js file as follows:

```js
fractal.set('components.path', 'components');
```

> **NOTE:** All examples in this documentation will assume that you are using `components` as your component directory and Handlebars as your template engine.

## 1. Creating the view file

The most basic component just consists of a single markup (view) file with the appropriate file extension (i.e. `.hbs`) for the template engine you are using.

As an example, let's create a simple blockquote component. To do this, we'll create a file called `blockquote.hbs` at the top level of our components directory. So our component directory fike tree will look something like this:

```
├── components
│   └── blockquote.hbs
```

For now, let's just use plain HTML for the contents of `blockquote.hbs`. We'll add some template tags later:

```html
<blockquote>
    <p>This is a quote! Something witty should probably go here.</p>
    <cite>Mr. A. Nonymous</cite>
</blockquote>
```

Now start the fractal UI server (if it's not already running) using the `fractal start` command in your terminal and point your browser to [http://localhost:3000/components/detail/blockquote](http://localhost:3000/components/detail/blockquote). You should see a rendered preview of your component followed by the HTML source code.

**Congratulations!** You've just created your first component.

## 2. Passing data to your view

The above example works just fine but is probably not very useful. In reality, you may want to include that component in a number of places in your site, and you probably want the text content of the component to be different each time. So let's look at how we can achieve that.

First you will need to replace the text in your view file with variable placeholders. In Handlebars (and many other template languages), these placeholders look like `{{variableName}}`, so our `blockquote.hbs` file could be amended to look something like this:

```handlebars
<blockquote>
    <p>{{text}}</p>
    <cite>{{citation}}</cite>
</blockquote>
```

So now we just need a way to specify the data that should be passed to our view when rendering it as a preview. This is done by creating a **component configuration file**.

[Configuration files](/docs/configuration-files.md) can be written as JSON, YAML or as a CommonJS JavaScript module that returns a JSON object. For this example we'll be using [YAML](http://www.yaml.org/) but check out the full component configuration docs for details on using other data formats. Configuration files must reside in the same directory as the component they are intended to configure, and for YAML files must have a filename that looks like `component-name.config.yml` (replacing `component-name` with the name of your component).

So let's create a config file, called `blockquote.config.yml` for our blockquote component. Our file tree now looks like:

```
├── components
│   ├── blockquote.config.yml
│   └── blockquote.hbs
```

And the contents of our `blockquote.config.yml` file should look a little something like this:

```yaml
context:
  text: "Blockquotes are the best!"
  citation: "Fractal Docs"
```

All the data in the `context` object will be passed to your template view when rendering it as a preview in the Fractal UI. You can see that the keys (`text` and `citation`) match the variable placeholder names in our template. You can also include deeply nested objects here if needed and they will be accessible to the template via dot notation (or by however your chosen template language provides access to them, if not using Handlebars).

If you refresh your browser you should now see your component preview rendered with the data that you specified in the configuration file. You'll also notice that the code view browser below the preview now also shows the rendered HTML as prevously, but also now includes the template file contents and the context data (displayed as JSON).

## 3. Providing additional configuration

As well as being used to specify context data to pass to your component's view template, the config file can also be used to customise other features of your component or to specify things like implementation notes for displaying in the UI.

For example, if we want to customise the title (displayed at the top of the component page) or the status (more on statuses, including specifying your own, later!) of our blockquote component, we can update our config file as follows:

```yaml
title: "A simple blockquote component"
status: wip
context:
  text: "Blockquotes are the best!"
  citation: "Fractal Docs"
```

If you now refresh the page in your browser, you should see that the title and the status indicator for your blockquote component have now both changed.

> There are **plenty more configuration options** for components - check out the [component configuration](/docs/components/configuration.md) docs for full details.

## 4. Creating variants

Variants are useful for when you have a need for a slightly modified version of your component, but when the change is small enough that it doesn't really warrant creating a whole separate component.

> Variants can be thought of as roughly analogous to the concept of 'modifiers' in [BEM](http://getbem.com/). If you are would use a BEM modifier class to describe your (sub)component, it's probably a good fit to be a variant.

There are a number of ways to create variants, each with their own pros and cons, but probably the simplest way is to create a separate variant view file. (For full details on creating and using variants see the full [variants documentation](/docs/components/variants.md)).

To create a variant, add another file into your components directory, called `blockquote--fancy.hbs`. Note the `--` part of the file name - this identifies the file as a variant, and will be parsed as a variant with the name `fancy` that belongs to the `blockquote` component.

So our file tree now looks like this:

```
├── components
│   ├── blockquote.config.yml
│   ├── blockquote--fancy.hbs
│   └── blockquote.hbs
```

If you refresh the web preview UI in your browser again you should see that a variant has appeared on the blockquote component page.

## 5. Adding a preview layout

Preview layouts are templates that wrap your components to allow them to be rendered in the context of 'proper' HTML page. That means that you can include links to your CSS or JavaScript files just as you would in your site proper.

Preview layouts are themselves components. That means you can use your actual site 'skeleton' component (if you have one), or you can create a separate one just for the purpose of wrapping your component previews. In this example, we we are going to do the latter and create a component called _preview.hbs in the root of our component directory, like so:

```
├── components
│   ├── _preview.hbs
│   ├── blockquote.config.yml
│   ├── blockquote--fancy.hbs
│   └── blockquote.hbs
```

The `_` underscore prefixing the filename tells Fractal that this is a 'hidden' file, which means it will not show up in any component listings but can still be used as a preview layout (or included into other components). It's **not** manadatory that your preview layout components are hidden, but you may choose to do so if you like.

The preview layout itself may look something like this:

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/assets/main.css">
    <title>Preview</title>
</head>
<body>

{{{ yield }}}

<script src="/assets/main.js"></script>
</body>
</html>
```

Note the `{{{ yield }}}` placeholder - this is where the rendered content of your component will be inserted when generating the preview.

The last thing to do is to let Fractal know that this preview layout should be used as the default layout for our components. To do this we can set a [global project configuration option](/docs/project-settings.md) in our `fractal.js` file.

```js
fractal.set('components.default.preview', '@preview');
```

> Note the way that we reference the preview layout using the special identifier `@preview`. This is called the component's 'handle'. You can read more details on using component and variant handles on the [components overview](/docs/components/overview.md) page.

Now whenever your component is rendered as a preview (for example in the web UI) it will be wrapped in your preview layout.

## 6. Associating related files

In a real-life situation, components will often have more than just markup associated with them. They will likely have some styles, some JavaScript and other files like tests and so on.

In order to associate files with our blockquote component, we will need to turn it into a 'compound' component. A compound component is one that consists of a directory containing your view file, plus any related files. The directory name must be the same as the component view file name. So to turn our simple blockquote component into  a compound component, we will put it into a subdirectory called `blockquote` and add our related files. So, with the addition of a few extra files, our blockquote component might now look something like this:

```
├── components
│   ├── _preview.hbs
│   ├── blockquote
│   │   ├── blockquote.config.yml
│   │   ├── blockquote--fancy.hbs
│   │   ├── blockquote.hbs
│   │   ├── blockquote.scss
│   │   ├── modal-quote.js
│   │   ├── screenshot.png
│   │   └── README.md
```

`README.md` files, if present, will parsed and used by Fractal to generate notes about the component. Other files (which can be called anything you like) will be taken to be associated with this component. Plugin such as the web UI can then display these alongside the rendered views.
