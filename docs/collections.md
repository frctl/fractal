# Collections

The callback to the `Fractal.parse()` method receives `components` and `files` arguments. Each of these are collections that expose a set of methods for querying and working with the relevant entities.

```js
const Fractal = require('@frctl/fractal');

const fractal = Fractal({
  src: './path/to/components'
});

fractal.parse(function(err, components, files){
  // 'components' and 'files' are collections.
});
```

Each collection provides a set of methods for working with this data, and exposes custom methods that have been been registered via the top-level `Fractal.addMethod()` method.

## Components

These are the default methods that are provided for working with the components in your library.

### .count()

Returns the number of [components](/docs/entity-schemas.md#component) found.

```js
const myComponents = components.getAll();
```

### .getAll()

Returns an array of all [components](/docs/entity-schemas.md#component).

```js
const myComponents = components.getAll();
```

<!-- ### .getViews()

Returns an array of all view template files.

```js
const views = components.getViews();
```

### .getViewsFor(component)

Returns an array of all view template files for a specific component.

* `component`: a component name or a component object [required]

```js
const buttonViews = components.getViewsFor('button');
```

### .findView(component, adapterName)

Find the view template for a component that is used by the specified adapter. Returns `undefined` if a match is not found.

* `component`: a component name or a component object [required]
* `adapterName`: name of a registered template engine adapter [required]

```js
const nunjucksButton = components.findView('button', 'nunjucks');
``` -->

### .renderView(view, context, callback)

Render a view file to HTML.

* `view`: a view template file [required]
* `context`: object of data to use when rendering the view [required]
* `callback`: callback function, called when rendering is complete or an error has occurred [required]

```js
const nunjucksButton = components.findView('button', 'nunjucks');

components.renderView(nunjucksButton, {text: 'Click here!'}, function(err, html){
  if (err) {
    return console.log(err);
  }
  console.log(html); // log the HTML of the rendered button
});
```

<!-- ### .findByName(name)

Find a component by name. Returns `undefined` if not found.

* `name`: name of the component to find [required]

```js
const button = components.findByName('button');
``` -->

## Files

These are the default methods that are provided for working with the files in your library.

### .count()

Returns the number of [files](/docs/entity-schemas.md#file) found.

### .getAll()

Returns an array of all [files](/docs/entity-schemas.md#file).

```js
const myFiles = files.getAll();
```

<!-- ### .filterByPath(match)

Get an array of file objects for all files whose relative path matches the supplied `match` argument.

The `match` argument can be a single path, a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) or an array of glob patterns. If an array is provided then positive patterns add to the result whilst negative ones subtract from it.

```js
const stylesheets = files.filterByPath('**/assets/*.css'); // Single glob string
const scripts = files.filterByPath(['**/*.js', '!**/config.js']); // Array of glob strings
``` -->

## Custom methods

Any methods registered via the top-level Fractal `.addMethod()` method (including any added via extensions) are bound to and made available on the appropriate library API object. For example:

```js
fractal.addMethod('getRandom', function(args, state, app){
  const num = args[0];
  const randoms = [];
  const components = this.getAll(); // 'this' is bound to the API object itself
  for (var i = 0; i < num; i++) {
    randoms.push(components[Math.floor(Math.random() * components.length)]);
  }
  return randoms;
});

fractal.parse(function(err, components){
  if (err) {
    return console.log(err);
  }
  const randomComponents = components.getRandom(3);
  console.log(randomComponents); // logs 3 random components
});

```
