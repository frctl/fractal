# Glossary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Collections](#collections)
- [Commands](#commands)
- [Components](#components)
- [Sub-components](#sub-components)
- [Documentation](#documentation)
- [Plugins](#plugins)
- [Themes](#themes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Collections

Collections are just groups of related components, pages or assets. If you put a set of components or pages into a folder, you are creating a collection. Component and page collections can also have configuration data associated with them, including data that can [cascade down to the items within them](/docs/configuration-files.md#configuration-inheritance).

Fractal places no limitation on how deeply you can nest component and page collections and sub-collections, or what they should be called or how they should be organised.

### Commands

The primary way to interact with Fractal is via the CLI (Command Line Interface). For example, running the command `fractal start` from your terminal will start the web UI preview server for the current project.

It's easy to create your own commands to run any custom tasks you might need.

### Components

Components (sometimes referred to as 'patterns' or 'materials' by other tools) are the main building blocks of the system. You can define components using a template language of your choosing, supply preview ([context](/docs/components/context.md)) data to render them with when not in a 'live' environment, and much more.

### Sub-components

[Sub-components](/docs/components/sub-components.md) are components that are included within other components, typically using whatever partial/include syntax is supported by the template engine that the project is using.

### Documentation

Documentation pages are, at their simplest, just markdown documents that can get converted into HTML documentation. However they can also be rendered using a template language of your choosing, and by supplying them with component data it is possible to build complex, dynamic documentation pages and styleguides that are aware of the context of the project in which they live.

### Plugins

Plugins are tools that extend the core functionality of Fractal to do interesting things, like generate a web preview, provide a JSON API for your components or build 'living' prototypes based directly on your components.

### Themes

The web UI plugin provides support for creating your own themes, which means you can completely customise the look and functionality of the generated preview site to fit your needs. Because these are created as standalone entities, once you have created a theme (either from scratch or by forking an existing one) you can use it in multiple projects as a dependency.
