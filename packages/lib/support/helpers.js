module.exports = {

  getPartials(components = [], ext) {
    if (!ext) {
      throw new Error('You must specify an extension for the partials [ext-missing]');
    }
    ext = [].concat(ext);
    const partials = {};
    for (const component of components) {
      for (const variant of component.getVariants()) {
        const tpl = variant.getTemplates().find(tpl => ext.includes(tpl.extname));
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
