# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
