# Nunjucks Adapter

An adapter to let you use [Nunjucks](http://mozilla.github.io/nunjucks/) templates with [Fractal](http://github.com/frctl/fractal).

## Installation

```shell
npm i @frctl/nunjucks-adapter --save
```

## Usage

To use the Nunjucks adapter, you now need to add a bit of configuration to your `fractal.js` setup file:

```javascript
// fractal.js
var fractal = require('@frctl/fractal');

fractal.engine('nunjucks', '@frctl/nunjucks-adapter'); // register the Nunjucks adapter

fractal.set('components.engine', 'consolidate'); // use Nunjucks for component views
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
