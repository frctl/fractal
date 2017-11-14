# Fractal Nunjucks engine

Nunjucks template engine renderer for Fractal.

## Installation & usage

Install into your project via NPM:

```
npm i @frctl/fractal-engine-nunjucks
```

Then add the engine to your project configuration file:

```js
// fractal.config.js
module.exports = {
  app: {
    //... other config
    engines: [
      '@frctl/fractal-engine-nunjucks'
    ]
  }
}
```

You can then use `view.njk` templates in your components.

### Customising the Nunjucks instance

You can pass custom Nunjucks filters, globals and extensions via the engine options:

```js
// fractal.config.js
const MyCustomExtension = require('./my-custom-extension');

module.exports = {
  app: {
    engines: [
      ['@frctl/fractal-engine-nunjucks', {
        filters: {
          doThis: function(){
            return 'done!';
          }
        },
        globals: {
          someGlobalProp: 'foobar'
        },
        extensions: {
          fooExtension: new MyCustomExtension()
        }
      }]
    ]
  }
}
```

## Requirements

Requires Node >= v7.6
