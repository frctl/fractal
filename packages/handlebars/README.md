# Handlebars Adapter

Use Handlebars templates with Fractal.

## Installation and Usage

This is the default template engine adapter for Fractal and does not need to be installed separately **unless** you wish to add your own helpers or partials etc. In that case you will need to install it in your project:

```shell
npm i @frctl/handlebars --save
```

And then `require` and configure it as follows:

```js
const config = {
    /* configuration properties here */
};
const hbs = require('@frctl/handlebars')(config);

fractal.components.engine(hbs); /* set as the default template engine for components */

```

### Configuration

#### helpers

A set of [Handlebars helpers](http://handlebarsjs.com/#helpers) to make available to your templates.

```js
const config = {
    helpers: {
        uppercase: function(str) {
            return str.toUpperCase();
        },
        lowercase: function(str) {
            return str.toLowerCase();
        }
    }
};
```

#### partials

A set of [Handlebars partials](http://handlebarsjs.com/#partials) to make available to your templates. The contents of these can then be included using the standard Handlebars `{{> myPartialName }}` syntax.

```js
const config = {
    partials: {
        foobar: 'This is a partial!',
    }
};
```

#### pristine

Defaults to `false`. Set to `true` if you **do not wish** to automatically load any of the bundled helpers ([as documented below](#helpers)) into your Handlebars instance.

```js
const config = {
    pristine: true
};
```

### Accessing the underlying Handlebars instance

If you need to access the underlying Handlebars instance to customise it further, you can do so by using the `engine` property of a configured adapter instance:

```js
const hbs = require('@frctl/handlebars')({
    /* config */
});

const engine = hbs.engine; /* The Handlebars instance */

engine.registerHelper('foo', function(str){
    /* handlebars helper code */
});

```

## Bundled Helpers

The following Handlebars helpers come automatically pre-installed into the handlebars instance. These are often useful when building or documenting Fractal-based component libraries.

### {{ render }}

The `render` helper renders a component (referenced by it's handle) using the context data provided to it. If no data is provided, it will use the context data defined within the component's configuration file, if it has one.

**This can be very useful as an alternative to using the regular partial `{{> @name }}` helper to import sub-components.** Partials do not pull in their own context so using the `render` helper instead can help prevent repetition of context data in the configuration files of components that include sub-components.

```handlebars
<!-- pass in data for rendering -->
{{render '@example' someData}}
{{render '@example--variant' otherData}}

<!-- use the config file data for rendering -->
{{render '@example'}}
{{render '@example--variant'}}
```

You can also pass in a *partial* data object (i.e. containing only some of the properties the component expects) and then set the `merge` property to true to populate the missing items from the default  context data. This allows you to override only the items you need to for this instance of the rendered component.

```handlebars
{{render '@example' partialData merge=true}}
```

### {{ context }}

Outputs the resolved context data for a component.

```handlebars
{{context '@example'}}

<!-- Outputs:
{
    "foo": "bar",
    "baz": "bar"
}
-->
```

### {{ view }}

Outputs the raw view template contents for the specified component.

```handlebars
{{view '@example'}}

<!-- Outputs:
<p>{{ text }}</p>
-->
```
