/**
 * Module dependencies.
 */

var _ = require('lodash');

/*
 * Export the utilities.
 */

module.exports = {

    titlize: function(str){
        return _.startCase(str);
    }

};
