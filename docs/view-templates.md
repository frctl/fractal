# View templates

Component view templates are handled quite differently in Fractal v2. Some of the main features of the v2 template system include:

* Support for multiple template engines
* Per-variant template pre-processing
* Template mutation via plugins
* Simplified render engine adapter format

Unlike in v1, the rendering of templates is now split over two steps:

1. **Compile-time** pre-processing of templates with access to the `variant.props` object
2. **Run-time** rendering of the template with the appropriate template engine (such as Nujucks, Handlebars etc) with access to the supplied context data only.

## View engine adapters

View engine adapters can be added by installing into the project via NPM and then adding to the `app.engines` array in the main `fractal.config.js` project configuration file.

```js
// fractal.config.js
module.exports = {
  app: {
    // ... other config here
    engines: [
      '@frctl/fractal-engine-nunjucks'
    ]
  }
}
```

## Adding views to components

Each component can have one or more view templates, one per template engine that you wish to support.

Each view template should be called `view.{ext}`, where `{ext}` is the file extension for the appropriate template engine.

An example component that has Handlebars and Nunjucks views might therefore look like this:

```
└── @my-component
    ├── config.js
    ├── view.njk
    └── view.hbs
```

### An example view template

An example Nunjucks template might look like this:

```html
<button class="button" :class="classNames">
  <span class="button__text">{{ text }}</span>
</button>
```

Some points to note:

* `:class="classNames"` is a pre-processing directive - see below for details
* `{{ text }}` is a regular Nunjucks variable. All Nunjucks template syntax will be processed at render-time using the supplied context data.

## View pre-processing for variants

In Fractal v2, views are much more tightly coupled to the concept of **variants**.

> As in v1, each component is actually a collection of variants. Even if you do not define any variants for a component, Fractal will create a 'default' variant behind the scenes.

Each variant gets its own copy of each of the view templates added to the component. Rather than storing the contents of each of these components as a string, they are stored as a virtual-dom object (in the [HAST](https://github.com/syntax-tree/hast) format).

This means that the contents of each template can be manipulated by plugins on a per-variant basis, prior to any actual run-time rendering of the template against a set of context data.

As well opening this process up to plugins, the core Fractal engine itself provides a small set of pre-processing directives that are run on each variant template during the parsing process.

### Core pre-processing directives

Fractal specifies a small set of view pre-processing directives that can be used in templates. These use a concise syntax for applying classes/attributes, importing HTML from other components/variants and conditionally adding or removing markup.

All of these directives can be used by any view templates, regardless of the target engine that will be used to perform the final run-time rendering of the template.

Pre-processing directives have access to the set of properties defined on the `.props` object for each variant.

#### Dynamic attributes

Often a variant will be made distinct from the 'default' component by a one or more additional class names. In BEM these additional class names are often described as _modifiers_ but many other systems share similar concepts.

Fractal's attribute pre-processing directive evaluates variant properties to dynamically generate attribute values. This can be used for adding class names, generating `data-*` attribute values or even to apply boolean HTML element properties such as `disabled` or `checked`.

Dynamic attributes are distinguished from 'regular' HTML attributes by a name that begin with a semi-colon. For example:

```html
<button id="my-button" :class="classNames"></button>
```

In this case, `id` is a regular, static HTML attribute and will not be affected by the pre-processing step.

However the `:class` attribute is a **dynamic attribute**, and the contents of this will be evaluated against the properties of the variant it belongs to.

Given the following variant definition:

```js
{
  id: 'primary-button',
  props: {
    classNames: ['primary', 'action']
  }
}
```

After the preprocessing step the above template will be transformed to look like this:

```html
<button id="my-button" class="primary action"></button>
```

> Note that the `classNames` property could be called anything you like - classNames is just an example! The property name in the template just needs to match the property name in the `variant.props` object.

The value of a dynamic attribute is evaluated as JavaScript in a sandbox environment that only has access to the variant object itself. This means that you can use any javascript expressions in attributes too, if you like:

```html
<button :class="isLarge ? 'large' : 'small'"></button>
```

Results from the attribute evaluation are converted into the appropriate format for the property type.

For instance an array of class names is converted into a space-separated string value (although you can also return a string directly, too) and boolean properties such as `disabled` are added or removed depending on the boolean return value of the attribute evaluation. For example:

```html
<!-- input template -->
<button :disabled="isDisabled"></button>

<!-- variant.props.isDisabled === true -->
<button disabled></button>

<!-- variant.props.isDisabled === false -->
<button></button>
```

#### Conditional elements

Elements within a template can also be conditionally applied using the `@if` directive:

```html
<a href="#" @if="next">Next</a>
```

Similar to the dynamic attributes, the value of the `@if` statement is determined by evaluating the statement against the properties of the variant.

If the end result of the evaluation is truthy, the element is retained in the template:

```html
<!-- variant.props.next == true -->
<a href="#">Next</a>
```

Otherwise the element (and any sub-elements in the tree) is removed entirely from the template.

> **WIP** - the conditional statements directives will be expanded to handle `@else` and `@else-if` statements before the beta period is over.

#### Including sub-templates

You can include another variant's template within the parent template using the `include` directive.

This takes the form of a custom tag with a `component` attribute that references the `component:variant` IDs for the variant that you wish to include. For example:

```html
<include component="button:primary"></include>
```

The above would be replaced with the contents of the template for the `primary` variant of the `button` component.

> Note that when including templates, no scoping of the child template run-time variables takes place, so that must be handled in the syntax of the template engine responsible for the final rendering.
