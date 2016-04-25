# API - Entity

<!-- START doctoc -->
<!-- END doctoc -->

Entity object represent _things_  in your Fractal project. Fractal has four different types of entity (components, variants, pages and assets), all of which share a common set of methods and properties. Each specific type then additionally exposes a number of type-specific methods.

## Common methods and properties

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

## Variant entities


## Page entities

#### .getContent()

#### .lang
#### .viewPath
#### .isIndex
#### .content

## Asset entities

#### .path
#### .base
#### .ext
#### .lang
#### .editorMode
#### .editorScope
#### .githubColor
#### .isBinary
