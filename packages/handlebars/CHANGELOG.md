# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.2.1-wombatpatch.0 (2020-10-08)


### Bug Fixes

* **engine:** remove stray console.log call ([ec18d75](https://github.com/frctl/fractal/commit/ec18d7581e9c18581738ca13642262a132ffa526))
* **engine:** update to remove deprecated flatten behaviour ([aa937d4](https://github.com/frctl/fractal/commit/aa937d4f9d74c3120feefc31140d69459d2d46f0))
* **handlebars:** fix handlebars render tag overwriting default context ([#648](https://github.com/frctl/fractal/issues/648)) ([035191c](https://github.com/frctl/fractal/commit/035191c7b2cd97d928143b312f428b75b1629ff6))


### Features

* allow passing in of a custom handlebars instance ([d4dbd0e](https://github.com/frctl/fractal/commit/d4dbd0e7a14145b5e303665d46837f11e6715702))
* **partials:** support new handle-based import syntax ([7e0e015](https://github.com/frctl/fractal/commit/7e0e015ceb8c80ca9bc5cde530a14599f5af40f1))





## 1.2.0

### Features

-   switch to use new synchronous context methods
-   catch errors from render helper

### Bug Fixes

-   skip arrays while merging context (#2)

### Chores

-   bump lodash from 4.17.4 to 4.17.13 (#3)
-   replace yarn lockfile with package-lock.json

## 1.1.5

-   Convert fractal to peerDependency

## 1.1.4

-   [NEW] Add support for referencing partials by path in addition to `@handle`

## 1.1.2

-   [FIX] Fix issue with incorrect paths being generated using the `path` helper when used within a component rendered using the `render` helper.

## 1.0.1

-   Fix `_self` variable in included templates
-   Allow path helper strings to include handlebars variables
-   Provide support for future changes to `_` ('special') variables setting

## 1.0.0

Initial release.
