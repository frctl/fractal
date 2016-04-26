# API - Collection Objects

*Collection objects* are immutable objects that contain a set of items. The items can either be entities such as components, or collections themselves.

Collection objects are also ES6 iterators that can be used in statements such as `for...of` loops.

Fractal has four different types of collections (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Collection API](#collection-api)
    - [.items()](#items)
    - [.first()](#first)
    - [.last()](#last)
    - [.eq(pos)](#eqpos)
    - [.entities()](#entities)
    - [.collections();](#collections)
    - [.find(...args);](#findargs)
    - [.findCollection(...args);](#findcollectionargs)
    - [.flatten();](#flatten)
    - [.flattenDeep();](#flattendeep)
    - [.squash();](#squash)
    - [.filter();](#filter)
    - [.orderBy(...args);](#orderbyargs)
    - [.toArray()](#toarray)
    - [.toJSON()](#tojson)
    - [.parent](#parent)
    - [.size](#size)
    - [.source](#source)
- [Component Collection API](#component-collection-api)
    - [.variants()](#variants)
    - [.components()](#components)
    - [.assets()](#assets)
- [Docs Collection API](#docs-collection-api)
    - [.pages()](#pages)
- [Asset Collection API](#asset-collection-api)
    - [.files()](#files)
    - [.match()](#match)
- [Variant Collection API](#variant-collection-api)
    - [.default()](#default)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Collection API

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

#### .parent

#### .size

#### .source


## Component Collection API

#### .variants()

#### .components()

#### .assets()


## Docs Collection API

#### .pages()

## Asset Collection API

#### .files()

#### .match()


## Variant Collection API

#### .default()
