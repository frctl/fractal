# Creating Components - A Guide

The following section will walk you through the process of creating a simple static component, making it dynamic by passing data into the view file and then adding additional configuration data to customise the title and change the component status.

It's important to note that all components _must_ reside within your components directory for Fractal to find them. The location of this directory can be set in your fractal.js file as follows:

```js
app.set('components.path', 'src/components');
```

> **NOTE:** All examples in this documentation will assume that you are using `src/components` as your component directory and  Handlebars as your template engine.

## 1. Creating the view file

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

Component configuration files can be written as JSON, YAML or as a CommonJS JavaScript module that returns a JSON object. For this example we'll be using [YAML](http://www.yaml.org/) but check out the full component configuration docs for details on using other data formats. Configuration files must reside in the same directory as the component they are intended to configure, and for YAML files must have a filename that looks like `component-name.config.yml` (replacing `component-name` with the name of your component).

So let's create a config file, called `blockquote.config.yml` for our blockquote component. Our file tree now looks like:

```
| - src/
| --- components/
| ----- blockquote.config.yml
| ----- blockquote.hbs
| ...
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

There are **plenty more configuration options** for components - check out the component configuration reference docs for full details.
