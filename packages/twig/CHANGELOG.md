# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.2.1-wombatpatch.0 (2020-10-08)


### Bug Fixes

* allow handlePrefix option to be used with render tag ([#40](https://github.com/frctl/fractal/issues/40)) ([030e56f](https://github.com/frctl/fractal/commit/030e56fd1e92322f2311d970b8d261c3477c179d))
* component notes do not work when using twigAdapter as docs engine ([#46](https://github.com/frctl/fractal/issues/46)) ([f5a2925](https://github.com/frctl/fractal/commit/f5a292552a19d5ee41b6ce68a6f273fa87caa47f)), closes [/github.com/frctl/twig/pull/46#pullrequestreview-386707440](https://github.com//github.com/frctl/twig/pull/46/issues/pullrequestreview-386707440) [#45](https://github.com/frctl/fractal/issues/45)
* fix render tag overwriting component data in fractal core ([#44](https://github.com/frctl/fractal/issues/44)) ([bc154ca](https://github.com/frctl/fractal/commit/bc154ca5b91c69d1542ac4b91e080f10027e66ae))
* set source engine value ([#48](https://github.com/frctl/fractal/issues/48)) ([32c314f](https://github.com/frctl/fractal/commit/32c314f789c9868019e4ecdea6661d24117bf413))


### Features

* allow usage of default twig.js template resolver ([#43](https://github.com/frctl/fractal/issues/43)) ([a625499](https://github.com/frctl/fractal/commit/a6254997dbf23edf9dbe992af0ae040e4d23e22d))





## 1.2.0

### Bug Fixes

-   allow handlePrefix option to be used with render tag (#40)
-   fix render tag overwriting component data in fractal core (#44)
-   fix component notes not working when using twigAdapter as docs engine (#46)
-   set source engine value (#48)

### Features

-   allow usage of default twig.js template resolver (#43)

## 1.1.0

-   move default value to default config object 35d0ca8
-   merge objects instead of assign for render tag (#38) 5bc5ed1
-   add strict_variables option support (#36) 7816d3d
-   add support for docs (#37) ad773b7
-   Update twig.js dependency and fix render tag (#35) 9588f03
-   Bump lodash from 4.17.11 to 4.17.13 d1649dc
-   Support data references 114918e
-   Allow passing twig.js namespaces b155eb1

## 1.0.0

Initial release.
