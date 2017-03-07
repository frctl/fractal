/* eslint-disable no-unused-expressions, import/no-dynamic-require */
const expect = require('@frctl/utils/test').expect;

module.exports = function (type) {
  const plugins = require('./files')(type);

  return {
    testSignature(pluginName, done, options = {}) {
      const plugin = plugins.getPlugin(pluginName)(options);
      expect(plugin).to.be.a('function');
      if (plugin.length === 1) {
        const result = plugin([]);
        expect(result).to.exist;
        expect(result.then).to.be.a('function');
        done();
      } else {
        expect(plugin.length).to.equal(2);
        const result = plugin([], done);
        expect(result).to.not.exist;
      }
    },

    testPlugin(plugin, input, expected, done) {
      const complete = () => {
        expect(input).to.deep.equal(expected);
        done();
      };
      if (plugin.length === 2) {
        return plugin(input, complete);
      } else if (plugin.length === 1) {
        return plugin(input)
          .then(complete)
          .catch(done);
      }
      complete();
    },

    testFactory(pluginFactory) {
      expect(pluginFactory).to.be.a('function');
    }
  };
};
