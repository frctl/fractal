# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
-   update sinon and move it to devDependencies (#555)
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
