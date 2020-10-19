# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/frctl/fractal/compare/@frctl/handlebars@1.2.1...@frctl/handlebars@1.2.2) (2020-10-19)

**Note:** Version bump only for package @frctl/handlebars





## [1.2.1](https://github.com/frctl/fractal/compare/@frctl/handlebars@1.2.0...@frctl/handlebars@1.2.1) (2020-10-15)


### Bug Fixes

* **handlebars:** fix handlebars render tag overwriting default context ([#648](https://github.com/frctl/fractal/issues/648)) ([035191c](https://github.com/frctl/fractal/commit/035191c7b2cd97d928143b312f428b75b1629ff6))





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
