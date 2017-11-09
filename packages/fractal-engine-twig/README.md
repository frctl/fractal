# Twig engine

Twig template engine renderer for Fractal.

## Installation & usage

Install into your project via NPM:

```
npm i @frctl/fractal-engine-twig
```

Then add the engine to your project configuration file:

```js
// fractal.config.js
module.exports = {
  app: {
    //... other config
    engines: [
      '@frctl/fractal-engine-twig'
    ]
  }
}
```

You can then use `view.twig` templates in your components.

## Including templates from other components

You can include the templates of other components using the standard Twig `include` syntax with appropriate component `id` as the target:

```twig
{% include 'button' %}
```

If you wish to include a specific variant of that component, you can use the `componentId:variantId` reference syntax as follows:

```twig
{% include 'button:secondary' %}
```

And of course you can still pass data in using the usual Twig format:

```twig
{% include 'button:secondary' with {text: 'Click here'} %}
```
