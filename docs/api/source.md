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
    - [.renderString(str, [context])](#renderstringstr-context)
    - [.resolve(context)](#resolvecontext)
    - [.title](#title)
    - [.label](#label)
- [Component Source API](#component-source-api)
    - [.render(component, [context], [opts])](#rendercomponent-context-opts)
    - [.assets()](#assets)
- [Documentation Source API](#documentation-source-api)
    - [.render(page, [context])](#renderpage-context)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Source API

#### .renderString(str, [context])

* `str` - *String*
* `context` - *Object* [optional]

Render a string using the [template engine](/docs/engines/overview.md) that has has been configured for the source. Returns a **Promise**.

```js
const componentSource = fractal.components;
componentSource.renderString('<p>this is a {{ type }} string</p>', {
    type: 'template'
}).then(function(html){
    console.log(html);
});
```

#### .resolve(context)

* `context` - *Object*

Takes a object of [context data](/docs/components/context.md) and resolves any `@handle` references to other entities in the Source. Returns a **Promise**.

```js
const componentSource = fractal.components;
const context = {
    title: 'My Component',
    items: '@list.items'
};
componentSource.resolve(context).then(function(resolvedContext){
    console.log(resolvedContext);
    // Outputs:
    // {
    //   title: 'My Component',
    //   items: ['one', 'two', 'three']
    // }
});
```

#### .title

The title of the Source (i.e. `Components`, `Documentation`)

#### .label

The label of the Source (i.e. `components`, `docs`). Used for navigation items referencing the Source.

## Component Source API

When you access the `.components` property on the [main fractal object](/docs/api/fractal.md), you get a `ComponentSource` object, which is a subclass of the Source class. As well as the above API, `ComponentSource` objects additionally expose the following additional methods:

#### .render(component, [context], [opts])

* `component` - *Entity | String*
* `context` - *Object* [optional]
* `opts` - *Object* [optional]

Render a component using the [template engine](/docs/engines/overview.md) that has has been configured for the source.

The `component` argument can be either a [Component Entity](/docs/api/entity.md), a string reference to a component using the [`@handle` syntax](/docs/components/overview.md#referencing-components---@handle-syntax) or even a path to a file on the filesystem (which can be outside of the component source directory).

Note that if you are rendering a non-component template (by passing in a direct template path) you can still use `@handle` style partial includes and will still have access to any helpers/filters/extensions that you may have added to the template engine you are using.

The `context` argument is an object of data to be passed to the template renderer when rendering the entity/file. If no context argument is included (or it is `falsey`) then the context data defined in that component's configuration file will be used to render the component.

Returns a **Promise**.

```js
const componentSource = fractal.components;

componentSource.render('@button', {
    buttonText: 'This is my Button'
}).then(function(html){
    console.log(html);
});

const banner = fractal.components.find('@banner');
const opts = {
    useLayout: true // include the preview layout wrapper when rendering
};
componentSource.render(banner, {
    title: 'This is a Banner!',
    type: 'important'
}, opts).then(function(html){
    console.log(html);
});

componentSource.render('path/to/a/template.hbs', {
    title: 'A Handlebars template'
}).then(function(html){
    console.log(html);
});

```

#### .assets()

Returns a [Collection object](/docs/api/collection.md) containing [Entity objects](/docs/api/entity.md) representing each of the assets in the Component Source directory.

## Documentation Source API

When you access the `.docs` property on the [main fractal object](/docs/api/fractal.md), you get a `DocsSource` object, which is a subclass of the Source class. As well as the above API, `DocsSource` objects additionally expose the following additional methods:

#### .render(page, [context])

* `component` - *Entity | String*
* `context` - *Object* [optional]

Render a documentation page using the [template engine](/docs/engines/overview.md) that has has been configured for the source.
