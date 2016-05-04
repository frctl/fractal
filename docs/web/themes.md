# Web UI Themes

The web UI supports the use of *themes*. Themes are very powerful, and allow complete control over everything from look and feel to URLs and functionality. Themes can be used to customise the look and feel of the web UI to match your project or even to give a completely different 'view' of your component library to different project stakeholders - for instance a 'no code' theme for people that might only be interested in reviewing the component previews.

<!-- START doctoc -->
<!-- END doctoc -->

## Default Theme - Mandelbrot

The default theme for Fractal is called [Mandelbrot](https://github.com/frctl/mandelbrot). It ships with the Web UI plugin so there is nothing to install. It looks something like this:

![Fractal Component Screenshot](http://frctl.s3.amazonaws.com/screenshots/fractal-component.png)

Mandelbrot supports all of the [Web UI configuration settings](/docs/web/overview.md#configuration-options), plus some theme-specific additional options that are detailed below.

### Configuration options

These config options should be set in your [project settings](/docs/project-settings.md) file. The configuration options exist to help you customise the look and feel of your Component Library on a case-by-case basis. If you want to apply a consistent set of modifications to all your Fractal projects, you may want to [develop your own custom theme instead](#developing-a-custom-theme).

#### skin

Mandelbrot offers a pre-defined set of colour 'skins' that you can apply to the UI.

```js
fractal.set('themes.mandelbrot.skin', 'maroon');
```

* **Choices:** `aqua | black | blue | default | fuchsia | green | grey | lime | maroon | navy | olive | orange | purple | red | teal | white | yellow`
* **Default:** `default` (blue)

#### stylesheet

If you wish to go one step further than just specifying a colour `skin`, you can specify an alternative stylesheet for Mandelbrot to use. You can either link to a hosted stylesheet somewhere, or you can link to one in your [static assets directory](/docs/web/overview.md#static-assets-path) (if set up).

```js
fractal.set('themes.mandelbrot.stylesheet', 'http://example.com/my-custom-theme.css'); // link to a hosted stylesheet
fractal.set('themes.mandelbrot.stylesheet', '/my-custom-theme.css'); // link to a file in your static assets directory
```

> If you are using this option, it's worth noting that some of Mandelbrot's JS may break if the UI does not have the appropriate supporting styles. For this reason it's recommended that you use the **Sass files** and **Gulp CSS build tasks** from the [Mandelbrot repository](https://github.com/frctl/mandelbrot) as a starting point for creating you own custom stylesheet.

#### head

You also have the option of not just overriding the stylesheet used, but the full content of the `head` of the Mandelbrot HTML page. This will give you complete control over any stylesheets, font loaders, metadata or anything else you want to add to the theme.

```js
fractal.set('themes.mandelbrot.head', `
<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="/my-custom-stylesheet.css" type="text/css">
<title>My Amazing Component Library</title>
`);
```

This will completely replace all the of the content in the `head` of the Mandelbrot UI, so you'll need to make sure that you copy across any elements that you don't want to use. The default content is as follows:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>var cl = document.querySelector('html').classList; cl.remove('no-js'); cl.add('has-js');</script>

<link rel="shortcut icon" href="{{ frctl.theme.urlPath('favicon.ico') }}" type="image/ico">
<link rel="stylesheet" href="{{ frctl.theme.stylesheet }}?cachebust={{ frctl.theme.version }}" type="text/css">

<title>{% if pageTitle %}{{ pageTitle }} | {% endif %}{{ frctl.config.project.title }}</title>
```

> Mandelbrot is written using Nunjucks. The content of the `themes.mandelbrot.head` setting will be run through the Nunjucks parser before being applied to the page.

#### foot

Like the `head` content, you can also completely replace the content in the `foot` of the page. This is useful if you want to add scripts or similar after the main page content has been rendered.

```js
fractal.set('themes.mandelbrot.foot', `
<script src="{{ frctl.theme.urlPath('/theme/js/mandelbrot.js') }}"></script>
<script src="/my-custom-scripts.js"></script>
`);
```

Note that like the `head` option, this will completely replace all of the content in the UI theme 'foot', including the script tag that loads the Mandelbrot JS file. So you will need to copy that over if you want to retain the default set of behaviours. The default content is as follows:

```html
<script src="{{ frctl.theme.urlPath('/theme/js/mandelbrot.js') }}"></script>
```

> Mandelbrot is written using Nunjucks. The content of the `themes.mandelbrot.foot` setting will be run through the Nunjucks parser before being applied to the page.

#### contextFormat

The output format for components' [context data](/docs/components/context.md).

```js
fractal.set('themes.mandelbrot.contextFormat', 'YAML');
```

* **Choices:** `JSON | YAML`
* **Default:** `JSON`

#### lang

Specify the value of the `lang` attribute that is applied to the `html` element.

```js
fractal.set('themes.mandelbrot.lang', 'fr');
```

#### rtl

Switch the theme into RTL mode.

```js
fractal.set('themes.mandelbrot.rtl', true);
```

## Developing a custom theme

[coming soon]
