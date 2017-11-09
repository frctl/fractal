const {extname} = require('path');

module.exports = {

  getPartials(components = [], matcher) {
    if (!matcher) {
      throw new Error('You must specify a template extension matcher [matcher-missing]');
    }
    if (typeof matcher !== 'function') {
      matcher = filename => {
        const ext = extname(filename);
        return [].concat(matcher).includes(ext);
      }
    }
    const partials = {};
    for (const component of components) {
      for (const variant of component.getVariants()) {
        const tpl = variant.getTemplates().find(tpl => matcher(tpl.filename));
        if (tpl) {
          const str = tpl.toString();
          partials[`${component.id}:${variant.id}`] = str;
          if (component.isDefaultVariant(variant)) {
            partials[component.id] = str;
          }
        }
      }
    }
    return partials;
  }

};
