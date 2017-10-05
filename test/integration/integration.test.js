/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */
const {join} = require('path');
const fs = require('fs');
const pify = require('pify');

const {promisify} = require('../../packages/internals/utils');
const {expect} = require('../../test/helpers');
const Fractal = require('../../packages/fractal/fractal');

const pfs = promisify(fs);

const makeConfig = path => ({
  src: join(__dirname, `fixtures/components/${path}`),
  presets: null,
  // TODO: Intention here, to eventually replace with all engines we provide directly
  engines: [
    join(__dirname, '../../packages/fractal/fractal-engine-html'),
    join(__dirname, `fixtures/add-ons/engines/funjucks`)
  ]
});

function makeFractal(path) {
  return new Fractal(makeConfig(path));
}

const renderThings = async path => {
  const fractal = makeFractal(path);
  const components = await fractal.getComponents();
  const errors = [];

  const results = await components.mapToArrayAsync(async component => {
    const getRender = async component => {
      return await fractal.render(component).catch(err => {
        errors.push(err);
        return '';
      });
    };
    return await getRender(component);
  }).catch(e => {
    errors.push(e);
    return [];
  });

  if (errors.length > 0) {
    throw new Error(`Could not render Components [component-render-error]\n  ${errors.join('\n')}`);
  }
  return results;
};

const loadExpected = async (path, cb) => {
  const pathToLoad = join(__dirname, `fixtures/expected/${path}/@button/view.txt`);
  if (pfs.existsSync(pathToLoad)) {
    return (await pfs.readFile(pathToLoad)).toString() || '';
  }
};

describe('Integration', function () {
  // Currently just describing current behaviour, but we might want to think about this
  it('parses and renders fixtures as expected for empty directory', function () {
    return expect(renderThings('empty-directory')).to.eventually.eql([]);
  });
  it('parses and renders fixtures as expected for empty components', function () {
    return expect(renderThings('empty-component')).to.eventually.be.rejectedWith('[component-render-error]');
  });
  it('parses and renders fixtures as expected for simple components', async function () {
    const expected = await loadExpected('simple');
    return expect(renderThings('simple')).to.eventually.eql([expected]);
  });
});
