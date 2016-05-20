'use strict';

module.exports = function(fractal){

    function ContextExtension() {

        this.tags = ['context'];

        this.parse = function (parser, nodes) {
            var tok = parser.nextToken();
            var args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(tok.value);
            return new nodes.CallExtensionAsync(this, 'run', args);
        };

        this.run = function () {
            const source = fractal.components;
            const args = Array.from(arguments);
            const callback = args.pop();
            args.shift();
            const handle = args[0];
            const entity = source.find(handle);
            if (!entity) {
                throw new Error(`Could not render component '${handle}' - component not found.`);
            }
            const context = entity.isComponent ? entity.variants().default().context : entity.context;
            source.resolve(context).then(ctx => {
                callback(null, JSON.stringify(ctx, null, 4));
            }).catch(err => {
                callback(err);
            });
        };

    };

    return new ContextExtension();

};
