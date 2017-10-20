# View templates

Component view templates are handled quite differently in Fractal v2. Some of the main features of the v2 template system include:

* Support for multiple template engines
* Per-variant template pre-processing
* Template mutation via plugins
* Simplified render engine adapter format

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

## View pre-processing for variants

In Fractal v2, views are much more tightly coupled to the concept of **variants**.

> As in v1, each component is actually a collection of variants. Even if you do not define any variants for a component, Fractal will create a 'default' variant behind the scenes.

Each variant gets its own copy of each of the view templates added to the component. Rather than storing the contents of each of these components as a string, they are stored as a virtual-dom object (in the [HAST](https://github.com/syntax-tree/hast) format).

This means that the contents of each template can be manipulated by plugins on a per-variant basis, prior to any actual run-time rendering of the template against a set of context data.

As well opening this process up to plugins, the core Fractal engine itself provides a small set of pre-processing directives that are run on each variant template during the parsing process.

### Core pre-processing directives

Fractal specifies a small set of view pre-processing directives that can be used in templates. These use a concise syntax for applying classes/attributes, importing HTML from other components/variants and conditionally adding or removing markup.

All of these directives can be used by any view templates, regardless of the target engine that will be used to perform the final run-time rendering of the template.

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
  classNames: ['primary', 'action']
}
```

After the preprocessing step the above template will be transformed to look like this:

```html
<button id="my-button" class="primary action"></button>
```

> Note that the `classNames` property could be called anything you like - classNames is just an example! The property name in the template just needs to match the property name in the variant configuration object.

The value of a dynamic attribute is evaluated as JavaScript in a sandbox environment that only has access to the variant object itself. This means that you can use any javascript expressions in attributes too, if you like:

```html
<button :class="isLarge ? 'large' : 'small'"></button>
```

Results from the attribute evaluation are converted into the appropriate format for the property type.

For instance an array of class names is converted into a space-separated string value (although you can also return a string directly, too) and boolean properties such as `disabled` are added or removed depending on the boolean return value of the attribute evaluation. For example:

```html
<!-- input template -->
<button :disabled="isDisabled"></button>

<!-- variant.isDisabled === true -->
<button disabled></button>

<!-- variant.isDisabled === false -->
<button></button>
```

#### Conditional elements

Elements within a template can also be conditionally applied using the `@if` directive:

```html
<a href="#" @if="continue">Next</a>
```

Similar to the dynamic attributes, the value of the `@if` statement is determined by evaluating the statement against the properties of the variant.

If the end result of the evaluation is truthy, the element is retained in the template:

```html
<!-- variant.next == true -->
<a href="#">Next</a>
```

Otherwise the element (and any sub-elements in the tree) is removed entirely from the template.
