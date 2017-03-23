/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const _ = require('lodash');
const expect = require('@frctl/utils/test').expect;
const Fractal = require('../src/fractal');
const factory = require('../.');

const adapterObject = {
  name: 'test',
  match: '.test',
  render() {}
};

describe('Fractal instance factory', function () {
  it(`returns a Fractal instance`, function () {
    expect(factory({})).to.be.instanceof(Fractal);
  });

  it(`converts adapter references into valid adapter objects`, function () {
    const specs = [
      [
        'nunjucks',
        adapterObject,
        './test/fixtures/packages/adapter'
      ],
      {
        nunjucks: {},
        test: adapterObject,
        './test/fixtures/packages/adapter': {}
      }
    ];

    for (let adapters of specs) {
      const adapterCount = _.values(adapters).length;
      const fractal = factory({
        adapters: adapters
      });
      expect(fractal.adapters.length).to.equal(adapterCount);
      expect(hasAdapter(fractal, 'nunjucks')).to.be.true;
      expect(hasAdapter(fractal, 'test')).to.be.true;
      expect(hasAdapter(fractal, 'faux-adapter')).to.be.true;
    }
  });

  it(`converts plugin references into valid plugin objects`, function () {
    const fractal = factory({
      plugins: {
        files: [
          './test/fixtures/packages/plugin',
          function anotherTestPlugin() {}
        ],
        components: {
          './test/fixtures/packages/plugin': {},
          anotherTestPlugin: function () {}
        }
      }
    });
    expect(hasPlugin(fractal.files.parser, 'testPlugin')).to.be.true;
    expect(hasPlugin(fractal.files.parser, 'anotherTestPlugin')).to.be.true;
    expect(hasPlugin(fractal.components.parser, 'testPlugin')).to.be.true;
    expect(hasPlugin(fractal.components.parser, 'anotherTestPlugin')).to.be.true;
  });
});

function hasAdapter(fractal, adapterName) {
  return Boolean(fractal.adapters.find(a => a.name === adapterName));
}

function hasPlugin(parser, pluginName) {
  return Boolean(parser.plugins.find(p => p.name === pluginName));
}
