require('./card.css');
const card = require('./card.js');

module.exports = function(scenario, variant, component){

  card({
    text: scenario.context.text
  });

}
