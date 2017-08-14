const {expect, sinon, mockRequire, validateSchema} = require('../../../../test/helpers');
const commandSchema = require('./command.schema');

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
  command: 'foo [bar]',
  description: 'a command',
  handler: handlerSpy
};
const argv = {};
const app = {};
const env = {
  debug: false,
  commands: []
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
      expect(() => command({invalid: 'command'})).to.throw(TypeError, ['properties-invalid']);
      expect(() => command(validCommand)).to.not.throw();
    });
  });

  describe('.name', function () {
    it('returns the command name', function () {
      const cmd = command(validCommand);
      expect(cmd.name).to.equal(validCommand.name);
    });
  });

  describe('.description', function () {
    it('returns the command description if provided', function () {
      const cmd = command(validCommand);
      expect(cmd.description).to.equal(validCommand.description);
      const cmd2 = command({
        name: 'foo',
        command: 'foo [bar]',
        desc: 'foo desc',
        handler() {}
      });
      expect(cmd2.description).to.equal('foo desc');
      const cmd3 = command({
        name: 'foo',
        command: 'foo [bar]',
        describe: 'foo desc',
        handler() {}
      });
      expect(cmd3.description).to.equal('foo desc');
    });
  });

  describe('.handler()', function () {
    it('returns a promise', function () {
      const cmd = command(validCommand, app, env);
      expect(cmd.handler(argv)).to.be.instanceOf(Promise);
    });

    it('calls the yargs help method if the argv.help property is true', function () {
      const cmd = command(validCommand, app, env);
      cmd.handler({
        help: true
      });
      expect(helpSpy.called).to.equal(true);
    });

    it('logs the output if the return value is a string', async function () {
      const cmd = command({
        name: 'foo',
        command: 'foo [bar]',
        handler() {
          return 'woop';
        }
      }, app, env);
      await cmd.handler(argv);
      expect(logSpy.calledWith('woop')).to.equal(true);
    });

    it('logs the error if the promise rejects', async function () {
      const err = new Error('boo');
      const cmd = command({
        name: 'foo',
        command: 'foo [bar]',
        handler() {
          throw err;
        }
      }, app, env);
      await cmd.handler(argv);
      expect(errorSpy.calledWith(err)).to.equal(true);
    });

    it('calls the handler prop with the expected arguments', function () {
      const cmd = command(validCommand, app, env);
      cmd.handler(argv);
      expect(handlerSpy.calledWithMatch(argv, app, env)).to.equal(true);
    });
  });
});

describe('Command schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(commandSchema)).to.equal(true);
  });
});
