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

Parse the component files. Accepts a `callback` function that is called once the parsing process is complete.

#### callback(err, components, files)

* `err`: An `Error` instance if an error has occurred during parsing, otherwise `null`
* `components`: A components API object. See the [Entity APIs](/docs/entity-apis.md) documentation for more details.
* `files`: A files API object. See the [Entity APIs](/docs/entity-apis.md) documentation for more details.

```js
fractal.parse(function(err, components, files) {
  if (err) {
    return console.log(err); // an error has occurred
  }
  console.log(components.getAll());
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

Register a method to be made available to the relevant [Entity API](/docs/entity-apis.md) object once parsing is complete.

```js
fractal.addMethod('filterByTag', function(tagName){
  return this.getAll().filter(component => {
    return component.tags.includes(tagName);
  })
});

// the `filterByTag` method will now be available on the components API object returned by the .parse() method
fractal.parse(function(err, components){
  console.log(components.filterByTag('foobar')); // array of components with the tag 'foobar'
});
```

### .addAdapter(adapter)

Add a template engine adapter.

### .addExtension(extension)

Add an extension. Fractal extensions can add plugins, methods and/or more to the base Fractal instance.
