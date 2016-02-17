# Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you **assemble**, **preview** and **document** website component libraries, and then **integrate** them into your web projects and build processes using custom commands and plugins.

You can think of Fractal as a tool that sits halfway between a component library UI generator like [Fabricator](https://fbrctr.github.io) or [PatternLab](http://patternlab.io), and a build tool like [Metalsmith](http://metalsmith.io) or [Assemble](https://github.com/assemble/assemble/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Why Fractal?](#why-fractal)
- [Core concepts and terminology](#core-concepts-and-terminology)
  - [Components](#components)
  - [Documentation](#documentation)
  - [Collections](#collections)
  - [Commands](#commands)
  - [Plugins](#plugins)
  - [Themes](#themes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why Fractal?

Existing tools to help you build these component libraries often force you to use a particular template language, a specific build tool or a pre-determined way to organise the individual elements within your library. They generate a web preview to allow you to browse your rendered components, but generally aren't able to help much when it comes to integrating your component library into your build process or live site.

**Fractal is different.**

Fractal lets you create a component library without any restriction on which template language to use. You can use whatever build tool you are comfortable with (or none at all!) and it lets you organise your components in whatever way best matches the needs of your project.

It is built using an **extendable, plugin-based architecture**. The core component and documentation parser is available to build upon, helping you to better integrate your component library into your build system and even your production site.

The core web UI plugin provides a **web-based component library browser** UI, either running as a local web server or as a static HTML export. A **powerful theme API** means you can create your own component library 'skins' from scratch or customise the default theme to your liking.

Fractal can be used both as a command line tool and as a NPM module dependency in your projects.

## Core concepts and terminology

Fractal parses a directory structure of folders, view (template) files, static assets and configuration data, and applies a set of rules to collect them into meaningful [components](/docs/components/overview.md).

It can also optionally parse a directory of templated documentation pages and configuration data to generate project documentation.

[Plugins](/docs/plugins/overview.md) and [custom commands](/docs/commands.md) can then be used to run tasks or to provide functionality that builds upon the data that is generated from parsing the filesystem. Fractal can also optionally 'watch' the file system and re-build the data trees when changes are made.

### Components

Components are the main building blocks of the system. You can define components using a template language of your choosing, supply preview ([context](/docs/components/context.md)) data to render them with when not in a 'live' environment, and much more.

### Documentation

Documentation pages are, at their simplest, just markdown documents that can get converted into HTML documentation. However they can also be rendered using a template language of your choosing, and by supplying them with component data it is possible to build complex, dynamic documentation pages and styleguides that are aware of the context of the project in which they live.

### Collections

Collections are just groups of related components or pages; if you put a set of components or pages into a folder, you are creating a collection. However collections can also have configuration data associated with them, including data that can [cascade down to the items within them](/docs/configuration-files.md#configuration-inheritance). 

Fractal places no limitation on how deeply you can nest collections and sub-collections, or what they should be called or how they should be organised.

### Commands

The primary way to interact with Fractal is via the CLI. For example, running the command `fractal start` from your terminal will start the web UI preview server for the current project.

It's easy to create your own commands to run any custom tasks you might need.

### Plugins

Plugins are tools that extend the core functionality of Fractal to do interesting things, like generate a web preview, provide a JSON API for your components or build 'living' prototypes based directly on your components.

### Themes

The web UI plugin provides support for creating your own themes, which means you can completely customise the look and functionality of the generated preview site to fit your needs. Because these are created as standalone entities, once you have created a theme (either from scratch or by forking an existing one) you can use it in multiple projects as a dependency.


