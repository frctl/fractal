# Sub-components

<!-- START doctoc -->
<!-- END doctoc -->

## Overview

Often you will want to include one component within another component. For instance, you may have a 'button' component that you want to include as a sub-component of a 'search box' component (as well as potentially within a number of other components).

Using the default Handlebars [template engine](/docs/), that might look something like this:

```handlebars
<!-- button.hbs -->
<button type="button" name="submit">Search</button>
```

```handlebars
<!-- search-box.hbs -->
<div class="searchbox">
    <input type="search" name="keywords">
    {{> @button }}
</div>
```
As you can see, the `search-box.hbs` component view file uses the standard [Handlebars partial include](http://handlebarsjs.com/#partials) syntax to include the button template, with one difference - instead of using a *path* to the template, it uses the [`@handle` syntax](/docs/components/overview.md#referencing-components---@handle-syntax) to refer to the button component by it's handle. 

It's important to note that the syntax for including one component's view template within another **will depend on which [template engine](/docs/engines/overview.md) you are using**. For instance, if you were using the [Nunjucks engine](https://github.com/frctl/nunjucks-adapter) you would use Nunjuck's `include` tag to include sub components. For example:

```html
<div class="parent">
    {% include '@child' %}
</div>
```

## Providing context data to sub-components

When you include a sub-component in the manner described above, it's important to note that you are effectively just including the contents sub-component's view file. **It will not automatically include any [context data](/docs/components) that you may have defined for that sub-component.**

To pass context data into your included sub-components, you have a number of options.

* Define 
