const expect = require('@frctl/utils/test').expect;
const Store = require('@frctl/surveyor').Store;
const Commands = require('../src/commands');

describe('Commands', function () {
  it('inherits from Store', function () {
    const commands = new Commands();
    expect(commands).to.be.instanceof(Store);
  });

  describe('.validate()', function () {
    it('throws an error if the command supplied does not validate', function () {
      const commands = new Commands();
      expect(() => commands.add('foo')).to.throw(TypeError, '[command-invalid]');
    });
    it('does not throw an erro when passed a valid commmand object', function () {
      const commands = new Commands();
      expect(() => commands.add({
        command: 'foo',
        description: 'foo desc',
        handler() {}
      })).to.not.throw(TypeError, '[command-invalid]');
    });
  });
});
