const _ = require('lodash');
const config = require('./config');
const name = require('./name');
const label = require('./label');

module.exports = function () {
  return [
    config(),
    name(),
    label()
  ];
};
