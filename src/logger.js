var winston = require('winston');

var logger = module.exports = {
    dump(data){
        console.log(JSON.stringify(data, function(key, val){
            if (this[key] instanceof Buffer) {
                return '<Buffer>';
            }
            return val;
        }, 4));
    }
};

Object.assign(logger, winston);
