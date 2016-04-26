# API - Entity

Entity object represent _things_  in your Fractal project. Fractal has four different types of entity (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

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
#### .name
#### .type
#### .handle
#### .order
#### .isHidden

### Components

#### .assets()
#### .variants()
#### .hasTag(tag)

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
