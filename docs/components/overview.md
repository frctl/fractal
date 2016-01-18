# Components

'Component' is a generic term used by Fractal to describe individual pieces of your website's UI.

**In Fractal everything is a considered a component**. A component could be a tiny chunk of HTML for a text input, it could be a whole page or it could be something in between.

Unlike some other systems, Fractal does not enforce any specific nomenclature or taxonomy on your components - you are free to organise and name them as you wish.

## What defines a component?

In order for Fractal to recognise your components, they must:

1. Live within the component directory that you specified in your [fractal.js configuration file](/docs/configuration.md#components-directory-path).
2. Have a 'view' file, containing the markup required to rendering your component. By default, **the name of this view file will be the 'handle'** (name) of your component.

Optionally, components can also:

* Be organised into directories and sub-directories as required.
* Include as many related files (such as JavaScript, CSS, tests and READMEs) as you like.
* Have one or more 'variants', useful for when you have one 'parent' component with a number of very similar variations.
* Have per-component configuration and preview data.

The markup for a component can either be written as 'vanilla' HTML or using a template language of your choosing. By default, Fractal expects that you are using [Handlebars](handlebarsjs.com) templates for your component view files, and that these files will have a `.hbs` file extension.

See the [template engine documentation](/docs/components/template-engines.md) for more details on how to configure and use different template engines with Fractal.

## Getting started

* [Creating Components - A Guide](/docs/components/creating-components.md)
* [Template Engines](/docs/components/template-engines.md)
