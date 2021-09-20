# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.11](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.10...@frctl/fractal@1.5.11) (2021-07-20)

**Note:** Version bump only for package @frctl/fractal





## [1.5.10](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.9...@frctl/fractal@1.5.10) (2021-07-19)


### Bug Fixes

* add relative path to component links in static builds ([#1062](https://github.com/frctl/fractal/issues/1062)) ([2f84d3b](https://github.com/frctl/fractal/commit/2f84d3b84498c238d28c2ca1021daf89aff879be))





## [1.5.9](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.8...@frctl/fractal@1.5.9) (2021-07-12)


### Bug Fixes

* try to resolve file preview to a component ([#1044](https://github.com/frctl/fractal/issues/1044)) ([f5b915a](https://github.com/frctl/fractal/commit/f5b915a927cbd3261d81609ad8360781c677bb35))





## [1.5.8](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.7...@frctl/fractal@1.5.8) (2021-05-20)

**Note:** Version bump only for package @frctl/fractal





## [1.5.7](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.6...@frctl/fractal@1.5.7) (2021-05-20)

**Note:** Version bump only for package @frctl/fractal





## [1.5.6](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.5...@frctl/fractal@1.5.6) (2021-03-23)

**Note:** Version bump only for package @frctl/fractal





## [1.5.5](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.4...@frctl/fractal@1.5.5) (2021-03-20)

**Note:** Version bump only for package @frctl/fractal





## [1.5.4](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.3...@frctl/fractal@1.5.4) (2021-02-14)

**Note:** Version bump only for package @frctl/fractal





## [1.5.3](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.2...@frctl/fractal@1.5.3) (2021-02-07)

**Note:** Version bump only for package @frctl/fractal





## [1.5.2](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.1...@frctl/fractal@1.5.2) (2020-12-22)


### Bug Fixes

* remove console.error when looking for a package.json file ([#691](https://github.com/frctl/fractal/issues/691)) ([b46536b](https://github.com/frctl/fractal/commit/b46536bb3d6a5851154c80a38764c1cc2d8d7ebc))





## [1.5.1](https://github.com/frctl/fractal/compare/@frctl/fractal@1.5.0...@frctl/fractal@1.5.1) (2020-11-13)

**Note:** Version bump only for package @frctl/fractal





# [1.5.0](https://github.com/frctl/fractal/compare/@frctl/fractal@1.4.1...@frctl/fractal@1.5.0) (2020-11-03)


### Bug Fixes

* update file extension of docs index in new command ([#681](https://github.com/frctl/fractal/issues/681)) ([6cfa943](https://github.com/frctl/fractal/commit/6cfa943784c6462231ffd51e8afb30b0803c03bb)), closes [/github.com/frctl/fractal/commit/b23ecbaa433fb57fae20136ac7ea7e10469a34ff#diff-bce2cc04110d03fb1499379830faa44a173d254ad7f6f3fda808728746b291e5](https://github.com//github.com/frctl/fractal/commit/b23ecbaa433fb57fae20136ac7ea7e10469a34ff/issues/diff-bce2cc04110d03fb1499379830faa44a173d254ad7f6f3fda808728746b291e5)


### Features

* allow pulling collections to root ([#642](https://github.com/frctl/fractal/issues/642)) ([d2cfa1b](https://github.com/frctl/fractal/commit/d2cfa1b6a76ca2328967374c62f4e35ca10cb758))





## [1.4.1](https://github.com/frctl/fractal/compare/@frctl/fractal@1.4.0...@frctl/fractal@1.4.1) (2020-10-19)

**Note:** Version bump only for package @frctl/fractal





# [1.4.0](https://github.com/frctl/fractal/compare/@frctl/fractal@1.3.0...@frctl/fractal@1.4.0) (2020-10-15)


### Bug Fixes

* fix resolving camelCased variant templates ([#652](https://github.com/frctl/fractal/issues/652)) ([c81c69a](https://github.com/frctl/fractal/commit/c81c69ae5237f3027e70089a6918221513d7f106))
* properly load notes from readme files for components variants ([#630](https://github.com/frctl/fractal/issues/630)) ([d2f6dcf](https://github.com/frctl/fractal/commit/d2f6dcffeefe25f3e9f0d272c0b0bdd9590779bf)), closes [#629](https://github.com/frctl/fractal/issues/629)


### Features

* allow overriding/extending highlighter ([#628](https://github.com/frctl/fractal/issues/628)) ([ad1689b](https://github.com/frctl/fractal/commit/ad1689bb82f8ba87911a66f8117482d8c247055d))
* filter excluded files/directories in the file system parsing stage ([#661](https://github.com/frctl/fractal/issues/661)) ([7c09c27](https://github.com/frctl/fractal/commit/7c09c27ca970dc2bca79ea4f1acafb1d7209642d))
* **CLI:** add start/build npm scripts to package.json for new projects ([#620](https://github.com/frctl/fractal/issues/620)) ([1c923d8](https://github.com/frctl/fractal/commit/1c923d86f70eef8c85d662e72beaf81098a2bb38))





## 1.3.0

### Bug Fixes

-   fix usage of file path as preview value in config (#509)
-   remove end from server rendering (#546)
-   escape string passed to regexp (#534)
-   fix entity names with double extension (#565)
-   append extension to relative URLs too (#575)
-   fix nunjucks view syntax (#579)
-   add hljs class to code elements (#578)
-   resolve date in config to JSON string (#574)
-   CLI: ensure new command runs npm install (#583)

### Features

-   add support for variant notes files (#566)
-   add exclude config option to components (#572)
-   update mandelbrot (#577)
-   allow and prefer fractal.config.js as configuration file name (#581)
-   update handlebars adapter (#584)
-   allow sub-components to be rendered fully (#573)
-   update istextorbinary to get newer extensions (#589)

### Chores

-   add all current LTS versions of Node to the Travis build matrix (#538)
-   move snyk to devDependencies (#553)
-   bump minimist from 1.2.0 to 1.2.2 (#554)
-   package.json & package-lock.json to reduce vulnerabilities (#552)
-   update anymatch, chokidar and nunjucks (#564)
-   bump minimist from 1.2.2 to 1.2.3 (#567)
-   remove snyk dependency (#569)
-   update readme (#571)
-   move to multiple issue templates (#587)

### Tests

-   add coverage and unit tests for collection mixin class (#568)

## 1.2.1

-   Merge pull request #518 from Schleuse/add-access-to-logger 9596257a
-   Export reference to Log a502e7ee

## 1.2.1-beta.1

-   prevent 404 errors from stoppping fractal server (#515) ee315f28
-   prevent 404 errors from stoppping fractal server aebb1ad9

## 1.2.0

-   Add publishConfig setting for np 53108230
-   Replace returned promise in dev server CLI command with async ca… (#511) 5762029d
-   Merge pull request #509 from guschilds/417-js-config-crash-fix 92235294
-   Fixed sync crash when JS config files contain errors. (#417) 495753c5
-   Update Lodash to 4.17.14 (#508) 1f5cec40
-   Update Lodash to 4.17.14 f2204012
-   Merge pull request #504 from baerkins/browsersync-named afe56da0
-   Update Marked (#477) 66bd93ae 549d93b5 9f589139
-   [Snyk] Fix for 2 vulnerable dependencies (#493) f68c265c
-   [Snyk] Fix for 1 vulnerable dependencies (#496) 2fb71dfe
-   Add project title as named browser-sync instance 13b42dce
-   Merge pull request #486 from allmarkedup/contributing 16996836
-   Merge pull request #483 from frctl/snyk-fix-7m2uya affb934e
-   Merge pull request #485 from frctl/snyk-fix-3czbum 6a23b2bb
-   Add link to code of conduct f2639ba3
-   Remove project status note, add Contributing section 7d23ce97
-   fix: package.json & package-lock.json to reduce vulnerabilities 837e0d44 67c12069 91dd857a 86f713f1
-   Fix `code` renderer 6b4506a2
-   Merge pull request #481 from thisislawatts/fix/upgrade-away-vulns-where-possible 6f105a42
-   fix: upgrade away vulns where possible e63f51f6
-   Merge pull request #479 from Schleuse/log-error-when-readFile-fails 2c38ac79
-   Log Error when readFile fails to load a file cc37d1ef
-   Merge pull request #473 from frctl/circ-ref-fix 8aa7bca4
-   Fix Node/Fractal versions number 59a348b8
-   Prevent markdown renderer from directly mutating config object 31158e69

## 1.1.3

[NEW] Add support for underscore prefixes for 'short' config filenames

## 1.1.2

-   [FIX] Fix issue with underscore-prefixed config files being ignored
-   [FIX] Address issue with variants context bleeding into each other (#208)

## 1.1

-   [NEW] Add support for 'short' non-component-name-prefixed config files for collections and compound components
-   [NEW] Provide `meta` component/docs config namespace for arbitrary user-defined metadata (#89)
-   [NEW] BrowserSync config option `watchOptions.ignored` can now be used to prevent ignored files from causing a UI reload (#134)
-   [NEW] Web config option `builder.static.ignored` can now be used to prevent ignored files in the static directories from being copied when building. (#120)
-   [NEW] Context data is now resolved when the data tree is rebuilt to allow synchronous retrieval via new `entity.getContext()` method.
-   [FIX] Prevent arrays being merged during context data inheritance (#123)
-   [FIX] Default variant view template issue (#67)
-   [FIX] Patch issue with commands not exiting in latest version of Vorpal
-   [OTHER] Refactor Builder class to better match Server class structure.

## 1.0.11

-   [NEW] Add `.configData` property to components
-   [FIX] Fix issue with urlencoding of files causing issues in build (#178)
-   [FIX] Hidden properties now correctly cascade when set in config (#182)

## 1.0.9

-   [FIX] Address issue with using beta version globally to start earlier-versioned projects
-   [OTHER] Better BrowserSync support [@tlenex]

## 1.0.7

-   Fix missing FS module in component source

## 1.0.6

-   Fix toc() method for docs
-   Fix eslint peerDependencies issue

## 1.0.5

-   Fix paths generated on Windows when running static builds
-   Improve rendering of components with 'special' env variables
-   Allow adapters to override the default reference parsing behaviour
-   Bump Marked version to fix security warnings
-   Switch to eslint, first pass at code cleanup

## 1.0.4

-   Fix copyAssets error introduced in last release
-   Prevent markdown code blocks without a lang attribute being escaped
-   Bump Mandelbrot dependency version

## 1.0.3

-   Windows path fixes [@webprofijt]
-   Spelling corrections [@webprofijt]

## 1.0.2

-   fullPath bug fix

## 1.0.1

-   Fix issue with underscore prefixed component/docs root folders hiding all contents
-   Add support for themes to map urls to static assets

## 1.0.0

Initial release.
