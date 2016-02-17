# Component Configuration Reference 

<!-- START doctoc -->
<!-- END doctoc -->

Each component can have it's own (optional) configuration file associated with it, allowing you to pass preview data to your  components, customise their titles, change the status of components, configure variants and much more.

In order to be recognised, component configuration files must:

* Reside in the same directory as the main component view file
* Have a file name in the format `component-name.config.{js|json|yml}` - for example `button.config.json` or `blockquote.config.yml`

The following primitive properties are inherited from upstream sources if not specified directly:

* `status` (default: `'ready'`)
* `preview` (default: `null`)
* `isHidden` (default: `false`)
* `prefix` (default: `null`)