fractal-fork version history
============================

unreleased
----------

* tbd


0.0.6
-----

* [patch] fix: sync for docs [frctl#1181](https://github.com/frctl/fractal/pull/1181)
* [patch] removed `bluebird` where possible [frctl#c58cd9c](https://github.com/frctl/fractal/pull/1206/commits/c58cd9ce63d662d14fc10bd347f5343096efc89c)


0.0.5
-----

* [patch] removed `chalk` dependency - CLI is no longer colored
* [patch] removed `log-update` dependency - CLI no longer updated in place
* [patch] removed `get-ports` dependency -- automatic port discovery is no longer supported
* [patch] removed `cli/notifier` since it is no longer used in the CLI
* [patch] upgraded various dependencies


0.0.4
-----

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
