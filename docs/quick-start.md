## Quick start guide

Fractal consist of two parts, a global command line tool and a per-project NPM package.

#### 1. Install the global Fractal command line tool

`npm install -g @frctl/fractal`

#### 2. Install Fractal as a dependency in your project

`npm install @frctl/fractal --save`

#### 3. Create a new fractal.js configuration file in the root of your project

```js
var app = require('@frctl/fractal');

app.set('project.title', 'My Amazing Component Library');
app.set('components.path', 'src/components');

//... Any other configuration items here
```

(Or run `fractal init` from within the root directory of your project to generate a default `fractal.js` file).

#### 4. Start the Fractal server

Run the command `fractal start` from within your root directory and then point your browser to [http://localhost:3000](http://localhost:3000) to view your new (empty!) component library.

#### 5. Create your first component

Run the command `fractal create component my-example` in your terminal and then refresh your browser to see your shiny new component in all it's glory.

#### 6. Export a static version of your component library

Use the `fractal build` command to export a static version of the site that you can easily upload to your webserver.

#### 7. And much more...

Check out the rest of the documentation for details on [configuring Fractal](/docs/configuration.md), creating [components](/docs/components/overview.md) and [pages](/docs/pages/overview.md) and more.
