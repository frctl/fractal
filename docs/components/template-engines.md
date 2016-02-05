# Template Engines

In order to fit in with your project requirements, Fractal has built-in support for many different template engines for rendering your component views. Fractal also provides a simple plugin interface to let you add support for other template engines if the one you want to use is not supported out of the box.

The default template engine is [Handlebars](handlebarsjs.com), and expects your component view templates to have the `.hbs` file extension.

To change the template engine, set the value of the `components.view.engine` config setting in your fractal.js file to the one of your choosing:

```js
app.set('components.view.engine', 'nunjucks');
```

Currently supported 'out of the box' are:

* [Handlebars](handlebarsjs.com): `handlebars`
* [Nunjucks](https://mozilla.github.io/nunjucks/): `mustache`
* [Mustache](https://github.com/janl/mustache.js): `handlebars`

[More details coming soon...]
