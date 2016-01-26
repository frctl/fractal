var winston = require('winston');

var logger = module.exports = {
    dump(data){
        console.log(JSON.stringify(data, null, 4));
    }
};

Object.assign(logger, winston);
