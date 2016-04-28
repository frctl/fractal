# Component Tips and Tricks

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hiding components](#hiding-components)
- [Ordering components](#ordering-components)
- [Using a README for component notes](#using-a-readme-for-component-notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Hiding components

Components can be hidden from listings and navigation in two ways. You can either specify `hidden: true` in the component's [configuration file](/docs/components/configuration.md) or you can prefix the component's directory (or view file) name with an underscore.

For instance, both of the components in the following example would be hidden from any navigation or listings:

```
├── components
│   ├── _preview.hbs
│   ├── _blockquote
│   │   ├── blockquote.config.yml
│   │   └── blockquote.hbs
```

> Hidden components are still available to be included as partials or used by other components as required.

## Ordering components

A component can be given an order by which to sort it with regards to it's siblings. This can be done by using the `order` property in the component's [configuration file](/docs/components/configuration.md), or it can be done by prefixing the component's directory (or view file) name with a **two-digit number** (with leading zero, if required) **followed by a hyphen**. For example:

```
├── components
│   ├── 01-preview.hbs
│   ├── 02-blockquote
│   │   ├── blockquote.config.yml
│   │   └── blockquote.hbs
```

> You can also combine *ordering* and *hiding* by constructing a directory name such as `_01-preview.hbs`.

## Using a README for component notes

If you add a README.md file into a component directory, the contents will be used as the value of the `notes` property for that component (unless the component explicitly specifies a `notes` property value in it's configuration).

> **Note**: Any H1 headings from the file will be stripped from this file before being displayed in any UI. This means you can still have an main heading in your README without duplicate headings showing up in places that use contents of the README, such as in the web UI.

It's worth noting that the content in your components' README files is all rendered using the same process as the rest of your [project documentation](/docs/documentation/overview.md). That means that prior to being run through the Markdown parser, the template are parsed using whichever [template engine](/docs/engines/overview.md) is configured for your documentation pages (Handlebars is the default). 
