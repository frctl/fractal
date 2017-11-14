const {extname} = require('path');
const ComponentCollection = require('./src/collections/component-collection');

module.exports = {

  getPartials(components, matcher) {
    components = components || new ComponentCollection();
    if (!matcher) {
      throw new Error('You must specify a template extension matcher [matcher-missing]');
    }
    if (typeof matcher !== 'function') {
      const extensions = [].concat(matcher);
      matcher = filename => {
        const ext = extname(filename);
        return extensions.includes(ext);
      };
    }
    const partials = {};
    for (const component of components) {
      for (const variant of component.getVariants()) {
        const tpl = variant.getTemplates().find(tpl => matcher(tpl.filename));
        if (tpl) {
          const str = tpl.toString();
          partials[`${component.id}:${variant.id}`] = str;
          partials[`${component.id}:${variant.id}${tpl.extname}`] = str;
          if (component.isDefaultVariant(variant)) {
            partials[component.id] = str;
            partials[`${component.id}${tpl.extname}`] = str;
          }
        }
      }
    }
    return partials;
  },

  lookup(ref, components) {
    components = components || new ComponentCollection();
    const [componentName, variantName] = ref.split(':');
    const component = components.find(componentName);
    if (component) {
      return variantName ? component.getVariant(variantName) : component.getDefaultVariant();
    }
  }

};
