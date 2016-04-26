# Writing your own commands

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Simple example](#simple-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Fractal lets you easily define custom commands to help you with your project workflow, integration or debugging needs.

Custom commands can be registered in your fractal.js file and will then be available to use either via the [command line interface](/docs/commands/overview.md) or to call using the [`.exec()` API method](/docs/api/overview.md#methods).

Custom commands can make use of the [Fractal API](/docs/api/overview.md) to get information about the project's components and documentation pages.

## Simple example

An example custom command is shown below. When called, this command will output a list of all components' handles together with their status.

```js
'use strict';

const fractal = require('@frctl/fractal');

fractal.command('list-components', 'Outputs a list of components', function(args, done){
    const app = this.fractal;
    for (let item of app.components.flatten()) {
        app.console.log(`${item.handle} - ${item.status.label}`);
    }
    done();
});
```

You could then run this task in a couple of ways:

1. From within your project directory, use the `fractal list-components` command (or just `list-components` in the [interactive CLI](https://github.com/frctl/fractal/blob/master/docs/commands.md#the-fractal-interactive-cli-sparkles)) from your terminal.
2. Call it programmatically from another file using the exec method - i.e. `fractal.exec('list-components')`
