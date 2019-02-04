# Twig Adapter

An adapter to let you use [Twig](https://github.com/twigjs/twig.js) templates with [Fractal](http://github.com/frctl/fractal).

Requires Fractal v1.1.0 or greater.

To install this adapter run this command:

`npm install @frctl/twig`

then open your fractal.js file and add following lines:

```
/*
 * Require the Twig adapter
 */
const twigAdapter = require('@frctl/twig')();
fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');
```

## Extending with a custom config
```
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
```
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
```
{{ '/css/my-stylesheet.css'|path }}
```

## Included tags

### render
The render tag renders a component (referenced by its handle) using the context data provided to it. If no data is provided, it will use the context data defined within the component's configuration file, if it has one.

Usage:
```
{% render "@component" with {some: 'values'} %}
```
