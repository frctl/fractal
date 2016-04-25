# API - Collection Objects

*Collection objects* are immutable objects that contain a set of items. The items can either be entities such as components, or collections themselves.

Collection objects are ES6 iterators that can be used in statements such as `for...of` loops.

Fractal has four different types of collections (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

<!-- START doctoc -->
<!-- END doctoc -->

## Common methods and properties

#### .items()

#### .first()

#### .last()

#### .eq(pos)

#### .entities()

#### .collections();

#### .find(...args);

#### .findCollection(...args);

#### .flatten();

#### .flattenDeep();

#### .squash();

#### .filter();

#### .orderBy(...args);

#### .toArray()

#### .toJSON()

#### .size

#### .source


## Component collections

#### .variants()

#### .components()

#### .assets()


## Docs pages collections

#### .pages()


## Asset collections

#### .files()

#### .match()


## Variant collections

#### .default()
