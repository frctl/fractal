# Nunjucks Adapter

An adapter to let you use [Nunjucks](http://mozilla.github.io/nunjucks/) templates with [Fractal](http://github.com/frctl/fractal).

## Installation

```shell
npm i @frctl/nunjucks-adapter --save
```

## Usage

In your `fractal.js` setup file:

```javascript
// fractal.js
var fractal = require('@frctl/fractal');

fractal.engine('nunjucks', '@frctl/nunjucks-adapter'); // register the Nunjucks adapter

fractal.set('components.engine', 'nunjucks'); // use Nunjucks for component views
fractal.set('components.ext', '.nunj'); // look for files with a .nunj file extension
```

## Customisation

You can pass custom [filters](https://mozilla.github.io/nunjucks/api.html#custom-filters), global variables and [extensions](https://mozilla.github.io/nunjucks/api.html#custom-tags) to the underlying Nunjucks instance as follows:

```javascript
// fractal.js
fractal.engine('nunjucks', '@frctl/nunjucks-adapter', {
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
```

For example, to register the 'shorten' filter example from the [Nujucks docs](https://mozilla.github.io/nunjucks/api.html#custom-filters):

```javascript
// fractal.js
fractal.engine('nunjucks', '@frctl/nunjucks-adapter', {
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

By default, the nunjucks adapter expects you to use the Fractal component `@handle` syntax to refer to components to include or extend in your templates.

However, if you wish to include (or extend) non-component templates, you can also pass a path (or an array of paths) of directories for Nunjucks to search in for non-component templates. For example:

```javascript
// fractal.js
fractal.engine('nunjucks', '@frctl/nunjucks-adapter', {
    paths: ['path/to/files']
});
```

```html
{% include 'foo.html' %}
```

In this example the file `foo.html` would be searched for in the `path/to/files` directory and included if found.

> Using additional search paths in this manner **does not** prevent standard `@handle` syntax includes working as well.

## Helpers

The [Nunjucks helpers](https://github.com/frctl/nunjucks-helpers) library provides a set of useful extensions and filters for your Fractal projects.

You can make *all* helpers available to your project by setting the `loadHelpers` config property to `true` when registering the Nunjucks adapter:

```javascript
// fractal.js
fractal.engine('nunjucks', '@frctl/nunjucks-adapter', {
    loadHelpers: true
});
```

See the [Nunjucks helpers README](https://github.com/frctl/nunjucks-helpers) for details on selectively loading helpers if you do not wish to autoload them in this fashion.
