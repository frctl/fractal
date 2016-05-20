'use strict';

module.exports = function(fractal){

    function ViewExtension() {

        this.tags = ['view'];

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
            let entity = source.find(handle);
            if (!entity) {
                throw new Error(`Could not render component '${handle}' - component not found.`);
            }
            if (entity.isComponent) {
                entity = entity.variants().default();
            }
            entity.getContent().then(content => {
                callback(null, content);
            }).catch(err => {
                callback(err);
            });

        };
    };

    return new ViewExtension();

};
