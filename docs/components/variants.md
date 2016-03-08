# Variants

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Creating variants](#creating-variants)
  - [Defining variants in the component's config file](#defining-variants-in-the-components-config-file)
    - [The default variant](#the-default-variant)
  - [Creating file-based variants](#creating-file-based-variants)
  - [Mixing configuration and file based variants](#mixing-configuration-and-file-based-variants)
- [Referencing variants](#referencing-variants)
- [Collated components](#collated-components)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Variants are useful when you have one component that has a **multiple different possible implementations**. For instance, you may have a 'notification banner' component. This might have a default style but also a number of variations - for example a 'warning' banner and 'success' banner. These could be implemented as separate components but often it's easier and more semantic to create them as variants of the default banner component.

A component can have as many variants as you like. Behind the scenes, *every* component has at least one variant - when you are previewing or rendering a component you are actually seeing it's 'default' variant, even if you have not explicitly defined one.

Variants will typically use the default view template for the component they belong to; the variation comes from the ability to define a different set of [context data](/docs/components/context.md) to will be used when rendering previews. However it is also possible to use a completely different view template if desired (which itself can include the main view template as a partial should you so wish).

## Creating variants

There are a few ways to create variants of a component. They can be defined within the parent component's configuration file; they can be created by adding an additional view file within the directory that the main component view file resides; or they can be created using a combination of both methods.

### Defining variants in the component's config file

Component [configuration files](/docs/configuration-files.md) let you specify `variants` property. The value of this should be an array of variant definition objects. For example:

```js
// notifications.config.json
{
	"title": "Notification Banner"
	"variants": [
		{
			"name": "warning"
		},
		{
			"name": "success"
		}
	]
}
```

Every variant that is defined *must* have a value for the `name` property. **This is the only required property for a variant.**

Variants inherit many properties set on the parent component, or indeed further up in the [configuration cascade](/docs/configuration-files.md#configuration-inheritance), which means that you can set properties like `status` only once, on the parent component, and then just override them on a variant-by-variant basis if needed. The [component configuration reference](/docs/components/configuration.md#variant-properties) has full details on the properties you can set on your variants.

The above example wouldn't give us anything very interesting, so let's look at how we could actually implement the notification banner example described in the overview section. Given a view template that looks like this:

```handlebars
<!-- notification.hbs -->
<div class="notification notification--{{ modifier }}">
    <p class="notification-message">{{ message }}</p>
    <a class="notification-close" href="#">{{ closeButtonText }}</a>>
</div>
```

We can define the required variants in the component config file like this:

```js
// notifications.config.json
{
	"title": "Notification Banner",
    "status": "ready",
	"context": {
		"modifier": "default",
		"closeButtonText": "close",
		"text": "This is the default banner"
	},
	"variants": [
		{
			"name": "warning",
            "context": {
        	    "modifier": "alert",
                "text": "This is a warning banner"
        	}
		},
		{
			"name": "success",
            "status": "prototype",
            "context": {
        	    "modifier": "success",
                "text": "This is a success banner"
        	}
		}
	]
}
```
This will give **three** variants; the default component variant, plus a `warning` and a `success` variant.

In this example all of the variants will use the same view template, but will pass it different data when rendered as a preview. Because the default component configuration specifies a `closeButtonText` value in it's context data, the variants do no need to - they only need to override the properties that need to be different for that particular variant.

Similarly, by specifying a top-level `status` value, all variants will *inherit* that status unless explictly specified, as the `success` variant does.

#### The default variant

The 'default' variant is created implicitly from the component configuration data. However if you want to manually override anything for the default variant you can also explicitly create a variant with the name `default` and set it's properties there. For example, to change the navigation label from 'Default' to 'Base' you could do this:

```js
// notifications.config.json
{
	"title": "Notification Banner",
	"variants": [
		{
			"name": "default",
			"label": "Base"
		},
		// other variants...
	]
}
```

### Creating file-based variants

If you want to create a variant that has different markup from the default component view, you can also create a variant by adding another view file into the same directory as the default component view. This needs to be named in the format `<component-name>--<variant-name>.hbs` (or with the appropriate file extension for the template engine you are using).

For instance, we could recreate the example above using files by creating the following file structure:

```
├── components
│   └── notification
│   │   ├── notification--success.hbs
│   │   ├── notification--warning.hbs
│   │   └── notification.hbs
```

Each variant can then have it's own markup, and by default will be rendered with whatever context data is defined in the parent component's configuration file (if any).

### Mixing configuration and file based variants

It is also possible to mix the two approaches described above, which is useful when you want to define a variant with it's own view file but which also has some additional configuration data associated with it.

By defining a variant view file called `notification--success.hbs` you are actually defining the view template to be used for the `success` variant. If that variant is **not** defined in the components' config file then it is rendered with the default component context data and information. However if a variant with that name *is* defined in the component configuration, then that view will be used when rendering that component, and any configuration data (such as `label` etc) will be applied to that view.

So by combining both examples above, each of the notification banner variants would have both their own markup *and* their own context data (and status, etc).

## Referencing variants

Variants can be referenced using the component `@handle` syntax, suffixed with a double hyphen and the variant's name. So using the example above, you could reference the success variant via the handle `@notification--success`.

> It's worth noting that if you include a variant as a partial within another component, and that variant *does not* have it's own view template, the effect will be identical to including the component itself, as they will share the same template.

## Collated components 

Variants are generally exposed in UIs (such as the web UI) as individual items under the main component. In some cases you may want to render the component as a *collated component*, in which case it will instead appear as a single component with a preview that concatenates all the variant previews together into a single view.

This can useful for when you have many variations of a small component such as a button and want to preview them all together, rather than having to flick between previews of each one individually.

To render a component in this way you need to set the `collated` property to `true` in the [component configuration file](/docs/components/configuration.md#collated).