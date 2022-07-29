fractal-fork version history
============================

unreleased
----------

* [patch] fixed url to `loader.svg` in CSS assets
* [patch] added example for `handlebars` adapter


0.0.3
-----

* [patch] upgraded following dependencies: `liftoff`, `globby`
* [patch] removed `istextorbinary` to check if a file is binary and always parse with `utf-8`
* [patch] removed `columnify` since `console.columns` method is never used


0.0.2
-----

* [patch] removed `dist` folder from repository so that it can be published


0.0.1
-----

* [major] restructured project from monorepository to single repository
  * Replace `require('@frctl/core')` with `require('fractal-fork').core`
  * Replace `require('@frctl/fractal')` with `require('fractal-fork').fractal`
  * Replace `require('@frctl/handlebars')` with `require('fractal-fork').handlebars`
  * Replace `require('@frctl/mandelbrot')` with `require('fractal-fork').mandelbrot`
  * Replace `require('@frctl/web')` with `require('fractal-fork').web`
* [major] removed `twig`, `nunjucks`, and `react` adapters
* [major] removed examples
* [major] removed `new` command from CLI
* [major] heavily refactored CLI to remove everything except `start` and `build` commands executed from the command line
