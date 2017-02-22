# Data schema

All components, collections and files in the component library are represented as plain JavaScript objects. These objects are what is returned when calling [library API](/docs/library.md) methods such as `.getComponents()`.

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
  main: {
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
  main: {
    // directory that this collection was created from
  }
}
```

## File

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
