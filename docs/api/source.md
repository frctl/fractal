# API - Source Objects

Source objects are a special sub-class of [Collection objects](/docs/api/collection.md). Like collections, they represent a set of entities and/or sub-collections. *Unlike* collections however, they also additionally provide source-type specific methods for working with the entities they contain, as well as holding information about the source (directory) itself.

Fractal exposes two different types source objects - a **component source** and a **docs source**.

All methods and properties that are provided by [Collection objects](/docs/api/collection.md) are also available on source objects, plus the additional methods/properties detailed below.

<!-- START doctoc -->
<!-- END doctoc -->

## Common methods and properties

#### .resolve(context)
#### .renderString(str, [context])

#### .title
#### .label

## Component Source

#### .render(entity, [context], [opts])
#### .assets()

## Documentation Source

#### .render(entity, [context])
