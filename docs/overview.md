<!-- DOCTOC SKIP -->

# Overview

Fractal is a tool to help you build, document and integrate component libraries into web projects. It's focus is on providing a flexible tool that can be used for both component library development _and_ for helping use those components in your site, application or build pipelines. Additionally, Fractal can help you generate living documentation for you component library to ensure that your components and documentation never need to go out of sync.

# Under the hood

Fractal takes a static directory structure of folders, view (template) files, assets and configuration data, and applies a set of rules to create a [component](/docs/components/overview.md) tree.

It can also (optionally) look at a directory of documentation pages and configuration data and generate a [documentation](/docs/documentation/overview.md) tree from it.

[Plugins](/docs/plugins/overview.md) and [commands](/docs/overview.md) can then be used to run tasks or to provide functionality that builds upon the data that is generated from parsing the filesystem.

Fractal can also optionally 'watch' the file system and re-build the data trees when changes are made.

## An example

To  see how this works in practice, let's look at an example file structure for a small Fractal project.

```
├── components
│   ├── units
│   │   ├── blockquote.hbs
│   │   ├── heading.hbs
│   │   └── prose.hbs
│   ├── patterns
│   │   ├── blog-post
│   │   │   ├── blog-post.config.yml
│   │   │   └── blog-post.hbs
│   │   ├── navigation.hbs
│   │   └── patterns.config.yml
│   └── _preview.hbs
├── docs
│   ├── index.md
│   ├── syntax.config.yml
│   └── syntax.md
├── public
│   ├── main.css
│   └── main.js
├── package.json
└── fractal.js
```

### Components

Fractal will first look at the [component directory](/docs/project-settings.md#directory-path) to see what components are defined. In the case of the example above, Fractal will 'see' the following information:

* A component directory with two *collections* in it - One called *Units* and one called *Patterns*.
* The *Units* collection has three *components* in it - *Blockquote*, *Heading* and *Prose*.
* The *Patterns* collection has a configuration file `patterns.config.yml` which provides configuration data for the collection, some of which may be inherited by the components within that collection.
* The *Patterns* collection has two components in it - *Blog Post* and *Navigation*.
* The *Blog Post* pattern has a configuration file associated with it,  `blog-post.config.yml`.
* The component directory also contains one other component in it, `_preview.hbs` which is not in a collection and has a file name preceded by an underscore, which means it is 'hidden' from any UI.

Fractal can render 'previews' of the components using the template files (in this example, the Handlebars files with `.hbs` extensions) and any preview [context data](/docs/components/context.md) that is found in the configuration files. It will optionally also wrap them in a [preview layout](/docs/components/layouts.md), if specified, ready for display.

All this information, together with the information from the configuration files, will generate the **component tree**. This in turn can then be used in places such as the [web UI](/docs/web/overview.md) to display a list of components and render them accordingly.

It's worth noting that this is a very simple example, and there is a lot more you can do with your components - see the [components documentation](/docs/components/overview.md) for full details.

### Documentation

Fractal will then look at the [documentation directory](/docs/project-settings.md#directory-path). In this example there are just two pages, and no collections. There is an index page (which will be given the title 'Overview' [by default](/docs/project-settings.md#index-label)) and a page called *Syntax*.

The *Syntax* page has a configuration file associated with it. Separate config files for pages are not normally needed, as they can contain **YAML front matter** blocks with configuration items in them. However for extensive configuration files you may want to break it out into a separate file, as is the case here.

Fractal will render the pages using the [specified template engine](/docs/project-settings.md#template-engine-1) and then parse them with a markdown processor to generate the final output.

Fractal will compile this information into a **documentation tree**, which again can be used by commands and plugins to do interesting things.

### Public directory

There is a directory called `public` in the example above. While Fractal is not particularly concerned about the contents of any directories apart from the component and documentation directories, if you are using the web preview UI server then you can specify a directory to act as your [static assets directory](/docs/project-settings.md#static-assets-path). Any files within this directory will then be accessible via a URL and so can be included into in your [preview layouts](/docs/components/layouts.md) or other components.
