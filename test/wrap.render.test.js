/* eslint no-unused-expressions : "off" */
const expect = require('@frctl/utils/test').expect;
const sinon = require('sinon');

const renderWrapper = require('../src/register/wrap/render');

const file = {
  role: 'view',
  engine: 'nunjucks',
  path: 'components/button/button.view.njk',
  contents: Buffer.from('<button class="button{% if modifiers %} button--{{ modifiers }}{% endif %}">{{ label }}</button>', 'utf8')
};

function handleRender(file, context, callback) {
  return callback(null, 'Output');
}
const renderFunc = sinon.spy(handleRender);

describe(`renderWrapper`, function () {
  it(`should only accept correct arguments`, function () {
    function handler(...args) {
      renderWrapper(...args);
    }
    expect(handler.bind(null)).to.throw(TypeError, `[name-invalid]`);
    expect(handler.bind(null, {})).to.throw(TypeError, `[name-invalid]`);
    expect(handler.bind(null, 'dummy', {})).to.throw(TypeError, `[renderFunc-invalid]`);
  });
  it(`should return wrapped render function`, function () {
    const render = renderWrapper('dummy', renderFunc);
    expect(render).to.be.a('function');
  });
  it(`'s returned function should only accept correct arguments`, function () {
    const render = renderWrapper('dummy', renderFunc);

    function handler(...args) {
      render(...args);
    }
    expect(handler.bind(null, 'string')).to.throw(TypeError, `[file-invalid]`);
    expect(handler.bind(null, {})).to.throw(TypeError, `[file-invalid]`);
    expect(handler.bind(null, file)).to.throw(TypeError, `[context-invalid]`);
    expect(handler.bind(null, file, 'context')).to.throw(TypeError, `[context-invalid]`);
    expect(handler.bind(null, file, {})).to.throw(TypeError, `[done-invalid]`);
    expect(handler.bind(null, file, {}, 'string')).to.throw(TypeError, `[done-invalid]`);
    expect(handler.bind(null, file, {}, function () {})).to.not.throw(TypeError);
  });
  it(`'s returned function should call original method with provided arguments`, function (done) {
    const render = renderWrapper('dummy', renderFunc);
    const context = {};
    const callback = function (err, result) {
      expect(renderFunc.called).to.be.true;
      expect(err).to.equal(null);
      expect(result).to.equal('Output');
      expect(renderFunc.calledWith(file, context, callback)).to.be.true;
      done();
    };
    render(file, context, callback);
  });
});
