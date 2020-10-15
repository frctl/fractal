# @frctl/mandelbrot

The default web UI theme for [Fractal](http://github.com/frctl/fractal).

[![NPM Version](https://img.shields.io/npm/v/@frctl/mandelbrot)](https://www.npmjs.com/package/@frctl/mandelbrot)

See the Fractal [documentation](https://fractal.build/guide) for details on [configuration and usage](https://fractal.build/guide/web/default-theme.html).

In order to get a locale aware date for the 'last updated' text, install the
[full-icu](https://github.com/unicode-org/full-icu-npm) module.

## Development

[Follow these instructions](https://github.com/frctl/fractal#development) to setup the development environement, then go to the Mandelbrot package directory:

```
cd packages/mandelbrot
```

In there, run:

```
npm start
```

To start Gulp in watch mode and automatically recompile Mandelbrot’s CSS & JS files on save.

You can also build the files once with:

```
npm run build
```

You can see your changes in one of our [example Fractal instances](https://github.com/frctl/fractal/tree/main/examples).

## License

[MIT](https://github.com/frctl/fractal/blob/main/LICENSE)
