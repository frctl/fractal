const Router = require('koa-router');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../../test/helpers');
const router = require('./index');

const app = new Fractal();

describe('Server router', function () {
  it('exports a function', function () {
    expect(router).to.be.a('function');
  });

  it('returns a Koa Router instance', function () {
    expect(router(app)).to.be.an.instanceOf(Router);
  });

  it('binds all the expected routes');
  it('adds the Fractal instance to the shared ctx object');
});
