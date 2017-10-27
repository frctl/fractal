# Fractal v2 beta overview

v2 is a major update to Fractal with many breaking changes from the v1.x branch. It is not compatible with component libraries developed using previous versions.

The new version is based around a **plugin-based filesystem parser** and **adapter-based component renderer** which can be configured and extended to closely fit the needs of your project.

The v1 'web UI' has been replaced by two separate (optional) tools, both of which are built on top of the core parsing/rendering engine:

- **Fractal Inspector** - A locally-run web app for previewing and debugging your components in the browser
- **Fractal Pages** - A static site builder with deep integration into your component library to let you build completely bespoke styleguides, prototypes and more.

The core library also exposes a greatly improved **programmatic API** which can be used to integrate Fractal directly into your site or build tools.

And lastly, the v2 **Command Line Interface (CLI)** tool has been simplified to make it easier to develop and use third-party commands. Access to the core API gives commands much more flexibility and better insight into your component library.

Other key features of Fractal v2 include:

* Improved project configuration
* Variant-specific views using template pre-processing
* Flexible preview data definition for components and variants based on 'scenarios'
* Webpack-style aliasing of dependency paths within config files
* Much better test coverage and linting
* And more...

## Current Status

The v2 beta is still in a **very early state** and should not be used in a production environment at this point.

Some features have not been implemented, and many other areas are still in need of optimisation and performance improvements. The following (likely incomplete) list outlines some major items that are still in progress:

#### Core
* [ ] **template pre-processing**: `@else` and `@else-if` conditional statements have not yet been implemented.
* [ ] **template engine adapters** : Only 'vanilla' HTML (with variable placeholders) and Nunjucks template engines are currently available. More will be added during the beta period.
* [ ] **parser/plugin performance**: Many caching improvements still need to be made.

#### Inspector
* [ ] **asset pipeline**: Fractal v2 will ship with a configurable asset builder for previewing components in the Inspector. This is currently in progress and not yet available in the current beta release.
* [ ] **preview rendering**: The current implementation is just a basic proof-of-concept. Per-scenario preview windows with resizing tools and more are planned.
* [ ] **plugins**: No plugin model is yet available for the Inspector. _Suggestions for possible implementation strategies for this are welcome._

#### Pages
* [ ] **performance**: No performance optimisations have yet been made to the dev server or the full static build process.
* [ ] **layout plugin** Not yet implemented, will provide a simpler way to specify layouts via front-matter (currently layouts must be implemented using the Nunjucks extends/block functionality)
* [ ] **asset plugins** to support on-the-fly asset compilation for `Sass` etc.

#### CLI
* [ ] **'add component' command**: Missing any configuration options, currently very 'dumb'.
* [ ] **output rendering**: Whitespace handling is inconsistent and buggy
