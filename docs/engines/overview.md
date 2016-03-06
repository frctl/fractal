# Template engines

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Customising Handlebars](#customising-handlebars)
  - [Adding to the default Handlebars instance](#adding-to-the-default-handlebars-instance)
  - [Using a custom Handlebars instance](#using-a-custom-handlebars-instance)
- [Using an alternative template engine](#using-an-alternative-template-engine)
- [Using different template engines for components and docs](#using-different-template-engines-for-components-and-docs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

By default, Fractal uses a vanilla install of [Handlebars](http://handlebars.js) as a template language for both components and documentation pages. However, it's straightforward to either customise the Handlebars instance (i.e. by adding helpers etc) or to install and use a completely different template engine.

> It's worth noting that the capabilities of your components is mostly determined by your choice of templating language, rather than by Fractal itself. If you choose a language that has no support for including partials, for instance, Fractal will not 'add' that capability in.

You can also use one template engine for your components, and another different engine for your documentation pages, should you so wish.

## Customising Handlebars

If you wish to add custom helpers to the Handlebar's instance, there are a few ways that you can do it.

### Adding to the default Handlebars instance

To specify a additional helpers on the default Handlebars instance, you can add the following to your `fractal.js` file:

```javascript
fractal.engine('handlebars', '@frctl/handlebars-adapter', {
    helpers: {
        // helpers go here
    }
});
```

Helpers are specified in an object where the `key` is the name that you will reference them by in your templates, and the `value` should be a Handlebars [helper function](http://handlebarsjs.com/#helpers). For example, to register custom `uppercase` and `lowercase` helpers, you could use the following:

```javascript
// fractal.js
var fractal = require('@frctl/fractal');

fractal.engine('handlebars', '@frctl/handlebars-adapter', {
    helpers: {
        uppercase: function(str) {
            return new Handlebars.SafeString(str.toUpperCase());
        },
        lowercase: function(str) {
            return new Handlebars.SafeString(str.toLowerCase());
        }
    }
});
```

Which can then be used in your components or documentation pages as follows:

```handlebars
<!-- my-component.hbs -->
<p>This is upper-cased: {{uppercase 'foo'}}</p> <!-- Outputs: This is upper-cased: FOO -->
<p>This is lower-cased: {{lowercase 'BAR'}}</p> <!-- Outputs: This is lower-cased: bar -->
```
### Using a custom Handlebars instance

Alternatively, you can pass the Handlebars template engine adapter a pre-configured instance of Handlebars. The previous example could be re-written like this:

```js
// fractal.js
var fractal = require('@frctl/fractal');
var Handlebars = require('handlebars');

Handlebars.registerHelper('uppercase', function(str) {
    return new Handlebars.SafeString(str.toUpperCase());
});
Handlebars.registerHelper('lowercase', function(str) {
    return new Handlebars.SafeString(str.toLowerCase());
});

fractal.engine('handlebars', '@frctl/handlebars-adapter', {
    instance: Handlebars
});
```

This is really useful for when you want to use helper libraries such as [Swag](https://github.com/elving/swag), which requires access to the underlying Handlebars instance to register it's helpers on. You could add Swag into your project as follows:

```js
// fractal.js
var fractal = require('@frctl/fractal');
var Handlebars = require('handlebars');
var Swag = require('swag');

Swag.registerHelpers(Handlebars);

fractal.engine('handlebars', '@frctl/handlebars-adapter', {
    instance: Handlebars
});
```
You would then have access to all of Swag's helpers in your component and page templates.

## Using an alternative template engine

If you don't wish to use Handlebars, you can use pretty much any other JavaScript-based template engine you like.

Fractal uses *adapters* to handle different template engines. Currently there are specific adapters implemented for [Handlebars](https://github.com/frctl/handlebars-adapter), [Mustache](https://github.com/frctl/mustache-adapter) and [Nunjucks](https://github.com/frctl/nunjucks-adapter). However, if you want to use something else, there is also a [generic adapter]() that uses the Consolidate.js library to provide compatibility with 30+ other template engines.

If that *still* doesn't have you covered, (or if the behaviour of any of these adapters is not to your liking) it is also straightforward to write your own [template engine adapter](/docs/engines/custom-adapters.md) to give you what you need.

Before you can use an alternative adapter, you will need to `npm install` it, and then register it with Fractal in your `fractal.js` setup file:

```javascript
// fractal.js
fractal.engine('name', '@frctl/my-adapter');
```

For full information on installing, using and customising individual template engine adapters, see the appropriate READMEs:

* Handlebars adapter - see above!
* [Mustache adapter](https://github.com/frctl/mustache-adapter)
* [Nunjucks adapter](https://github.com/frctl/nunjucks-adapter)
* [Generic/consolidate adapter](https://github.com/frctl/consolidate-adapter)

## Using different template engines for components and docs

If you want to use one templating language for your components and a different one (or a different instance of one) for your documentation, that is no problem. You can simply register two different adapters and then tell Fractal which one to use for which.

For example, to use Nujucks for components, and Mustache for docs, you can do the following in your `fractal.js` setup file (note you will need to `npm install` the adapters first):

```javascript
// fractal.js
var fractal = require('@frctl/fractal');

fractal.engine('nunjucks', '@frctl/nunjucks-adapter');
fractal.set('components.engine', 'nunjucks');
fractal.set('components.ext', '.nunj');

fractal.engine('mustache', '@frctl/mustache-adapter');
fractal.set('docs.engine', 'mustache');
fractal.set('docs.ext', '.mustache'); // or just leave as the default .md, it's up to you!
```

You can also use a **different instance** of the **same adapter** for your components to the one you use for your docs. This can be useful when you want to add in different sets of helpers for each use case.

To do this, just give each one a unique name when registering. That name can then be used to specify the engine for your docs and components. For example:

```javascript
// fractal.js
var fractal = require('@frctl/fractal');

// set up and register a customised handlebars instance for the components
fractal.engine('handlebars-components', '@frctl/handlebars-adapter', {
    helpers: {
        formatDate: function(){ /*....*/ }
    }
});
fractal.set('components.engine', 'handlebars-components');

// set up and register a customised handlebars instance for the docs
fractal.engine('handlebars-docs', '@frctl/handlebars-adapter', {
    helpers: {
        truncateText: function(){ /*....*/ }
    }
});
fractal.set('docs.engine', 'handlebars-docs');
```
