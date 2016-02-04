'use strict';

var request = require('supertest'),
    Promise = require('bluebird');

var fakeApp = {
    address: function () {
        return {
            address: '0.0.0.0',
            port: 0
        };
    },
    listen: function () {
    }
};

var proto = Object.getPrototypeOf(request(fakeApp).get('/'));

var origEnd = proto.end;
proto.end = function (fn) {
    var self = this;
    if (typeof fn === 'function') {
        return origEnd.apply(self, arguments);
    }
    return Promise.fromNode(function(cb) {
        origEnd.call(self, cb);
    });
};

module.exports = request;
