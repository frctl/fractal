# Handlebars Adapter

Use Handlebars templates with Fractal.

This is the default template engine adapter for Fractal and does not need to be installed separately. See the Fractal [template engine documentation](https://github.com/frctl/fractal/blob/master/docs/engines/overview.md) for details on use and customisation.

## Helpers

The following Handlebars helpers come pre-installed into the handlebars instance. These are often useful when building or documenting Fractal-based component libraries.

### {{ render }}

The `render` helper renders a component (referenced by it's handle) using the context data provided to it. If no data is provided, it will use the context data defined within the component's configuration file, if it has one.

**This can be very useful as an alternative to using the regular partial `{{> @name }}` helper to import sub-components.** Partials do not pull in their own context so using the `render` helper instead can help prevent repetition of context data in the configuration files of components that include sub-components.

```handlebars
<!-- pass in data for rendering -->
{{render '@example' someData}}
{{render '@example--variant' otherData}}

<!-- use the config file data for rendering -->
{{render '@example'}}
{{render '@example--variant'}}
```

You can also pass in a *partial* data object (i.e. containing only some of the properties the component expects) and then set the `merge` property to true to populate the missing items from the default  context data. This allows you to override only the items you need to for this instance of the rendered component.

```handlebars
{{render '@example' partialData merge=true}}
```

### {{ context }}

Outputs the resolved context data for a component.

```handlebars
{{context '@example'}}

<!-- Outputs:
{
    "foo": "bar",
    "baz": "bar"
}
-->
```

### {{ view }}

Outputs the raw view template contents for the specified component.

```handlebars
{{view '@example'}}

<!-- Outputs:
<p>{{ text }}</p>
-->
```
