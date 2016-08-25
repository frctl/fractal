# History

## 1.1

* [NEW] Add support for 'short' non-component-name-prefixed config files for collections and compound components
* [NEW] Provide `meta` component/docs config namespace for arbitrary user-defined metadata
* [FIX] Prevent arrays being merged during context data inheritance (#123)
* [FIX] Default variant view template issue (#67)
* [FIX] Patch issue with commands not exiting in latest version of Vorpal

## 1.0.7

* Fix missing FS module in component source

## 1.0.6

* Fix toc() method for docs
* Fix eslint peerDependencies issue

## 1.0.5

* Fix paths generated on Windows when running static builds
* Improve rendering of components with 'special' env variables
* Allow adapters to override the default reference parsing behaviour
* Bump Marked version to fix security warnings
* Switch to eslint, first pass at code cleanup

## 1.0.4

* Fix copyAssets error introduced in last release
* Prevent markdown code blocks without a lang attribute being escaped
* Bump Mandelbrot dependency version

## 1.0.3

* Windows path fixes [@webprofijt]
* Spelling corrections [@webprofijt]

## 1.0.2

* fullPath bug fix

## 1.0.1

* Fix issue with underscore prefixed component/docs root folders hiding all contents
* Add support for themes to map urls to static assets

## 1.0.0

Initial release.
