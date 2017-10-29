const {resolve, join} = require('path');
const {expect} = require('../../../../test/helpers');
const loader = require('./config');

const cwd = process.cwd();

describe('CLI config loader', function () {
  after(function () {
    process.chdir(cwd);
  });
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });
  it('returns empty props if no package path is specified', function () {
    const {configPath, config} = loader();
    expect(configPath).to.equal(undefined);
    expect(config).to.eql({});
  });
  it('supports specifying config file names in package.json', function () {
    const targetDir = join(__dirname, '../../../../test/fixtures/config/with-pkg-config');
    process.chdir(targetDir);
    const {configPath, config} = loader(targetDir + '/package.json');
    expect(configPath).to.equal(resolve(targetDir + '/config.js'));
    expect(config).to.be.an('object').with.property('cli');
  });
  it('uses config from the package.json if no other config file is found', function () {
    const targetDir = join(__dirname, '../../../../test/fixtures/config/no-config');
    process.chdir(targetDir);
    const {configPath, config} = loader(targetDir + '/package.json');
    expect(configPath).to.equal(resolve(targetDir + '/package.json'));
    expect(config).to.be.an('object').with.property('app');
  });
  it('supports providing one or more file names to search for', function () {
    const targetDir = join(__dirname, '../../../../test/fixtures/config/with-config');
    process.chdir(targetDir);
    const {configPath, config} = loader(targetDir + '/package.json', {config: ['fractal.config.js']});
    expect(configPath).to.equal(resolve(targetDir + '/fractal.config.js'));
    expect(config).to.be.an('object').with.property('cli');
  });
});
