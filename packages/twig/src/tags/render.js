'use strict';

const _ = require('lodash');
const path = require('path');

/**
 * Render tag
 *
 *  Format: {% render "@component" with {some: 'values'} %}
 */
module.exports = function (fractal) {
    return function (Twig) {
        return {
            type: 'rendertag',
            regex: /^render\s+(.+?)\s*(?:with\s+([\S\s]+?))?\s*$/,
            next: [],
            open: true,
            compile: function (token) {
                const match = token.match,
                    handle = match[1].trim(),
                    context = match[2];

                token.stack = Twig.expression.compile.apply(this, [
                    {
                        type: Twig.expression.type.expression,
                        value: handle
                    }
                ]).stack;

                if (context !== undefined) {
                    token.contextStack = Twig.expression.compile.apply(this, [
                        {
                            type: Twig.expression.type.expression,
                            value: context.trim()
                        }
                    ]).stack;
                }

                delete token.match;
                return token;
            },
            parse: function (token, context, chain) {
                const file = Twig.expression.parse.apply(this, [token.stack, context]);
                const handle = path.parse(file).name;

                if (!handle.startsWith('@')) {
                    throw new Error(`You must provide a valid component handle to the render tag.`);
                }

                const entity = fractal.components.find(handle);

                if (!entity) {
                    throw new Error(`Could not render component '${handle}' - component not found.`);
                }

                let innerContext = entity.isComponent ? entity.variants().default().context : entity.context;

                if (token.contextStack !== undefined) {
                    _.assign(innerContext, Twig.expression.parse.apply(this, [token.contextStack, context]));
                }

                let template;

                if (file instanceof Twig.Template) {
                    template = file;
                }
                else {
                    template = this.importFile(file);
                }

                return {
                    chain: chain,
                    output: template.render(innerContext)
                };
            }
        };
    };
};
