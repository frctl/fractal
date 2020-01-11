# Twig Adapter

An adapter to let you use [Twig](https://github.com/twigjs/twig.js) templates with [Fractal](http://github.com/frctl/fractal).

Requires Fractal v1.1.0 or greater.

To install this adapter run this command:

`npm install @frctl/twig`

then open your fractal.js file and add following lines:

```js
/*
 * Require the Twig adapter
 */
const twigAdapter = require('@frctl/twig')();
fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');
```

## Using Twig for docs

To use Twig for docs, set the docs engine to `@frctl/twig`:
```js
fractal.docs.engine(twigAdapter);
```

However, due to the way this adapter currently extends Twig, it is necessary to *set the docs engine before setting the components engine*.

```js
/*
 * Require the Twig adapter
 */
const twigAdapter = require('@frctl/twig')();

// first set docs engine
fractal.docs.engine(twigAdapter);

// then set components engine
fractal.components.engine(twigAdapter);
```


## Extending with a custom config
```js
/*
 * Require the Twig adapter
 */
const twigAdapter = require('@frctl/twig')({
    // if pristine is set to true, bundled filters, functions, tests
    // and tags are not registered.
    // default is false
    pristine: false,

    // if importContext is set to true, all include calls are passed
    // the component's context
    // default is false
    importContext: false,

    // use custom handle prefix
    // this will change your includes to {% include '%button' %}
    // default is '@'
    handlePrefix: '%',

    // set a base path for twigjs
    // Setting base to '/' will make sure all resolved render paths
    // start at the defined components dir, instead of being relative.
    // default is null
    base: '/',

    // should missing variable/keys emit an error message
    // If false, they default to null.
    // default is false
    strict_variables: true,

    // define Twig namespaces, see https://github.com/twigjs/twig.js/wiki#namespaces
    // this may break some fractal functionality, like including components via their handles and the render tag
    namespaces: {
        'Components': './components'
    },

    // register custom filters
    filters: {
        // usage: {{ label|capitalize }}
        capitalize: function(str) {
            if (!str) return '';

            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    },

    // register custom functions
    functions: {
        // usage: {{ capitalize(label) }}
        capitalize: function(str) {
            if (!str) return '';

            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    },

    // register custom tests
    tests: {
        // usage: {% if label is equalToNull %}
        equalToNull: function(param) {
            return param === null;
        }
    },

    // register custom tags
    tags: {
        flag: function(Twig) {
            // usage: {% flag "ajax" %}
            // all credit to https://github.com/twigjs/twig.js/wiki/Extending-twig.js-With-Custom-Tags
            return {
                // unique name for tag type
                type: "flag",
                // regex match for tag (flag white-space anything)
                regex: /^flag\s+(.+)$/,
                // this is a standalone tag and doesn't require a following tag
                next: [ ],
                open: true,

                // runs on matched tokens when the template is loaded. (once per template)
                compile: function (token) {
                    var expression = token.match[1];

                    // Compile the expression. (turns the string into tokens)
                    token.stack = Twig.expression.compile.apply(this, [{
                        type:  Twig.expression.type.expression,
                        value: expression
                    }]).stack;

                    delete token.match;
                    return token;
                },

                // Runs when the template is rendered
                parse: function (token, context, chain) {
                    // parse the tokens into a value with the render context
                    var name = Twig.expression.parse.apply(this, [token.stack, context]),
                        output = '';

                    flags[name] = true;

                    return {
                        chain: false,
                        output: output
                    };
                }
            };
        }
    }
});

```


## Using external plugins

An example to use [twig-js-markdown](https://github.com/ianbytchek/twig-js-markdown):
```js
const twigMarkdown = require('twig-markdown');
const instance = fractal.components.engine(twigAdapter);

// instance.twig refers to the twig.js instance
instance.twig.extend(twigMarkdown);

```

## Included filters

### path
Takes a root-relative path and re-writes it if required to make it work in static HTML exports.

It is strongly recommended to use this filter whenever you need to link to any static assets from your templates.

The path argument should begin with a slash and be relative to the web root. During a static HTML export this path will then be re-written to be relative to the current page.

Usage:
```twig
{{ '/css/my-stylesheet.css'|path }}
```

## Included tags

### render
The render tag renders a component (referenced by its handle) using the context data provided to it. If no data is provided, it will use the context data defined within the component's configuration file, if it has one.

Usage:
```twig
{% render "@component" with {some: 'values'} %}
```
