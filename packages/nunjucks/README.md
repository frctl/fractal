# Nunjucks Adapter

An adapter to let you use [Nunjucks](http://mozilla.github.io/nunjucks/) templates with [Fractal](http://github.com/frctl/fractal).

## Installation

```shell
npm i @frctl/nunjucks --save
```

## Usage

```javascript
fractal.engine('@frctl/nunjucks'); // register the Nunjucks adapter
fractal.set('components.ext', '.nunj'); // look for files with a .nunj file extension
```

## Customisation

If you want to register custom [filters](https://mozilla.github.io/nunjucks/api.html#custom-filters), global variables or [extensions](https://mozilla.github.io/nunjucks/api.html#custom-tags) to the underlying Nunjucks engine then you can configure an instance as follows:

```javascript

const nunj = require('@frctl/nunjucks')({
    filters: {
        // filter-name: function filterFunc(){}
    },
    globals: {
        // global-name: global-val
    },
    extensions: {
        // extension-name: function extensionFunc(){}
    }
});

fractal.engine(nunj); /* set as the default template engine */
```

For example, to register the 'shorten' filter example from the [Nujucks docs](https://mozilla.github.io/nunjucks/api.html#custom-filters):

```javascript
const nunj = require('@frctl/nunjucks')({
    filters: {
        shorten: function(str, count) {
            return str.slice(0, count || 5);
        }
    }
});
```

Which you could then use in your component or documentation views as follows:

```nunjucks
{# Show the first 5 characters #}
A message for you: {{ message|shorten }}

{# Show the first 20 characters #}
A message for you: {{ message|shorten(20) }}
```

## Including and extending non-component view templates

By default, the Nunjucks adapter expects you to use the Fractal component `@handle` syntax to refer to components to include or extend in your templates.

However, if you wish to include (or extend) non-component templates, you can also specify a path (or an array of paths) of directories for Nunjucks to search in for non-component templates when configuring your Nunjucks instance. For example:

```javascript
const nunj = require('@frctl/nunjucks')({
    paths: ['path/to/files']
});
```

```html
{% include 'foo.html' %}
```

In this example the file `foo.html` would be searched for in the `path/to/files` directory and included if found.

> Using additional search paths in this manner **does not** prevent standard `@handle` syntax includes working as well.


## Extensions

The following Nunjucks extensions come **automatically pre-installed**. These are often useful when building or documenting Fractal-based component libraries.

If you **do not wish** to include these extensions, set `pristine: true` when configuring your Nunjucks adapter instance.

### render

The `render` extension renders a component (referenced by it's handle) using the context data provided to it in the template. If no data is provided, it will use the context data defined within it's configuration file, if present.

**This can be very useful as an alternative to using an `include` to import sub-components.** `Include`'d components do not pull in their own context so using `render` instead can help prevent repetition of context data in the configuration files of components that include sub-components.

```html
<!-- pass in data for rendering -->
{% render '@example', {title: 'An Example'} %}
{% render '@example', someData %}

<!-- use the config file data for rendering -->
{% render '@example' %}
```

You can also pass in a *partial* data object (i.e. containing only some of the properties the component expects) and then pass a third argument of `true` to the tag to populate the missing items from the default context data. This allows you to override only the items you need to for this instance of the rendered component.

```html
<!-- will get any missing properties from the component context data -->
{% render '@another-example', {title: 'Another Example'}, true %}
```

### context

Outputs the resolved context data for a component.

```html
{% context '@example' %}

<!-- Outputs:
{
    "foo": "bar",
    "baz": "bar"
}
-->
```

### view

Outputs the raw view template contents for the specified component.

```html
{% view '@example' %}

<!-- Outputs:
<p>{{ text }}</p>
-->
```
