const fractal = require('@frctl/fractal');
const {expect} = require('../../../../../test/helpers');
const loader = require('./fractal');

describe('CLI fractal loader', function () {
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });

  it('returns a Fractal instance', function () {
    expect(loader()).to.be.an.instanceOf(fractal.Fractal);
  });

  // it('attempts to load the fractal version from the CWD first', function () {
  //   spy = sinon.spy(() => {
  //     throw new Error('err');
  //   });
  //   mockRequire('import-cwd', function(){
  //
  //   });
  //   const loader = mockRequire.reRequire('./fractal');
  //   loader()
  //   console.log(spy.getCall(0));
  // });
});
