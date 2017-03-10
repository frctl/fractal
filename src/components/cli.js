const reqAll = require('req-all');
const _ = require('lodash');

module.exports = function(fractal, yargs){

  yargs = yargs || require('yargs');

  yargs.command('components <command>', 'component commands', yargs => {
    for (const command of _.values(reqAll('./commands'))) {
      yargs.command(command(fractal));
    }
  });

  return yargs;

};
