const {expect} = require('../../../test/helpers');
const tests = require('../../../test/runners/plugins')(__dirname);

const input = [{
  stem: '_foo'
}, {
  stem: '01-foo'
}, {
  stem: '_01-foo'
}, {
  stem: 'foo'
}];

tests.addPluginTest({
  description: 'sets a name property on each item',
  input: input,
  test: function (result) {
    for (const item of result) {
      expect(item.name).to.equal('foo');
    }
  }
});

tests.run();
