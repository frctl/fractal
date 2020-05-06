# Mandelbrot

The default web UI theme for Fractal.

See the Fractal [documentation](http://fractal.build/guide) for details on configuration and usage.

In order to get a locale aware date for the 'last updated' text, install the
[full-icu](https://github.com/unicode-org/full-icu-npm) module.

## Customize theme labels

Some theme-specific labels can be overriden via config options:

```
const theme = require('@frctl/mandelbrot')({
    labels: {
        info: 'Information',
        builtOn: 'Built on',
    },
});

fractal.web.theme(theme);
```
