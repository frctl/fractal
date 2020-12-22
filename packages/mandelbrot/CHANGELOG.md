# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.7.0](https://github.com/frctl/fractal/compare/@frctl/mandelbrot@1.6.0...@frctl/mandelbrot@1.7.0) (2020-12-22)


### Features

* display preview iframe size ([#685](https://github.com/frctl/fractal/issues/685)) ([c217848](https://github.com/frctl/fractal/commit/c2178482593bd670324b8cfa0a3f067f3a5523b6)), closes [#606](https://github.com/frctl/fractal/issues/606)





# [1.6.0](https://github.com/frctl/fractal/compare/@frctl/mandelbrot@1.5.1...@frctl/mandelbrot@1.6.0) (2020-11-03)


### Features

* allow custom information properties ([#678](https://github.com/frctl/fractal/issues/678)) ([2941791](https://github.com/frctl/fractal/commit/29417917d71abb5e10c1feeaf42305b61256c8e6))
* allow pulling collections to root ([#642](https://github.com/frctl/fractal/issues/642)) ([d2cfa1b](https://github.com/frctl/fractal/commit/d2cfa1b6a76ca2328967374c62f4e35ca10cb758))
* focus search input after clearing it ([#672](https://github.com/frctl/fractal/issues/672)) ([1c00083](https://github.com/frctl/fractal/commit/1c00083ab5d3758371c95afa87d506eea934df52))





## [1.5.1](https://github.com/frctl/fractal/compare/@frctl/mandelbrot@1.5.0...@frctl/mandelbrot@1.5.1) (2020-10-19)


### Bug Fixes

* **mandelbrot:** Properly initialize assets tab file select ([#669](https://github.com/frctl/fractal/issues/669)) ([dfaefa5](https://github.com/frctl/fractal/commit/dfaefa56ff1e76110381303c53ca742aacfcf660)), closes [#668](https://github.com/frctl/fractal/issues/668)
* initialize frame before navigation ([#667](https://github.com/frctl/fractal/issues/667)) ([33f4f59](https://github.com/frctl/fractal/commit/33f4f595705f906eba7634137a2045dfa4496220))





# [1.5.0](https://github.com/frctl/fractal/compare/@frctl/mandelbrot@1.4.0...@frctl/mandelbrot@1.5.0) (2020-10-15)


### Bug Fixes

* **mandelbrot:** hide hidden variants in info panel ([#649](https://github.com/frctl/fractal/issues/649)) ([179c4fd](https://github.com/frctl/fractal/commit/179c4fd78e64ecb90e5716df67cb83b767d19ea6))
* **mandelbrot:** make relative path links from notes accessible both from local server as deployed server ([#659](https://github.com/frctl/fractal/issues/659)) ([9311ef5](https://github.com/frctl/fractal/commit/9311ef5a3ca429c473686bc9cfa20ef7c85db582))


### Features

* **Mandelbrot:** allow to customize all the theme labels ([#636](https://github.com/frctl/fractal/issues/636)) ([5735ef7](https://github.com/frctl/fractal/commit/5735ef7a9745cbf2fe4e4ca7eb31837fb2a4494e)), closes [#633](https://github.com/frctl/fractal/issues/633)
* allow customizing Mandelbrot skin with hex codes ([#627](https://github.com/frctl/fractal/issues/627)) ([f4ef6f9](https://github.com/frctl/fractal/commit/f4ef6f9064ae3a459e975947bc7c990afb098e08))
* allow resizing pen preview height on narrow screens ([#626](https://github.com/frctl/fractal/issues/626)) ([519335b](https://github.com/frctl/fractal/commit/519335b303aa0489d83297e543252b53a5985e73))





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
