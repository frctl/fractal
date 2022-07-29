fractal-fork version history
============================

unreleased
----------

* tbd


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
