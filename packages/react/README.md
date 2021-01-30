# React template adapter for Fractal.

An adapter to let you use React templates with Fractal. Not supported for docs.

## Installation
```
npm install @frctl/react --save-dev
```

## Usage
Require the adapter in your Fractal configuration file:
```js
// Require the adapter factory:
const createReactAdapter = require('@frctl/react');
// Create the adapter instance:
const reactAdapter = createReactAdapter({/* options */});
// Register the adapter as engine:
fractal.components.engine(reactAdapter);
```

## Options

### renderMethod

Specify which method to use for rendering your components. Note that preview layouts are always rendered with `renderToStaticMarkup`.

```js
const reactAdapter = createReactAdapter({
  // default is 'renderToString'
  renderMethod: 'renderToStaticMarkup',
});
```

### ssr

Enable/disable server side rendering of components.

```js
const reactAdapter = createReactAdapter({
  // default is true
  ssr: false,
});
```

### wrapperElements

By default the render method renders only the component exported in the component template file.

Sometimes it is necessary to wrap the rendered component, for example with a React Context provider.

Note you need to do the same wrapping when hydrating the component client-side.

```js
const SomeComponent = require('some-react-component');
const reactAdapter = createReactAdapter({
  // default is []
  wrapperElements: [
    {
      component: SomeComponent,
      props: {
        some: 'prop',
        yin: 'yang,
      },
    },
    {
      component: '@fractal-component',
      props: {
        some: 'prop',
        yin: 'yang,
      },
    },
  ],
});
```

### babelOptions

Override babel configuration. Babel is used for parsing component templates.
```js
const SomeComponent = require('some-react-component');
const reactAdapter = createReactAdapter({
  // default is { presets: ['@babel/preset-react', '@babel/preset-env'] }
  babelOptions: {
    presets: ['@babel/preset-react', '@babel/preset-env'],
    plugins: [/* add additional plugins */],
  },
});
```
