/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Scenario = require('./scenario');

const defaultProps = {
  id: 'test-scenario',
  context: {
    title: 'foo'
  }
};
const makeScenario = props => new Scenario(props || defaultProps);

describe.only('Scenario', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Scenario`, function () {
      const scenario = makeScenario();
      expect(scenario).to.exist;
      expect(scenario instanceof Scenario).to.be.true;
    });
    it('throws an error on invalid props', function(){
      expect(() => makeScenario({
        foo: 'bar'
      })).to.throw(`[properties-invalid]`);
    });
  });

  describe('.id', function () {
    it('is generated from the label if not set in props');
  });

  describe('.label', function () {
    it('is generated from the id if not set in props');
  });

  describe('.context', function () {
    it('returns an empy object if not supplied in props');
  });

  describe('.isScenario()', function () {
    it('returns true if item is a Scenario and false otherwise', function () {
      const scenario = makeScenario();
      expect(Scenario.isScenario(scenario)).to.be.true;
      expect(Scenario.isScenario({})).to.be.false;
    });
  });
  describe('.[Symbol.toStringTag]', function () {
    const scenario = makeScenario();
    expect(scenario[Symbol.toStringTag]).to.equal('Scenario');
  });
});
