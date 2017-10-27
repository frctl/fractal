# Project configuration

Fractal project configuration is done in a single file, `fractal.config.js` that must be placed in the root of your project.

It should export a configuration object using the Node `module.exports` format. Core configuration properties must be specified under the `app` config key.

An example config file might look like this:

```js
module.exports = {
  app: {
    src: './components',
    plugins: [
      // ...
    ],
    engines: [
      // ...
    ]
  }
}
```

## Loading plugins and rendering engines

Third-party plugins and rendering engines must first be installed in the project via `npm install`. You can then reference them in the the config file by name:

```js
plugins: [
  '@frctl/fractal-plugin-status'
]
```

Some plugins/render engines accept configuration options. These can be provided using the following array-style format:

```js
plugins: [
  ['@frctl/fractal-plugin-status', {
    // plugin opts here
  }]
]
```

## Loading and configuring extensions

Third-party extensions (such as Fractal Pages and Fractal Inspector) must first be installed in the project via `npm install`.

Each extension will have it's own configuration namespace, such as `pages` or `inspector`. To load the extension, this must be present in the config file, even if no additional configuration is required.

For example, to use the Inspector extension, first install it in your project:

```
npm i @frctl/inspector
```

Then add the `inspector` key to your `fractal.config.js` file:

```js
module.exports = {
  app: {
    // core config here
  },
  inspector: {
    // inspector config here, or leave empty if none is required
  }
}
```

You will now be able to start the Inspector using the `fractal-beta inspect` command in the root directory of your project.
