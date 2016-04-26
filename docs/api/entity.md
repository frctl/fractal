# API - Entity

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Common API](#common-api)
    - [.toJSON()](#tojson)
    - [.id](#id)
    - [.name](#name)
    - [.type](#type)
    - [.handle](#handle)
    - [.order](#order)
    - [.isHidden](#ishidden)
- [Component entities](#component-entities)
    - [.assets()](#assets)
    - [.variants()](#variants)
    - [.hasTag(tag)](#hastagtag)
    - [.notes](#notes)
    - [.lang](#lang)
    - [.editorMode](#editormode)
    - [.editorScope](#editorscope)
    - [.viewPath](#viewpath)
- [Variant entities API](#variant-entities-api)
    - [.alias](#alias)
    - [.siblings](#siblings)
- [Page entities API](#page-entities-api)
    - [.getContent()](#getcontent)
- [Asset entities API](#asset-entities-api)
    - [.path](#path)
    - [.base](#base)
    - [.ext](#ext)
    - [.lang](#lang-1)
    - [.editorMode](#editormode-1)
    - [.editorScope](#editorscope-1)
    - [.githubColor](#githubcolor)
    - [.isBinary](#isbinary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Entity object represent _things_  in your Fractal project. Fractal has four different types of entity (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

## Common API

#### .toJSON()

#### .id
#### .name
#### .type
#### .handle
#### .order
#### .isHidden

## Component entities

#### .assets()
#### .variants()
#### .hasTag(tag)

#### .notes
#### .lang
#### .editorMode
#### .editorScope
#### .viewPath

## Variant entities API

#### .alias
#### .siblings

## Page entities API

#### .getContent()

#### .lang
#### .viewPath
#### .isIndex
#### .content

## Asset entities API

#### .path
#### .base
#### .ext
#### .lang
#### .editorMode
#### .editorScope
#### .githubColor
#### .isBinary
