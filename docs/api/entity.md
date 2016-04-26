# API - Entity

Entity object represent _things_  in your Fractal project. Fractal has four different types of entity (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

```js
'use strict'

const fractal = require('@frctl/fractal');
const componentSource = fractal.components;

const button = componentSource.find('@button'); // a Component entity
const assets = button.assets().first(); // an Asset entity
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [API](#api)
  - [Common](#common)
    - [.id](#id)
    - [.name](#name)
    - [.type](#type)
    - [.handle](#handle)
    - [.order](#order)
    - [.isHidden](#ishidden)
  - [Components](#components)
    - [.assets()](#assets)
    - [.variants()](#variants)
    - [.hasTag(tag)](#hastagtag)
    - [.notes](#notes)
    - [.lang](#lang)
    - [.editorMode](#editormode)
    - [.editorScope](#editorscope)
    - [.viewPath](#viewpath)
  - [Variants](#variants)
    - [.assets()](#assets-1)
    - [.alias](#alias)
    - [.siblings](#siblings)
  - [Pages](#pages)
    - [.getContent()](#getcontent)
  - [Assets](#assets)
    - [.path](#path)
    - [.base](#base)
    - [.ext](#ext)
    - [.lang](#lang-1)
    - [.editorMode](#editormode-1)
    - [.editorScope](#editorscope-1)
    - [.githubColor](#githubcolor)
    - [.isBinary](#isbinary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## API

### Common

#### .id

*String* - The unique ID of the entity.

#### .name

*String* - The 'slugified' name of the entity.

#### .type

*String* - `page` / `asset` / `component` / `variant`

#### .handle

*String* - Generated handle for the entity. Used to reference it in other places using the `@handle` reference syntax.

#### .order

*Integer* - The positional order in which the entity should appear in sorted collections.

#### .isHidden

*Boolean* - Whether or not the entity has been flagged as `hidden`.

### Components

#### .assets()

Returns an [Asset Collection](/docs/api/collection.md) containing assets related to the component.

#### .variants()

Returns an [Variant Collection](/docs/api/collection.md) containing the [component's variants](/docs/components/variants.md).

#### .hasTag(tag)

* `tag` - *String*

#### .tags
#### .notes
#### .lang
#### .editorMode
#### .editorScope
#### .viewPath

### Variants

#### .assets()

#### .alias
#### .siblings

### Pages

#### .getContent()

#### .lang
#### .viewPath
#### .isIndex
#### .content

### Assets

#### .path
#### .base
#### .ext
#### .lang
#### .editorMode
#### .editorScope
#### .githubColor
#### .isBinary
