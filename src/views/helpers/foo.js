var Handlebars      = require('handlebars');

module.exports = {
    name: "foohelper",
    helper: function(options){
        console.log('asdasd');
        return new Handlebars.SafeString('<h1>FOO!</h1>');
    }
};