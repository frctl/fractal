const { join } = require('path');
const { mock } = require('sinon');

/* eslint no-unused-expressions: off */

const { Fractal } = require('@frctl/fractal');
const { expect, sinon } = require('../../../test/helpers');
const ComponentResolver = require('./index');

const app = new Fractal({ src: join(__dirname, '../fixtures/components') });
const mockResolverAPI = {
  plugin: function (target, callback) { },
  doResolve: function (types, request, message, callback) { }
};
let components;

describe.only('component resolver webpack plugin', function () {
  before(async function () {
    components = await app.getComponents();
  });
  it('sets the provided components', function () {
    const componentResolver = newResolver();
    expect(componentResolver.components).to.equal(components);
  });
  describe('apply', function () {
    it('outputs the correct values for a given component request', function () {
      const testRequests = ['button/button.js', 'card/card.css'];
      const componentResolver = newResolver();
      testRequests.forEach(runComponentTest);
    });
    it('defers to its callback when non-component, relative, or absolute requests made', function () {
      const testRequests = ['module/index.js', './button/button.js', '.', '/root/path/button.js'];
      const componentResolver = newResolver();
      testRequests.forEach(runNonComponentTest);
    });
  });
});

function newResolver() {
  return new ComponentResolver({ components });
}


function expectedRequest(testPath) {
  return {
    file: true,
    path: join(__dirname, `../fixtures/components/@${testPath}`),
    resolved: true
  }
}

function expectedMessage(testPath) {
  return `expanded component path "${testPath}" to "${join(__dirname, `../fixtures/components/@${testPath}`)}"`;
}

function runComponentTest(testRequest) {
  const componentResolver = newResolver();
  const callbackSpy = sinon.spy();
  const pluginStub = sinon.stub(mockResolverAPI, 'plugin').yields({ request: testRequest }, callbackSpy);
  const doResolveSpy = sinon.spy(mockResolverAPI, 'doResolve');

  componentResolver.apply(mockResolverAPI);

  sinon.assert.calledWith(pluginStub, 'module', sinon.match.func);
  sinon.assert.calledWith(doResolveSpy, 'file',
    sinon.match(expectedRequest(testRequest)),
    expectedMessage(testRequest),
    callbackSpy
  );
  sinon.assert.notCalled(callbackSpy);

  pluginStub.restore();
  doResolveSpy.restore();
}

function runNonComponentTest(testRequest) {
  const componentResolver = newResolver();
  const callbackSpy = sinon.spy();
  const pluginStub = sinon.stub(mockResolverAPI, 'plugin').yields({ request: testRequest }, callbackSpy);
  const doResolveSpy = sinon.spy(mockResolverAPI, 'doResolve');

  componentResolver.apply(mockResolverAPI);

  sinon.assert.calledWith(pluginStub, 'module', sinon.match.func);
  sinon.assert.notCalled(doResolveSpy);
  sinon.assert.calledOnce(callbackSpy);

  pluginStub.restore();
  doResolveSpy.restore();
}
