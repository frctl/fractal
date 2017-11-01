# Fractal Handlebars engine

Handlebars template engine renderer for Fractal.

## Installation & usage

Install into your project via NPM:

```
npm i @frctl/fractal-engine-handlebars
```

Then add the engine to your project configuration file:

```js
// fractal.config.js
module.exports = {
  app: {
    //... other config
    engines: [
      '@frctl/fractal-engine-handlebars'
    ]
  }
}
```

You can then use `view.hbs` templates in your components.

### Customising the Handlebars instance

If you wish to customise the Handlebars instance with helpers, decorators or similar, you can pass a custom Handlebars instance via the engine options.

```js
// fractal.config.js
const hbs = require('handlebars').create();

hbs.registerHelper('myHelper', function(){
  // do something here...
});

module.exports = {
  app: {
    engines: [
      ['@frctl/fractal-engine-handlebars', {
        handlebars: hbs // pass in the custom handlebars instance
      }]
    ]
  }
}
```

> **Note:** In order to create a custom instance in this way you will need to first install Handlebars via NPM directly into your project: `npm i handlebars`

## Requirements

Requires Node >= v7.6 and Fractal >= v2.0.0-beta.1
