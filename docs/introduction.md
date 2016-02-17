# Introduction

Component (or pattern) libraries are a way of designing and building websites in a modular fashion, breaking up the UI into small, reusable chunks that can then later be assembled in a variety of ways to build anything from larger components right up to whole pages.

Fractal helps you **assemble**, **preview** and **document** website component libraries, and then **integrate** them into your web projects.

## Why Fractal?

Existing tools to help you build these component libraries often force you to use a particular template language, a specific build tool or a pre-determined way to organise the individual elements within your library. They generate a web preview to allow you to browse your rendered components, but generally aren't able to help much when it comes to integrating your component library into your build process or live site.

**Fractal is different.**

Fractal lets you create a component library without any restriction on which template language to use. You can use whatever build tool you are comfortable with (or none at all!) and it lets you organise your components in whatever way best matches the needs of your project.

It is built using an **extendable, plugin-based architecture**. The core component and documentation parser is available to build upon, helping you to better integrate your component library into your build system and even your production site.

The core web UI plugin provides a **web-based component library browser** UI, either running as a local web server or as a static HTML export. A **powerful theme API** means you can create your own component library 'skins' from scratch or customise the default theme to your liking.

Fractal can be used both as a command line tool and as a NPM module dependency, letting you access your component library data and files seamlessly in your build pipeline or production site whilst simultaneously providing a separate preview UI and tools for authoring and maintaining the components themselves.
