/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */
const {join} = require('path');
const fs = require('fs');
const dir = require('path-reader');
const pify = require('pify');

const {promisify} = require('../../packages/internals/utils');
const {expect} = require('../../test/helpers');
const Fractal = require('../../packages/fractal/fractal');

const pfs = promisify(fs);
const pdir = promisify(dir);

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

const renderComponents = async path => {
  const fractal = makeFractal(path);
  const components = await fractal.getComponents();
  const errors = [];
  let results = await components.mapToArrayAsync(async component => {
    const getRender = async component => {
      const results = [];
      for (const variant of component.getVariants()) {
        for (const ext of component.getViews().mapToArray(v => v.extname)) {
          const result = await fractal.render(variant, {}, {ext}).catch(err => {
            errors.push(err);
            return '';
          });
          results.push(result);
        }
      }
      return results;
    };
    return await getRender(component);
  }).catch(e => {
    errors.push(e);
    return [];
  });
  results = results.reduce((acc, val) => {
    return acc.concat(val);
  }, []);

  if (errors.length > 0) {
    throw new Error(`Could not render Components [component-render-error]\n  ${errors.join('\n')}`);
  }
  return results;
};

const renderExpected = async path => {
  const dirToLoad = join(__dirname, `fixtures/expected/${path}/`);
  return await new Promise((yep, nope) => {
    const results = [];
    dir.readFiles(dirToLoad,
      function (err, content, next) {
        if (err) {
          return nope(err);
        }
        results.push(content);
        next();
      },
      function (err, files) {
        if (err) {
          return nope(err);
        }
        return yep(results);
      }
    );
  });
};

describe('Integration', function () {
  // Currently just describing current behaviour, but we might want to think about this
  it('parses and renders fixtures as expected for empty directory', function () {
    return expect(renderComponents('empty-directory')).to.eventually.eql([]);
  });
  it('parses and renders fixtures as expected for empty components', function () {
    return expect(renderComponents('empty-component')).to.eventually.eql([]);
  });
  it('parses and renders fixtures as expected for simple components', async function () {
    const expected = await renderExpected('simple');
    expected.sort();
    const comps = await renderComponents('simple');
    comps.sort();
    return expect(comps).to.eql(expected);
  });
});
