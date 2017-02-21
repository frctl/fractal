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

## Properties

### .components

An array of components identified during the parsing step.

### .collections

An array of collections identified during the parsing step.

### .files

An array of all the files in the component library.



## Custom methods

Any methods registered via the top-level `.addMethod()` method (including any added via extensions) are bound to this library API object. For example:

```js
parser.addMethod('getRandomComponents', function(num = 1){
  const randoms = [];
  const components = this.components; // 'this' is bound to the library API object
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
