const {Fractal} = require('@frctl/fractal');
const Pages = require('../src/pages');

module.exports.makePages = function(config){
  return new Pages(new Fractal(), config);
}
