# Entity data schemas

All components and files are represented as plain JavaScript objects. These objects are returned from [collection](/docs/collection.md) methods such as `components.getAll()`.

An example of the default properties available for each type of object is presented below.

> Note that Fractal parser plugins can mutate these objects to add custom properties or change existing values.

## Component

```js
{
  name: "button",
  role: "component",
  path: "/path/to/@button",
  config: {
    // raw data from config file, if present
  },
  files: [
    // array of files contained within this component
  ],
  dir: {
    // File object representing the directory that this component was created from
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
  scope: "component", // component / global
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
