# Components

'Component' is a generic term used by Fractal to describe pieces of your website's UI.

**In Fractal everything is a considered a component**. A component could be a tiny chunk of HTML for a text input, it could be a whole page or it could be something in between.

Unlike some other systems, Fractal does not enforce any specific nomenclature or taxonomy on your components - you are free to organise and name them as you wish.

## What makes a component?

In order for Fractal to recognise your components, they must:

1. Live within the component directory that you specified in your [fractal.js configuration file](/docs/configuration.md#components-directory-path).
2. Have a 'view' file, containing the markup required to rendering your component. **By default, the name of this view file will be the 'handle' (name) of your component.**

Optionally, components can also:

* Be organised into directories and sub-directories as required.
* Include as many related files (such as JavaScript, CSS, tests and READMEs) as you like.
* Have one or more 'variants', useful for when you have one 'parent' component with a number of very similar variations.
* Have per-component configuration and preview data.

## Component views

The markup for a component can either be written as 'vanilla' HTML or using a template language of your choosing.

By default, Fractal expects that you are using [Handlebars](handlebarsjs.com) templates for your component view files, and that these files will have a `.hbs` file extension.

To change the template engine, set the value of the `components.view.engine` config setting in your fractal.js file to the template engine of your choosing:

```js
app.set('components.view.engine', 'handlebars'); // handlebars | nunjucks | mustache | (more coming soon!)
```

Fractal currently supports [Handlebars](handlebarsjs.com), [Nunjucks](https://mozilla.github.io/nunjucks/) and [Mustache](https://github.com/janl/mustache.js) out of the box, although it is straightforward to create a handler for your favourite template language if required.

See the [template engine documenation](#) for more details on how to configure and use different template engines with Fractal.

## Creating components

All components must to reside within your components directory. The location of this directory can be set in your fractal.js file as follows:

```js
app.set('components.path', 'src/components');
```

> **NOTE:** All examples in this documentation will assume that you are using `src/components` as your component directory and  Handlebars as your template engine.

### A simple component example

The most basic component just consists of a single markup (view) file with the appropriate file extension (i.e. `.hbs`) for the template engine you are using.

As an example, let's create a simple blockquote component. To do this, we'll create a file called `blockquote.hbs` at the top level of our components directory. So our file tree may look something like this:

```
| - src/
| --- components/
| ----- blockquote.hbs
| - fractal.js
| - package.json
```

For now, let's just use plain HTML for the contents of `blockquote.hbs`. We'll add some template tags later:

```html
<blockquote>
    <p>This is a quote! Something witty should probably go here.</p>
    <cite>Mr. A. Nonymous</cite>
</blockquote>
```
Now start the fractal UI server (if it's not already running) using the `fractal start` command in your terminal and point your browser to [http://localhost:3000/components](http://localhost:3000/components/detail/blockquote). You should see a rendered preview of your component followed by the HTML source code.

**Congratulations!** You've just created your first component.

