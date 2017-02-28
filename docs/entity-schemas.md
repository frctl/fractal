# Entity data schemas

All components, collections and files in the component library are represented as plain JavaScript objects. These objects are what is returned when calling [Entity API](/docs/entity-apis.md) methods such as `components.getAll()`.

An example of the default properties available for each type of object is presented below.

> Note that Fractal parser plugins can mutate these objects to add custom properties or change existing values.

## Component

```js
{
  name: "button",
  label: "Button", // Title-case version of the component name
  role: "component",
  path: "/path/to/@button",
  config: {
    // raw data from config file, if present
  },
  files: [
    // array of files contained within this component
  ],
  dir: {
    // directory that this component was created from
  }
}
```

## Collection

```js
{
  name: "units",
  label: "Units", // Title-case version of the collection name
  role: "collection",
  path: "/path/to",
  config: {
    // raw data from config file, if present
  },
  files: [
    // array of files contained within this collection
  ],
  dir: {
    // directory that this collection was created from
  }
}
```

## File

Files are represented by [File objects](https://github.com/frctl/file). Some File properties are dynamically generated from the file's `path` and so are read-only.

```js
{
  name: "view",
  cwd: "/path/to/project",
  base: "/path/to/project/files",
  path: "/path/to/project/files/units/@button/view.njk",
  role: "resource", // resource / config / readme / ...
  scope: "component", // component / collection / global
  contents: '<Buffer ....>', // String buffer containing file contents
  relative: "units/@button/view.njk", // relative to the `base` property [READ-ONLY]
  dirname: "/path/to/project/files/units/@button", // [READ-ONLY]
  ext: ".njk", // [READ-ONLY]
  basename: "view.njk", // [READ-ONLY]
  stem: "view", // [READ-ONLY],
  isFile: true,
  isDirectory: false,
  mtime: {
    // Date object instance
  }
}
```
