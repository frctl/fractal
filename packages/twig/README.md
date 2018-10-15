# Twig Adapter

[WIP] An adapter to let you use [Twig](https://github.com/twigjs/twig.js) templates with [Fractal](http://github.com/frctl/fractal).

Currently requires the (unreleased) Fractal v1.1.0-alpha.2 or greater - you can install it in your project using `npm i @frctl/fractal@next --save`.

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
