# API - Source Objects

Source objects are a special sub-class of [Collection objects](/docs/api/collection.md). Like collections, they represent a set of entities and/or sub-collections. *Unlike* collections however, they also additionally provide source-type specific methods for working with the entities they contain, as well as holding information about the source (directory) itself.

A source object is returned when accessing the `.components` or `.docs` properties on the [main fractal instance](/docs/api/fractal.md):

```js
const fractal         = require('@frctl/fractal');
const componentSource = fractal.components; // source object
const docsSource      = fractal.docs; // source object

const button = componentSource.render('@button', {
    buttonText: 'This is a button'
});
```

All methods and properties that are provided by [Collection objects](/docs/api/collection.md) are also available on source objects, plus the specific additional methods/properties detailed below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Source API](#source-api)
    - [.resolve(context)](#resolvecontext)
    - [.renderString(str, [context])](#renderstringstr-context)
    - [.title](#title)
    - [.label](#label)
- [Component Source API](#component-source-api)
    - [.render(entity, [context], [opts])](#renderentity-context-opts)
    - [.assets()](#assets)
- [Documentation Source API](#documentation-source-api)
    - [.render(entity, [context])](#renderentity-context)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Source API

#### .resolve(context)
#### .renderString(str, [context])

#### .title
#### .label

## Component Source API

#### .render(entity, [context], [opts])
#### .assets()

## Documentation Source API

#### .render(entity, [context])
