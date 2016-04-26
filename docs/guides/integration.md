# Guide: Integrating your component library

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Integration as an NPM dependency](#integration-as-an-npm-dependency)
  - [1. Update your Component library](#1-update-your-component-library)
  - [2. Require as a dependency in your application / site / build tool](#2-require-as-a-dependency-in-your-application--site--build-tool)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Once you've built your component library, you can use Fractal's API to integrate your components into your build tool or site.

## Integration as an NPM dependency

This example shows how you can publish your Fractal project as an NPM module which you can then pull into your build tool or application/site as a dependency.

### 1. Update your Component library

First make sure that all paths in your fractal.js file are relative to the fractal.js file itself. You can do this using by prefixing them using Node's `__dirname` global. You also then need to export the configured fractal instance using the `module.exports` statement.

```js
// fractal.js
'use strict';

const fractal = require('@frctl/fractal');

fractal.set('components.path', `${__dirname}/components`);

//.. other configuration here

module.exports = fractal; // export configured Fractal instance
```

Then in your project's `package.json`, set the `main` property to be your `fractal.js` file. This is not strictly necessary but makes importing easier later.

```js
// package.json
{
    "name": "my-component-library",
    "main": "fractal.js",
    // other package.json stuff...
}
```

Depending on your desired workflow, you should then **publish your Fractal project as an NPM module**, or alternatively just **push it to a remote git repository** - NPM can happily handle both cases. For brevity, in this example we'll assume it's been published as a NPM module.

### 2. Require as a dependency in your application / site / build tool

You can now `npm install` your component library as a versioned dependency into your main project. The project could be a static site build tool, an fully-fledged Node web application or anything in between.

You can then use [Fractal's API](/docs/api/overview.md) to access your components, render them with 'real' data, or do whatever you need to integrate them into your site.

```js
// package.json
{
    "name": "my-project",
    "dependencies": {
        "my-component-library": "^0.1.0"
    }   
}
```

In this (trivial!) example we'll just create a file, `index.js` that when run (i.e. via `node index.js`) renders the HTML for the '@button' component with some custom context data and then logs the generated HTML to the terminal.

```js
// index.js
'use strict';

const library = require('my-component-library');

library.components.load().then(function(components){
    // render the @button component with some context data
    components.render('@button', {
        buttonText: 'Some text for the button'
    }).then(function(html){
        console.log(html);
    });
});
```
