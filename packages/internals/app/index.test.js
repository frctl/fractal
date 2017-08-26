const {expect} = require('../../../test/helpers');
const App = require('./src/app');
const main = require('.');

describe('main', function () {
  it('exports the App class', function () {
    expect(main).to.equal(App);
  });
});
