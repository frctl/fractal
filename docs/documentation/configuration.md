# Documentation Configuration Reference

Documentation pages and doc [collections](/docs/collections.md) can have their own (optional) configuration files associated with them. Alternatively, documentation pages can also specify their configuration in a [YAML front-matter section](/docs/documentation/overview.md#yaml-front-matter) of the page itself. See the [documentation overview](/docs/documentation/overview.md) for more information.

If you are using standalone configuration files, you should read the [configuration file documentation](/docs/configuration-files.md) to learn more about how configuration files need to be named and formatted.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Page properties](#page-properties)
  - [context](#context)
  - [hidden](#hidden)
  - [label](#label)
  - [order](#order)
  - [title](#title)
- [Collection properties](#collection-properties)
  - [context](#context-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Page properties

These are properties that can be specified in an individual page's YAML front matter section or in a configuration file for that page.

### context

Data to pass to the page when rendering it.

`context` is an **inheritable property**. Any context data set on the page will be *merged* with any context data set upstream in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance).

```yaml
context:
  colors: ['red','pink','blue']
```

### hidden

Specifies whether the page is hidden (i.e. does not show up in listings or navigation) or not. Overrides the inferred value from an underscore-prefixed file name if set.

```yaml
hidden: true
```

### label

The label is typically displayed in any UI navigation items that refer to the page. Defaults to a title-cased version of the page file name if not specified.

```yaml
label: 'Naming Conventions'
```

### order

An integer order value, used when sorting pages. Overrides any order value set as a property of the filename if set.

```yaml
order: 4
```

### title

The title of a page. Defaults to the same as the `label` if not specified.

```yaml
title: 'Amazing Mega Buttons'
```

## Collection properties

Collections can specify properties that should be applied to all child pages of that collection via [configuration inheritance](/docs/configuration-files.md#configuration-inheritance). See the [documentation on collections](/docs/collections.md) for more details on how to work with collections, and for details on available non-inheritable properties like `label` and `title`.

### context

Context data to be made available to (and merged into) child pages in the collection.

```yaml
context:
  colors: ['red','pink','blue']
```
