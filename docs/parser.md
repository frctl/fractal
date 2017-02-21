# Parser API

### fractal(config)

Instantiate a new Fractal instance.

* `config.src`: Path to the components directory, relative to the `cwd`.

```js
const fractal = require('@frctl/fractal');

const parser = fractal({
  src: './path/to/components'
});
```

### .parse(callback)

Parse the components directory. Accepts a `callback` function that is called once the parsing process is complete. If not `callback` function is provided, this will instead return a `Promise` that will be resolved when the parsing step is complete.

#### callback(err, library)

* `err`: An `Error` instance if an error has occurred during parsing, otherwise `null`
* `library`: An library API object. See the [Library API](/docs/library.md) documentation for more details.

```js
parser.parse(function(err, library) {
  if (err) {
    return console.log(err); // an error has occurred
  }
  // `library` is an library API object - see below for more details
  console.log(library.getComponents());
});
```

### .addPlugin(plugin)

Add a parser plugin to manipulate the component data objects.

```js
parser.addPlugin(function makeTagsUpperCase(components, done){
  for (const component of components) {
    component.tags = component.tags.map(tag => tag.toUpperCase());
  }
  done();
});
```

### .addMethod(name, method)

Register a method that will be made available to the `data` object argument to the `.parse()` method callback if successful.

```js
parser.addMethod('getComponentsByTag', function(tagName){
  return this.components.filter(component => {
    return component.tags.includes(tagName);
  })
});

// the `getComponentsByTag` method will now be available on the data object returned by the .parse() method
parser.parse(function(err, data){
  console.log(data.getComponentsByTag('foobar')); // array of components with the tag 'foobar'
});
```

### .addAdapter(adapter)

Add a template engine adapter.

### .addExtension(extension)

Add an extension. Fractal extensions can add plugins, methods and/or more to the base Fractal instance.
