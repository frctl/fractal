# Components, variants & scenarios

Fractal v2 refines the system of components and variants found in v1 and adds an extra concept, known as 'scenarios'.

## Components

Components are the core entities within your library. Each component represents a 'thing' in the system - for example a button, a card or a list of search results.

Components typically consist of some markup, a set of related assets/files and some configuration data, amongst other things.

### Component format

Each component must be a directory with a filename that begins with an '@' symbol.

Fractal uses this naming convention to differentiate components from 'regular' directories that are used for organisation purposes.

> Single-file components are no longer supported in Fractal v2.

Some of the files within a component have special meaning to Fractal and must be named and formatted appropriately. The most notable ones are:

* `config.js` - The configuration file
* `view.html` - The view template (actual file extension is template-engine dependent)

Any other files you choose to include within your component can be named whatever you like.

A simple example component could look something like this:

```
└── @my-component
    ├── styles.css
    ├── config.js
    └── view.html
```

## Variants

Each component can have a it's own set of variants.

Creating variants helps you explicitly capture the different variations in the way a single component can be implemented or the different states it can have.

> Variants often map well to concepts such as 'modifiers' in BEM.

Variants are useful for preventing code duplication across a set of very similar 'things' in the system. For example, instead of having to create `primary-button` and `secondary-button` components, you could create a `button` component with `primary` and `secondary` variants. Both variants are likely to share most of the same markup and styling; the difference between them may be expressed only in a different 'modifier' class added to each one. These are well suited to be implemented as variants of a single component, rather than as two separate components.

### Defining variants

Variants are defined as an array of objects within the component configuration file, under the `variants` key.

```js
// @button/config.js
module.exports = {
  variants: [
    {
      id: 'primary'
    },
    {
      id: 'secondary'
    }
  ]
};
```

Each variant should have an `id` property that is unique within it's set of sibling variants. This is what is used to reference the variant elsewhere in the system.

You can then set properties on the variant objects to describe the ways in which they vary from each other.

These properties can  be referenced in the [template pre-processing step](/docs/view-templates.md#view-pre-processing-for-variants) to generate unique, per-variant view templates which encapsulate the differences between each possible variation of the component.

For example, we might define an array of class names on each variant, like so:

```js
// @button/config.js
module.exports = {
  variants: [
    {
      id: 'primary',
      classNames: ['button--primary']
    },
    {
      id: 'secondary',
      classNames: ['button--secondary']
    }
  ]
};
```

And then use those in the view template via the [dynamic attribute syntax](/docs/view-templates.md#dynamic-attributes) to generate bepoke templates for each variant:

```html
<!-- view.html -->
<button :class="classNames">{{ text }}</button>

<!-- template for primary variant -->
<button class="button--primary">{{ text }}</button>

<!-- template for secondary variant -->
<button class="button--secondary">{{ text }}</button>
```

### Changes to variants in Fractal v2

In Fractal v1.x each variant defined a single set of data that could be used to render the view template to generate an example of a rendered variant. For example:

```js
// v1 style variant object
{
  id: 'button-primary-french',
  context: {
    classNames: ['primary'],
    text: "c'est un bouton"
  }
}
```

The problem with this approach was that it made no distinction between variant _properties_ and _context_ data.

#### Variant properties

Variant _properties_ are those things that describe the ways in which variants differ from one another - for example a 'modifier' class name, or whether or not the variant should make use of an icon.

There is a **finite** set of these properties that describe all possible (allowed) variations of the component.

> In the v1 example above, `context.classNames` is actually a property of the variant, rather than content data used to render an example of the component.

Variant properties can be thought of as **compile-time properties** - we know the full set of these before any variant is rendered.

#### Context data

Context data, on the other hand, is data that can be used to fill content placeholders in the view template when the it is rendered. An example would be the text content of a form field label, or the value of the `src` attribute of an image within an article.

The number of possible sets of context data is effectively **infinte**. Each particular placeholder might require content of a specific type or length, but this data is really only filling the same bucket with different values and so doesn't represent true variations in the ways that a component can be displayed.

> In the v1 example above, `context.text` is really example content - it's value could be anything and the value defined in the variant here is just one example of what it could be.

Context data can be thought of as runtime data - it can take an infinite set of possible values.

#### The v2 approach

In Fractal v2, a variant can now directly specify it's properties on the variant object itself. These properties can then be used in a template pre-processing step to create unique, per-variant view templates.

Variants can also additionally supply a set of 'scenarios', each of which defines an example set of context data that can be used to render the variant view templates to generate some example previews for the variant.

The example above reworked for v2 might look like this:

```js
// v2 style variant object
{
  id: 'button-primary',
  classNames: ['primary'],
  scenarios: [
    {
      id: 'french',
      context: {
        text: "c'est un bouton"
      }
    }
  ]
}
```

See the documentation on [view pre-processing for variants](/docs/view-templates.md#view-pre-processing-for-variants) for more information on using variant properties in view templates.

## Scenarios

Scenarios, as touched on above, simply represent sets of context data that can be used to render examples of each variant.

Scenarios are used by tools such as the component inspector and can also be used when generating documentation via the Pages static site builder extension.

Scenarios are defined on a per-variant basis within the variant configuration object as follows:

```js
// @button/config.js
module.exports = {
  variants: [
    {
      id: 'primary',
      // ...
      scenarios: [
        {
          id: 'english',
          context: {
            text: 'This is a button'
          }
        },
        {
          id: 'french',
          context: {
            text: "c'est un bouton"
          }
        }
      ]
    },
    // ...
  ]
};
```
