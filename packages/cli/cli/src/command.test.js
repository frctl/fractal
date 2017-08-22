const {expect, sinon, mockRequire} = require('../../../../test/helpers');

const logSpy = sinon.spy(() => {});
const errorSpy = sinon.spy(() => {});
const handlerSpy = sinon.spy(() => {});
const helpSpy = sinon.spy(() => {});

mockRequire('@frctl/console', {
  log: logSpy,
  error: errorSpy
});
mockRequire('yargs', {
  showHelp: helpSpy
});

const Command = mockRequire.reRequire('./command');

const validCommand = {
  name: 'foo',
  aliases: ['bar'],
  command: 'foo [bar]',
  description: 'a command',
  builder: {},
  handler: handlerSpy
};

function command(...args) {
  return new Command(...args);
}

describe('Command', function () {
  beforeEach(function () {
    logSpy.reset();
    errorSpy.reset();
    handlerSpy.reset();
    helpSpy.reset();
  });

  describe('constructor()', function () {
    it('validates command schema', function () {
      expect(() => command({invalid: 'command'})).to.throw(TypeError, '[properties-invalid]');
      expect(() => command(validCommand)).to.not.throw();
    });
  });

  describe('.name', function () {
    it('returns the command name', function () {
      const cmd = command(validCommand);
      expect(cmd.name).to.equal(validCommand.name);
    });
  });

  describe('.aliases', function () {
    it('returns the command aliases', function () {
      const cmd = command(validCommand);
      expect(cmd.aliases).to.equal(validCommand.aliases);
    });
    it('returns an empty array if no aliases are provided', function () {
      const cmd = command({
        name: 'foo',
        command: 'foo [bar]',
        handler: () => {}
      });
      expect(cmd.aliases).to.be.an('array').with.property('length').that.equals(0);
    });
  });

  describe('.builder', function () {
    it('returns the command builder', function () {
      const cmd = command(validCommand);
      expect(cmd.builder).to.equal(validCommand.builder);
    });
    it('returns the an empty object if no builder is provided', function () {
      const cmd = command({
        name: 'foo',
        command: 'foo [bar]',
        handler: () => {}
      });
      expect(cmd.builder).to.eql({});
    });
  });

  describe('.description', function () {
    it('returns the command description if provided', function () {
      const cmd = command(validCommand);
      expect(cmd.description).to.equal(validCommand.description);
    });
    it('returns false if no description is provided', function () {
      const cmd = command({
        name: 'foo',
        command: 'foo [bar]',
        handler: () => {}
      });
      expect(cmd.description).to.equal(false);
    });
  });

  describe('.handler', function () {
    it('returns the command handler', function () {
      const cmd = command(validCommand);
      expect(cmd.handler).to.equal(validCommand.handler);
    });
  });

  describe('.command', function () {
    it('returns the command string', function () {
      const cmd = command(validCommand);
      expect(cmd.command).to.equal(validCommand.command);
    });
  });
});
