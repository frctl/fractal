var _           = require('lodash');

var conf        = require('./config');

module.exports = {

    getStatuses: function(){
        return conf.get('statuses');
    },

    getDefault: function(){
        return _.find(this.getStatuses());
    },

    findStatus: function(key){
        return _.get(this.getStatuses(), key, null);
    }

};