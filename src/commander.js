
module.exports = function(fractal){

  let yargs = require('yargs');

  ['components','files'].forEach(entity => {
    yargs = require(`./${entity}/cli`)(fractal, yargs);
  });

  return yargs;

};
