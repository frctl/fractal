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

const command = mockRequire.reRequire('./command');

const validCommand = {
  name: 'foo',
  command: 'foo [bar]',
  handler: handlerSpy
};
const argv = {};
const app = {};
const env = {
  debug: false,
  commands: []
};

describe('Cli', function () {
  beforeEach(function () {
    logSpy.reset();
    errorSpy.reset();
    handlerSpy.reset();
    helpSpy.reset();
  });
  describe('command', function () {
    it('exports a function', function () {
      expect(command).to.be.a('function');
    });

    it('validates command schema', function () {
      expect(() => command({invalid: 'command'})).to.throw(TypeError, ['properties-invalid']);
      expect(() => command(validCommand)).to.not.throw();
    });

    it('returns a command object', function () {
      expect(command(validCommand)).to.be.an('object').with.all.keys(['name', 'command', 'description', 'builder', 'handler']);
    });

    it('wraps the command handler to provide a custom argument set', function () {
      const cmd = command(validCommand, app, env);
      cmd.handler(argv);
      expect(handlerSpy.calledWithMatch(argv, app, env)).to.equal(true);
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
    });
  });

  describe('Command schema', function () {
    it('is a valid schema', function () {
      expect(validateSchema(commandSchema)).to.equal(true);
    });
  });
});
