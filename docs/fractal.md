# Fractal API

### Fractal(config)

Instantiate a new Fractal instance.

* `config.src`: Path to the components directory, relative to the `cwd`.

```js
const Fractal = require('@frctl/fractal');

const fractal = Fractal({
  src: './path/to/components'
});
```

### .parse(callback)

Parse the source directory. Accepts a `callback` function that is called once the parsing process is complete.

#### callback(err, result)

* `err`: An `Error` instance if an error has occurred during parsing, otherwise `null`
* `result`: An object containing the following keys:
  * `components`: A components collection. See the [collections](/docs/collections.md) documentation for more details.
  * `files`: A files collection. See the [collections](/docs/collections.md) documentation for more details.

```js
fractal.parse(function(err, {components, files}) {
  if (err) {
    return console.log(err); // an error has occurred
  }
  console.log(components.toArray());
});
```

### .addPlugin(plugin, applyTo = 'components')

Add a parser plugin to manipulate the component data objects.

```js
fractal.addPlugin(function makeTagsUpperCase(components, done){
  for (const component of components) {
    component.tags = component.tags.map(tag => tag.toUpperCase());
  }
  done();
});
```

### .addMethod(name, method, applyTo = 'components')

Register a [collection](/docs/collections.md) method.

```js
fractal.addMethod('filterByTag', function(tagName){
  return this.filter(component => {
    return component.tags.includes(tagName);
  })
});

// the `filterByTag` method will now be available on the components collection returned by the .parse() method
fractal.parse(function(err, result){
  console.log(result.components.filterByTag('foobar')); // array of components with the tag 'foobar'
});
```

### .addExtension(extension)

Add an extension. Fractal extensions can add plugins, methods and/or more to the base Fractal instance.
