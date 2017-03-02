# Directory structure and naming conventions

Fractal v2 introduces a new set of rules for the way that files and folders should be named within your component library in order to reduce ambiguity in the parsing process.

> Note that these changes are _not_ backwards-compatible with the v1-style component library structure

An example component library structure might look like this:

```
├── components
│   ├── 01-units
│   │   └── @button
│   │       ├── button.css
│   │       ├── config.js
│   │       ├── view.njk
│   │       └── view.hbs
│   └── 02-patterns
│       ├── config.json
│       ├── @modal
│       │   └── README.md
│       └── @card
│           ├── card.css
│           ├── config.yml
│           └── view.hbs
```

A component is a **directory whose name begins with an `@` symbol**. In the example above there are therefore three components defined: `button`, `card` and `modal`.

By default, the following files within a component directory have 'special' meaning to Fractal:

* `config.{js|json|yml}`: Configuration file.
* `view.*`: View template file. A component can have multiple views in order to support different template engines.
* `README.md`: Markdown document containing usage info/docs for the component.

Any other files found within the component will be treated as resources of the component.
