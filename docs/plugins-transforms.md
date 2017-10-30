# Plugins and Transforms

The Fractal filesystem parser uses a system of transforms and plugins to turn raw file data into a set of Component objects.

The parser broadly works as follows:

1. A list of files and directories are read from the `src` directory (or directories).
2. This raw data is fed into the _files transform_ which turns the input into a collection of `File` objects.
3. Plugins that target the files collection are run sequentially, mutating the `File` instances as required.
4. The `File` objects are fed into the _components transform_ which generates a collection of `Component` objects based on the parsing rules it defines.
5. Plugins that target the components collection are run sequentially on the `Component` objects, mutating them as needed.

The majority of use cases will not need to customise the transforms, and can instead just use plugins to mutate the output of the transforms, i.e. either `File` or `Component` collections.

## Creating a plugin

A plugin should export a 'wrapper' function that can accept an options object. This function in return should return a plugin object that provides the following properties:

* `.name`: The name of the plugin - for example `lorem-ipsum-plugin`
* `.transform`: The transform whose output the plugin should run on (usually either `files` or `components`)
* `.handler(input, state, app)`: The actual plugin function that receives the input, mutates it and returns the updated collection of items.

A 'no-op' example plugin that operates on the components collection could look like this:

```js
module.exports = function noOpPlugin(opts = {}) {
  return {
    name: 'no-op',
    transform: 'components',
    handler(components, state, app) {
      // doesn't do anything, just returns the components untouched
      return components;
    }
  }
}
```

A more realistic example of a component might be one that parses the `README.md` file within each component and adds a `.readme` property to the component with the resulting HTML.

Using the [marked](https://github.com/chjj/marked) Markdown parser, we could implement a simple version of this as follows:

```js
// plugins/readme-parser.js
const marked = require('marked');

module.exports = function readmeParserPlugin(opts = {}) {
  marked.setOptions(opts);
  return {
    name: 'readme-parser',
    transform: 'components',
    handler(components, state, app) {
      return components.map(component => {
        const readme = component.getFiles().find(file => file.basename.toLowerCase() === 'readme.md');
        if (readme) {
          component.readme = marked(readme.contents.toString());
        }
        return component;
      });
    }
  }
}
```

Assuming this plugin lived in a `plugins` directory in the root of your project, you could add it to the parser by adding it to the `app.plugins` array in the project config file:

```js
// fractal.config.js
module.exports = {
  app: {
    //...
    plugins: [
      ['./plugins/readme-parser.js', {
        gfm: false,
        // other opts here...
      }]
    ]
  }
}
```

If we were generating a styleguide using Fractal Pages, we could now use this in our Pages component template to output the rendered README contents like this:

```html
<!-- _component.njk -->
{% if component.readme %}
<div class="component__readme">
{{ component.readme }}
</div>
{% endif %}
```

Or via the API in some custom tool or integration:

```js
// app.js
fractal.getComponents().then(components => {
  for (const component of components) {
    console.log(component.label);
    console.log(component.readme || 'No README file provided.')
  }
})
```

<!-- ## Files, Components and Collections

The first argument to the handler function will be a `Collection` instance. Collections can be thought of as **immutable** arrays, and share many of the same methods that arrays have. But because they are immutable, each operation returns will always return a new copy of the Collection. For example: -->
