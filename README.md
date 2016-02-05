# Fractal

**A flexible, extendable tool for creating and documenting website component libraries.**



Core features include:

* **Template-language-agnostic components** with support for associated assets and variants.
* **Data-driven component previews** - fetch content from APIs, generate it with libraries like [Faker](https://github.com/marak/Faker.js/) or provide it yourself.
* **Sandboxed rendering** - all components are rendered in an iframe within an optional preview layout. No potential 'style bleed' from the Fractal UI into your templates!
* **Markdown-powered pages** and documentation for components.
* **In-built server for rapid development**, and **static-site export** functionality for easy hosting.
* Configurable **component statuses** to aid implementation workflows.
* **Freedom to organise your components** to fit your own design system.

> _**Important:** Fractal is currently considered to be in an early-alpha stage and not ready for production use. Until it reaches a 1.0 release there may be breaking changes in point-releases, as well as out-of date or incorrect documentation. Use at your own risk!_

[![Build Status](https://img.shields.io/travis/frctl/fractal.svg?style=flat)](https://travis-ci.org/frctl/fractal)

## Table of Contents

* [Quick start guide](/docs/quick-start.md)
* [Configuration](/docs/configuration.md)
* [Components](/docs/components/overview.md)
* [More coming soon]

## Q&A

#### Why use Fractal?

Fractal is in some ways quite similar to existing tools like [Pattern Lab](http://patternlab.io/) and [Fabricator](http://fbrctr.github.io/). These are great projects, however by-and-large they are fairly opinionated in their implementations. For example, they might expect you to adhere to a pre-defined organisational model for your components/patterns or to require a specific template language or front end build system.

In contrast, Fractal has been designed from the ground-up to be as flexible and un-opinionated as possible. Write your component views in the same templating language that your production application uses, use whatever front end build system you are most comfortable with, and organise your components in whatever way best suits your own design system or way of thinking. It's up to you!

#### Un-opinionated? Really?

Being un-opinionated is one of the primary design principles driving Fractal's development. However it's actually pretty hard to create something that is _completely_ un-opinionated in it's implementation.

That being said, the goal is to make Fractal as flexible and configurable as possible, especially when it comes to authoring components. If you feel there are any areas that could be improved then please do open an issue or a pull request and let us know.

## Requirements

Fractal requires [Node.js](https://nodejs.org) v4.0+ to run.

## Credits

Fractal is developed and maintained by [Mark Perkins](http://github.com/allmarkedup) and the dev team at [Clearleft](http://clearleft.com).
