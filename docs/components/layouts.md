# Preview Layouts

<!-- START doctoc -->
<!-- END doctoc -->

By default, when Fractal renders a component, it does so without wrapping it in any 'page' structure markup. That means that it is effectively an HTML *fragment*, as opposed to an HTML *page*. As a result, your components will appear unstyled; Fractal **does not** automatically insert any styles or behaviour into the rendered markup.

In order to faithfully render a component in the same way as it will look in your live site, Fractal supports the use of **preview layouts**. These are used when rendering component previews, and allow you to 'wrap' your component in some page markup so you can link to your stylesheets, javascript and so on, just as you would in your site proper.

For example, a component with the following view file:

```

```

You can specify the which preview layout to use on a global basis (in your `fractal.js` [project settings](/docs/project-settings.md) file) or on a [component-by-component basis](/docs/components/configuration.md#preview) (allowing different layouts for different use-cases).

> Preview layouts are just components, and so must reside within your component directory. Like any other components, they can be [hidden](/docs/components/tips-and-tricks.md) if you don't want them to show up in listings or navigation.


