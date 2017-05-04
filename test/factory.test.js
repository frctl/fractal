/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const _ = require('lodash');
const expect = require('@frctl/utils/test').expect;
const Fractal = require('../src/fractal');
const factory = require('../.');

describe('Fractal instance factory', function () {
  it(`returns a Fractal instance`, function () {
    expect(factory({})).to.be.instanceof(Fractal);
  });
});
