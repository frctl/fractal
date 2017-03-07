const expect = require('@frctl/utils/test').expect;
const plugins = require('./files').plugins;

module.exports = {

  testSignature(pluginName) {
    const adapter = (pluginName === 'adapter') ? {name: 'adapter', render: () => {}} : {};
    const plugin = plugins[pluginName](adapter);
    expect(plugin.length).to.equal(2);
  },

  testPlugin(plugin, input, expected, done) {
    plugin(input, function () {
      expect(input).to.deep.equal(expected);
      done();
    });
  },

  testFactory(pluginFactory) {
    expect(pluginFactory).to.be.a('function');
  }
};
