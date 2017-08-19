const command = require('../../../../test/fixtures/add-ons/command');
const {expect} = require('../../../../test/helpers');
const Cli = require('./cli');

describe('Cli', function () {
  describe('constructor', function () {
    it('add commands from the config', function () {
      const cli = new Cli({
        commands: [command]
      });
      expect(cli.getCommands().length).to.equal(1);
    });
  });
});
