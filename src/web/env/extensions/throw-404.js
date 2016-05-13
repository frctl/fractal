'use strict';

module.exports = function(app){

    return {
        
        name: 'Throw404',

        extension: function Throw404Extension() {

            this.tags = ['throw404'];

            this.parse = function (parser, nodes, lexer) {
                var tok = parser.nextToken();
                var message = parser.parseSignature(null, true);
                parser.advanceAfterBlockEnd(tok.value);
                return new nodes.CallExtension(this, 'run', message);
            };

            this.run = function (context, message) {
                throw new Error(message || 'Not Found');
            };

        }
    };

};
