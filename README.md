@innoq/fractal-fork
============

<p>
  <a href="https://www.npmjs.com/package/@innoq/fractal-fork" title="Current version">
    <img src="https://img.shields.io/npm/v/%40innoq%2Ffractal-fork" alt="">
  </a>
  <!-- License -->
  <a href="https://github.com/frctl/fractal/blob/main/LICENSE" title="MIT license">
    <img alt="GitHub" src="https://img.shields.io/github/license/frctl/fractal">
  </a>
</p>

This is a fork of the open-source [Fractal][docs] tool for helping you **build** and **document** website component libraries and design systems.

Those familiar with [Fractal][docs] will know that it is a great tool for developing lightweight frontend components without being dependent on any heavy JavaScript framework.

Unfortunately, Fractal has suffered over the years with out-of-date dependencies and is now officially
[unmaintained](https://github.com/frctl/fractal/issues/1167).
We have used Fractal successfully in customer projects and therefore have the desire to maintain a _version_ of Fractal with up-to-date dependencies. Since we do not use all of the features of the official branch, we are am providing this fork instead.

**The goal of this fork is to maximize maintainability for customer projects and _not_ to provide complete feature parity with the official branch.** The project is therefore developed with the following concrete goals:

1. Maximize maintainability by reducing size of source code
2. Minimize number of dependencies

We use real Fractal projects to test any changes that we make to the source code. However, this also means that **any feature that we do not personally use for any Fractal projects is at risk of being removed in the future** (especially if it uses dependencies which are poorly maintained).

## Migration Guide from `@frctl/fractal` to `@innoq/fractal-fork`

The changes to offical Fractal branch are listed here as follows:

* `@innoq/fractal-fork` uses a single repository for ease of deployment. To migrate from `@frctl/fractal` to `@innoq/fractal-fork` do the following:
  * Replace `require('@frctl/core')` with `require('@innoq/fractal-fork').core`
  * Replace `require('@frctl/fractal')` with `require('@innoq/fractal-fork').fractal`
  * Replace `require('@frctl/handlebars')` with `require('@innoq/fractal-fork').handlebars`
  * Replace `require('@frctl/mandelbrot')` with `require('@innoq/fractal-fork').mandelbrot`
  * Replace `require('@frctl/web')` with `require('@innoq/fractal-fork').web`
* Replace the `fractal` command in your package.json scripts with `fractal-fork`
* Automatic port discovery is not supported for `@innoq/fractal-fork`. If a port is blocked, `@innoq/fractal-fork` will quit with an error and it is the developer's responsibility to set a different port via `--port`.
* `@innoq/fractal-fork` does not support the `--sync` option for the `start` command. This simplifies the implementation and avoids security vulnerabilities introduces by the `browser-sync` dependency
* `@innoq/fractal-fork` does not support the `twig`, `nunjucts`, or `react` adapters (if you still need them, it should be possible for you to maintain a separate fork for those adapters)
* `@innoq/fractal-fork` does not support the `new` CLI command (it's a command that is rarely used because it is only necessary to create the repository once. The alternative is to create the repository structure and `fractal.config.js` by hand. The CLI command was one area which had horrible dependencies which needed to be removed)
* The CLI output for `@innoq/fractal-fork` is much less pretty -- there are no colors and the console never overwrites previous log output. This means particularly for the `build` command that the console output is much longer


[Read the full Fractal documentation][docs]

## Introduction to Fractal

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you assemble, preview and document website component libraries, or even scale up to document entire design systems for your organisation.

Check out the [documentation][docs] for more information.


## Getting started

### Install into your project (recommended)

```shell
npm install @innoq/fractal-fork --save-dev
```

Then create your `fractal.config.js` file in the project root, and configure using the [official documentation][docs] but keeping in mind the changes to imports listed out in [the migration guide](#migration-guide-from-frctlfractal-to-innoqfractal-fork).

An example pattern library using the `@innoq/fractal-fork` library can be found in the `example` folder.

Then you can either run `npx fractal-fork start` to start up the project, or create an alias under the `scripts` section in your package.json as a shortcut.

e.g.

```json
"scripts": {
    "fractal:start": "fractal-fork start",
    "fractal:build": "fractal-fork build"
}
```

then

```shell
npm run fractal:start
```

### Submitting pull requests

We welcome pull requests, but cannot guarantee that they will be reviewed in a timely way. Please submit PRs against `main` branch with an explanation of your intention.

### Development

## Testing

Existing tests can be run using the `npm test` command.

## License

[MIT](https://github.com/frctl/fractal/blob/main/LICENSE)

[docs]: https://fractal.build
