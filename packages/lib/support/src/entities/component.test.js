/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Component = require('./component');
const Entity = require('./entity');

const basicComponent = {
  id: 'test-component',
  src: {
    path: '/components/@foo',
    base: '/components',
  },
  config: {
    foo: 'bar'
  }
};

const makeComponent = input => new Component(input || basicComponent);

describe('Component', function () {
  describe('constructor', function () {
    it('returns a new instance that extends the Entity class', function () {
      const component = makeComponent();
      expect(component).to.exist;
      expect(component).to.be.instanceOf(Entity);
    });
  });

  describe('.config', function () {
    it('returns a cloned configuration object', function () {
      const component = makeComponent();
      expect(component.config).to.eql(basicComponent.config);
      expect(component.config).to.not.equal(basicComponent.config);
    });
  });

});
