# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.4.1-wombatpatch.0 (2020-10-08)


### Bug Fixes

* **mandelbrot:** hide hidden variants in info panel ([#649](https://github.com/frctl/fractal/issues/649)) ([179c4fd](https://github.com/frctl/fractal/commit/179c4fd78e64ecb90e5716df67cb83b767d19ea6))
* **mandelbrot:** make relative path links from notes accessible both from local server as deployed server ([#659](https://github.com/frctl/fractal/issues/659)) ([9311ef5](https://github.com/frctl/fractal/commit/9311ef5a3ca429c473686bc9cfa20ef7c85db582))
* fix empty error render in HTML tab ([#102](https://github.com/frctl/fractal/issues/102)) ([053b7e0](https://github.com/frctl/fractal/commit/053b7e0168eda4242550f833e45aefbbb1895fe4))
* increase text selection contrast ([#111](https://github.com/frctl/fractal/issues/111)) ([021738e](https://github.com/frctl/fractal/commit/021738ef7f49ee351d3b59ede3a6ae92e89fb374)), closes [#44](https://github.com/frctl/fractal/issues/44)
* **Navigation:** proper padding for Assets block title ([292b469](https://github.com/frctl/fractal/commit/292b469e4332100bfd0df318956bcbdf30879a2d))
* move scrolling of the sidebar to after the state has been applied ([#85](https://github.com/frctl/fractal/issues/85)) ([c693e42](https://github.com/frctl/fractal/commit/c693e421dbb2adc5f8fd5f30c74f844848c5d2f5))


### Features

* **Mandelbrot:** allow to customize all the theme labels ([#636](https://github.com/frctl/fractal/issues/636)) ([5735ef7](https://github.com/frctl/fractal/commit/5735ef7a9745cbf2fe4e4ca7eb31837fb2a4494e)), closes [#633](https://github.com/frctl/fractal/issues/633)
* add build time information ([#94](https://github.com/frctl/fractal/issues/94)) ([17c34da](https://github.com/frctl/fractal/commit/17c34da2e7255e375f2c83e082d114acb7193a40))
* add navigation search ([#81](https://github.com/frctl/fractal/issues/81)) ([08b73e3](https://github.com/frctl/fractal/commit/08b73e33186a6940950629712bdd95f4ee5a7152)), closes [#27](https://github.com/frctl/fractal/issues/27)
* allow customizing Mandelbrot skin with hex codes ([#627](https://github.com/frctl/fractal/issues/627)) ([f4ef6f9](https://github.com/frctl/fractal/commit/f4ef6f9064ae3a459e975947bc7c990afb098e08))
* allow resizing pen preview height on narrow screens ([#626](https://github.com/frctl/fractal/issues/626)) ([519335b](https://github.com/frctl/fractal/commit/519335b303aa0489d83297e543252b53a5985e73))
* allow users to customize highlight.js theme ([#105](https://github.com/frctl/fractal/issues/105)) ([88e6a18](https://github.com/frctl/fractal/commit/88e6a18baf3e039d8db7e5b70e351695c3e04b2b))
* persist navigation state only for the current session ([#110](https://github.com/frctl/fractal/issues/110)) ([67fbacb](https://github.com/frctl/fractal/commit/67fbacb47c9972bbdc630c2dcd121a7c01369fb3)), closes [#78](https://github.com/frctl/fractal/issues/78)
* **Navigation:** improve search behavior & add collapse all ([#107](https://github.com/frctl/fractal/issues/107)) ([a8daf61](https://github.com/frctl/fractal/commit/a8daf61ee7cc8b25b4301281d36b54dbb0036df7))
* bump handlebars from 4.1.0 to 4.5.3 ([#98](https://github.com/frctl/fractal/issues/98)) ([f1bb8da](https://github.com/frctl/fractal/commit/f1bb8daface11764ea0948a67b5b2b7bb473b99e))
* bump jquery from 2.2.4 to 3.4.0 ([#87](https://github.com/frctl/fractal/issues/87)) ([09afb15](https://github.com/frctl/fractal/commit/09afb15c2e4665ab55b4afd103e384fabade4294))
* enable keyboard interaction for nav toggles ([#106](https://github.com/frctl/fractal/issues/106)) ([a91ae04](https://github.com/frctl/fractal/commit/a91ae04ace94c60288d553d17b306b9a3dfd78a7))
* **variants:** add support for hidden variants ([d8604a8](https://github.com/frctl/fractal/commit/d8604a87b95db725a596e433a6cec456febc6446))





## 1.4.0

### Bug Fixes

-   proper padding for Assets block title
-   increase text selection contrast (#111)

### Features

-   enable keyboard interaction for nav toggles (#106)
-   improve search behavior & add collapse all button to navigation (#107)
-   allow users to customize highlight.js theme (#105)
-   remove useless preview iframe sandbox attribute (#109)
-   avoid redefining already inherited font families (#112)
-   persist navigation state only for the current session (#110)

### Chores

-   setup ESLint, Prettier and properly configure Stylelint (#108)

## 1.3.0

### Bug Fixes

-   make header button usable with keyboard (#84)
-   fix style for code blocks (#79)
-   fix empty error render in HTML tab (#102)
-   move scrolling of the sidebar to after the state has been applied (#85)
-   fix font file loading error in firefox (#103)

### Features

-   add build time information (#94)
-   add navigation search (#81)

### Chores

-   update development environment (#97)
-   bump handlebars from 4.1.0 to 4.5.3 (#98)
-   bump jquery from 2.2.4 to 3.4.0 (#87)

## 1.2.1

-   Improve header layout when having a long title on small screens
-   Add support for IE 11
-   Add allow-modals to preview iframe sandbox attribute to authorize alerts

## 1.2.0

-   Add user-configurable `beautify` filter
-   Limit images width in documentation section

## 1.1.0

-   Fix labelling of variants in info panel
-   Fix context for collated components

## 1.0.9

-   Update default static assets mount location

## 1.0.8

-   Display components tags in info panel
-   Add `allow-forms` for form submissions in preview iframe
-   Ensure that title rather than label is used for top-level navigation

## 1.0.7

-   Temporary fix for broken links in static builds

## 1.0.6

-   1.0.5 with assets built

## 1.0.5

-   Remove srcdoc attribute from iframe due to SVG rendering issues

## 1.0.4

-   Clean up setting of environment vars when rendering components
-   Fix blockquote styling [@paulrobertlloyd]
-   Fix code block overflow in doc pages

## 1.0.3

-   Fix initial preview window height bug
-   Change confusing 'open in new window' title text
-   Windows compat improvements

## 1.0.2

-   Make component asset URLs file-structure independent
-   Update default favicon

## 1.0.1

-   Fix duplicate tabs issue

## 1.0.0

Initial release.
