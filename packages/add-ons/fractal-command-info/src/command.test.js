const cli = require('@frctl/cli');
const fractal = require('@frctl/fractal');
const {expect, validate} = require('../../../../test/helpers');
const command = require('./command');

const app = fractal();
const env = {
  commands: [],
  configPath: 'path/to/config.js',
  cwd: process.cwd(),
  debug: false,
  version: '1.0.0'
};

describe('command-info', function () {
  it('has the expected format', function () {
    expect(validate(cli.schema.command, command())).to.equal(true);
  });

  describe('.handler()', () => {
    it('returns a string', function () {
      expect(command().handler({}, app, env)).to.be.a('string');
    });
    it('includes the config path, if set', function () {
      expect(command().handler({}, app, env).indexOf(env.configPath)).to.be.greaterThan(-1);
      expect(command().handler({}, app, Object.assign({}, env, {configPath: null})).indexOf('No config')).to.be.greaterThan(-1);
    });
  });
});
