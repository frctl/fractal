const {extname} = require('path');
const visit = require('unist-util-visit');
const is = require('hast-util-is-element');
const removePosition = require('unist-util-remove-position');

module.exports = function (tree, context, env) {
  const parent = env.component;
  const variant = env.variant;

  visit(tree, 'element', function (node, index, parentNode) {
    if (is(node, 'include')) {
      if (!node.properties.component) {
        throw new Error(`You must provide a 'component' attribute for the 'include' tag ${parent.id}`);
      }
      const [subComponentId, variantId] = node.properties.component.split(':');
      const subComponent = env.components.find(subComponentId);
      if (subComponent.id === parent.id) {
        throw new Error(`Recursive component include detected! Ignoring component.`);
      }

      const subComponentVariant = subComponent.getVariant(variantId);
      if (!subComponentVariant) {
        throw new Error(`Could not find variant for component ${subComponent.id}`);
      }

      const templateExt = extname(env.template.filename);
      const template = subComponentVariant.getTemplate(templateExt);

      if (!template) {
        throw new Error(`Could not find '${templateExt}' template for component ${subComponent.id}`);
      }

      // Register the include on the parent variant

      variant.includes = variant.get('includes', []);

      const include = {
        component: subComponent.id,
        variant: subComponentVariant.id,
        template: templateExt,
        count: 1,
        ref: `${subComponent.id}.${subComponentVariant.id}${templateExt}`
      };

      const included = variant.includes.find(i => i.ref === include.ref);
      if (included) {
        included.count++;
      } else {
        variant.includes.push(include);
      }

      const componentNodes = removePosition(template.clone().contents).children;
      parentNode.children.splice(index, 1, ...componentNodes);
    }
  });
  return tree;
};
