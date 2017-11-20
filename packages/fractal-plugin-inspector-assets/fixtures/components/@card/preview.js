const scss = require('./card.scss');
const card = require('./card.js');

module.exports = function (scenario) {
  card({
    text: scenario.context.text
  });
  console.log(scss);
};
