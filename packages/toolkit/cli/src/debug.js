// const {log} = require('@frctl/console');
const {log} = console; // TODO: use proper logger when completed!

module.exports = function(debug){

  return function(str) {
    if (debug) {
      log(str);
    }
  }

};
