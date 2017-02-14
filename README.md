# Fractal

> This is a WIP v2 rewrite of Fractal and should not be considered stable. Use at your own risk!

Fractal provides a programmatic API for working with filesystem-based component libraries.

It features a plugin-based parsing engine to provide simple but powerful customisation and can be used to help you build component-library based projects from initial conception right through to use in production.

## Installation

```bash
npm i @frctl/fractal --save
```

## Usage

```js
const fractal = require('@frctl/fractal');
const components = fractal({
  src: './path/to/components'
})

components.parse((err, api) => {
  if (err) {
    return console.log(err);
  }
  for (const component of api.getComponents()) {
    console.log(component.name);
  }
});

```

## API

### fractal(config)

Instantiate a new Fractal instance.

* `config.src`: Path to the components directory, relative to the `cwd`.

### .parse(callback)

Parse the components directory. Accepts a `callback` function that is called once the parsing process is complete.

#### callback(err, api)

* `err`: An `Error` instance if an error has occurred during parsing, otherwise `null`
* `api`: An API object that exposes a set of registered methods bound to the data returned from the parsing step.

### .addPlugin(plugin)

Add a parser plugin to manipulate the component objects.

### .addMethod(name, method)

Register a method that will be made available to the `api` object argument to the `.parse()` method callback if successful.

### .addAdapter(adapter)

Add a template engine adapter.

### .addExtension(extension)

Add an extension. Fractal extensions can add plugins, methods and/or more to the base Fractal instance.

## Requirements

Fractal requires [Node.js](https://nodejs.org) v6.0.0 or greater.

## Credits

Fractal is developed and maintained by [Danielle Huntrods](http://github.com/dkhuntrods), [Mark Perkins](http://github.com/allmarkedup) and all our excellent contributors.

Ongoing support by [Clearleft](http://clearleft.com) makes this project possible. Thank you!

[![Clearleft](http://clearleft.com/assets/img/logo.png)](http://clearleft.com)
