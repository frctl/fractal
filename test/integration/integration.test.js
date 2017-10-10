/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */
const {join} = require('path');
const dir = require('path-reader');

const {expect} = require('../../test/helpers');
const Fractal = require('../../packages/fractal/fractal');

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

const renderDefaultVariant = async(fractal, errors, path, component) => {
  const getRender = async component => {
    const results = [];
    const result = await fractal.render(component, {}).catch(err => {
      errors.push(err);
      return '';
    });
    results.push(result);
    return results;
  };
  return await getRender(component);
};

const renderAllVariants = async(fractal, errors, path, component) => {
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
};

const renderAndCatchErrors = async(path, method) => {
  const fractal = makeFractal(path);
  const components = await fractal.getComponents();
  const errors = [];
  let results = await components.mapToArrayAsync(method.bind(null, fractal, errors, path)).catch(e => {
    errors.push(e);
    return [];
  });
  results = results.reduce((acc, val) => {
    return acc.concat(val);
  }, []);

  if (errors.length > 0) {
    throw new Error(`Could not render Components [component-render-error]\n  ${errors.join('\n')}`);
  }
  return results.sort();
};

const renderComponentsWithAllVariants = async path => {
  return await renderAndCatchErrors(path, renderAllVariants);
};

const renderComponentsWithDefaultVariant = async path => {
  return await renderAndCatchErrors(path, renderDefaultVariant);
};

const renderExpected = async(path, match = /.txt$/) => {
  const dirToLoad = join(__dirname, `fixtures/expected/${path}/`);
  return await new Promise((yep, nope) => {
    const results = [];
    dir.readFiles(dirToLoad, {match: match},
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
        return yep(results.sort());
      }
    );
  });
};

describe('Integration', function () {
  it('parses and renders all variants as expected for empty directory', function () {
    return expect(renderComponentsWithAllVariants('empty-directory')).to.eventually.eql([]);
  });
  it('parses and renders default variants as expected for empty directory', function () {
    return expect(renderComponentsWithDefaultVariant('empty-directory')).to.eventually.eql([]);
  });
  it('parses and renders all variants as expected for empty components', function () {
    return expect(renderComponentsWithAllVariants('empty-component')).to.eventually.eql([]);
  });
  // Should this error, or return empty array?
  it.skip('parses and renders default variants as expected for empty components', function () {
    return expect(renderComponentsWithDefaultVariant('empty-component')).to.eventually.eql([]);
  });
  it('parses and renders default variants as expected for simple components', async function () {
    const expected = await renderExpected('simple', /.html.txt$/);
    const comps = await renderComponentsWithDefaultVariant('simple');
    expect(comps).to.eql(expected);
  });
  it('parses and renders all variants as expected for simple components', async function () {
    const expected = await renderExpected('simple');
    const comps = await renderComponentsWithAllVariants('simple');
    expect(comps).to.eql(expected);
  });
});
