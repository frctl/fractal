var Handlebars      = require('handlebars');

module.exports = {
    name: "fractal-example",
    helper: function(options){
        return new Handlebars.SafeString('<!-- Just an example helper -->');
    }
};