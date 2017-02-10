# History

## 1.1.2

* [FIX] Fix issue with underscore-prefixed config files being ignored
* [FIX] Address issue with variants context bleeding into each other (#208)

## 1.1

* [NEW] Add support for 'short' non-component-name-prefixed config files for collections and compound components
* [NEW] Provide `meta` component/docs config namespace for arbitrary user-defined metadata (#89)
* [NEW] BrowserSync config option `watchOptions.ignored` can now be used to prevent ignored files from causing a UI reload (#134)
* [NEW] Web config option `builder.static.ignored` can now be used to prevent ignored files in the static directories from being copied when building. (#120)
* [NEW] Context data is now resolved when the data tree is rebuilt to allow synchronous retrieval via new `entity.getContext()` method.
* [FIX] Prevent arrays being merged during context data inheritance (#123)
* [FIX] Default variant view template issue (#67)
* [FIX] Patch issue with commands not exiting in latest version of Vorpal
* [OTHER] Refactor Builder class to better match Server class structure.

## 1.0.11

* [NEW] Add `.configData` property to components
* [FIX] Fix issue with urlencoding of files causing issues in build (#178)
* [FIX] Hidden properties now correctly cascade when set in config (#182)

## 1.0.9

 * [FIX] Address issue with using beta version globally to start earlier-versioned projects
 * [OTHER] Better BrowserSync support [@tlenex]

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
