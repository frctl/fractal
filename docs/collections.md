# Collections

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Configuration](#configuration)
  - [Configuration Properties](#configuration-properties)
  - [label](#label)
  - [title](#title)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Collections are just groups of related components or documentation pages. When you create a directory that contains one or more components or pages inside it, you have created a collection.

However beyond just grouping items, collections are useful because they can have their own [configuration files](/docs/configuration-files.md) within which you can specify properties (such as [status](/docs/components/statuses.md) or [preview layout](/docs/components/layouts.md) for components) that will then be **applied to all child items** within that collection, saving you from having to specify them on each item. Of course, individual components, pages (or indeed sub-collections) can still [override these defaults](/docs/configuration-files.md#configuration-inheritance) on a case-by-case basis if needed.

## Configuration

A collection configuration file follows the same rules as component and documentation page configuration files. It must reside in the collection directory and have the same name as the directory itself, followed by `.config.{js|json|yml}`, depending on the format.

So a component collection called 'layouts' could have a YAML configuration file called `layouts.config.yml`:

```
├── components
│   ├── layouts
│   │   ├── layouts.config.yml
│   │   ├── full-screen.hbs
│   │   └── sidebar.hbs
```

A sample collection configuration file contents might look like this:

```yaml
title: "Website Layouts"
status: "ready"
context:
    title: "My Website"
```

### Configuration Properties

The majority of properties set in a collection configuration file apply not to the collection itself, but rather cascade down to the items within it. The exception to this is the `label` and `title` properties.

For details on the available cascading configuration properties that will apply to  child items, see the relevant configuration reference sections:

* [Component configuration](/docs/components/configuration.md)
* [Docs configuration](/docs/documentation/configuration.md)

### label

The label is typically displayed in any UI navigation items that refer to the collection. Defaults to a title-cased version of the collection directory name if not specified.

```yaml
label: 'Website Layouts'
```

### title

The string that is used when a UI needs a title for the collection. Defaults to the value of `label` if not set.

```yaml
title: 'My Favourite Website Layouts'
```