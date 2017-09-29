/* eslint no-unused-expressions: "off" */
const fractal = require('@frctl/fractal');
const {FileCollection} = require('@frctl/support');
// const {FileCollection, Component} = require('@frctl/support');
// const {defaultsDeep} = require('@frctl/utils');
const {expect} = require('../../../../test/helpers');
const componentTransform = require('./transform');

const items = [{
  cwd: '/',
  path: 'path/to/fake/@a-component',
  stat: {
    isNull: () => true,
    isDirectory: () => true
  }
},
{
  cwd: '/',
  path: 'path/to/fake/@a-component/view.hbs',
  contents: new Buffer('VIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@a-component/preview.hbs',
  contents: new Buffer('PREVIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/@nested-component',
  stat: {
    isNull: () => true,
    isDirectory: () => true
  }
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/@nested-component/view.hbs',
  contents: new Buffer('VIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/@nested-component/preview.hbs',
  contents: new Buffer('PREVIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/@nested-component/config.js',
  contents: new Buffer(`module.exports = {name: 'config.js', foo: 'bar'}`)
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/',
  stat: {
    isNull: () => true,
    isDirectory: () => true
  }
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/view.hbs',
  contents: new Buffer('VIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/preview.hbs',
  contents: new Buffer('PREVIEW')
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/config.js',
  contents: new Buffer(`module.exports = {name: 'config.js', foo: 'bar'}`)
},
{
  cwd: '/',
  path: 'path/to/fake/@b-component/config.json',
  contents: new Buffer(`{name: 'config.json', bar: 'baz'}`)
},
{
  cwd: '/',
  path: 'path/to/fake/some.png',
  contents: new Buffer([8, 6, 7, 5, 3, 0, 9])
}
];

const getFileCollection = () => {
  return FileCollection.from(items);
};

const app = fractal();

describe('Component Transform', function () {
  describe('factory', function () {
    it('is exported as a function', function () {
      expect(componentTransform).to.be.a('function');
    });
    it('returns a valid transform object', function () {
      const transform = componentTransform();
      expect(transform).to.be.an('object');
      expect(transform).to.have.a.property('name').that.is.a('string');
      expect(transform).to.not.have.a.property('passthru');
      expect(transform).to.have.a.property('transform').that.is.a('function');
    });
  });
  describe('.transform()', function () {
    it('transforms a FileCollection into a ComponentCollection', async function () {
      const fileCollection = getFileCollection();
      const transform = componentTransform().transform;
      const output = await transform(fileCollection, {}, app);
      expect(output).to.be.a('ComponentCollection');
      expect(output).to.have.property('length').that.equals(3);
    });
    // it('instantiates the component with config merged from the config files and the default components config', async function () {
    //   const spy = sinon.spy(Component, 'from');
    //   const fileCollection = FileCollection.from(items.slice(1));
    //   const transform = componentTransform().transform;
    //   const defaults = app.get('components.config.defaults');
    //   await transform(fileCollection, {}, app);
    //   expect(spy.args[1][0].config).to.eql(defaultsDeep({name: 'config.js', bar: 'baz', foo: 'bar'}, defaults));
    //   spy.restore();
    // });
  });
});
