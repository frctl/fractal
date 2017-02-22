# Library API

The result of a successful parse of your component library is a 'library API object':

```js
const fractal = require('@frctl/fractal');

const parser = fractal({
  src: './path/to/components'
});

parser.parse(function(err, library){
  // 'library' is a library API object.
});
```

This library object provides access to the output of the parsing step (i.e. the `files`, `components` and `collections` within your component library). It also provides a set of methods for working with this data, and exposes any custom methods that have been been added via the top-level `.addMethod()` method.

## Available methods

### .getComponents()

Returns an array of all components.

```js
const components = library.getComponents();
```

### .getCollections()

Returns an array of all collections.

```js
const collections = library.getCollections();
```

### .getFiles()

Returns an array of all files.

```js
const files = library.getFiles();
```

### .getViews()

Returns an array of all view template files.

```js
const views = library.getViews();
```

### .getViewsFor(component)

Returns an array of all view files for a component.

* `component`: a component name or a component object [required]

```js
const views = library.getViewsFor('button');
```

### .findView(component, adapterName)

Find the view template for a component that is used by the specified adapter. Returns `undefined` if a match is not found.

* `component`: a component name or a component object [required]
* `adapterName`: name of a registered template engine adapter [required]

```js
const nunjucksView = library.findView('button', 'nunjucks');
```

### .components.findByName(name)

Find a component by name. Returns `undefined` if not found.

* `name`: name of the component to find [required]

```js
const button = library.components.findByName('button');
```

### .files.filterByPath(match)

Get an array of file objects for all files whose relative path matches the supplied `match` argument.

The `match` argument can be a single path, a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) or an array of glob patterns. If an array is provided then positive patterns add to the result whilst negative ones subtract from it.

```js
const stylesheets = library.files.filterByPath('**/assets/*.css'); // Single glob string
const scripts = library.files.filterByPath(['**/*.js', '!**/config.js']); // Array of glob strings
```

## Available properties

### .components

An array of components identified during the parsing step.

### .collections

An array of collections identified during the parsing step.

### .files

An array of all the files in the component library.

## Custom methods

Any methods registered via the top-level Fractal `.addMethod()` method (including any added via extensions) are bound to and made available on this library API object. For example:

```js
parser.addMethod('getRandomComponents', function(num = 1){
  const randoms = [];
  const components = this.getComponents(); // 'this' is bound to the library API object itself
  for (var i = 0; i < num; i++) {
    randoms.push(components[Math.floor(Math.random() * components.length)]);
  }
  return randoms;
});

parser.parse(function(err, library){
  if (err) {
    return console.log(err);
  }
  const randomComponents = library.getRandomComponents(3);
  console.log(randomComponents); // logs 3 random components
});

```
