/* eslint no-unused-expressions : "off" */
const expect = require('@frctl/utils/test').expect;
const sinon = require('sinon');

const precompileWrapper = require('../src/register/wrap/precompile');

const file = {
  role: 'view',
  engine: 'nunjucks',
  path: 'components/button/button.view.njk',
  contents: Buffer.from('<button class="button{% if modifiers %} button--{{ modifiers }}{% endif %}">{{ label }}</button>', 'utf8')
};
const fileWithMissingProps = {
  engine: 'nunjucks',
  path: 'components/button/button.view.njk',
  contents: Buffer.from('<button class="button{% if modifiers %} button--{{ modifiers }}{% endif %}">{{ label }}</button>', 'utf8')
};

function handlePrecompile(file, callback) {
  return callback(null, 'Output');
}
const precompileFunc = sinon.spy(handlePrecompile);

describe(`precompileWrapper`, function () {
  it(`should only accept correct arguments`, function () {
    function handler(...args) {
      precompileWrapper(...args);
    }
    expect(handler.bind(null)).to.throw(TypeError, `[name-invalid]`);
    expect(handler.bind(null, {})).to.throw(TypeError, `[name-invalid]`);
    expect(handler.bind(null, 'dummy', {})).to.throw(TypeError, `[precompileFunc-invalid]`);
  });
  it(`should return wrapped precompile function`, function () {
    const precompile = precompileWrapper('dummy', precompileFunc);
    expect(precompile).to.be.a('function');
  });
  it(`'s returned function should only accept correct arguments`, function () {
    const precompile = precompileWrapper('dummy', precompileFunc);

    function handler(...args) {
      precompile(...args);
    }
    expect(handler.bind(null, 'string')).to.throw(TypeError, `[file-invalid]`);
    expect(handler.bind(null, {})).to.throw(TypeError, `[file-invalid]`);
    expect(handler.bind(null, fileWithMissingProps)).to.throw(TypeError, `[file-invalid]`);
    expect(handler.bind(null, file)).to.throw(TypeError, `[done-invalid]`);
    expect(handler.bind(null, file, {})).to.throw(TypeError, `[done-invalid]`);
    expect(handler.bind(null, file, function () {})).to.not.throw(TypeError);
  });
  it(`'s returned function should call original method with provided arguments`, function (done) {
    const precompile = precompileWrapper('dummy', precompileFunc);
    const callback = function (err, result) {
      expect(precompileFunc.called).to.be.true;
      expect(err).to.equal(null);
      expect(result).to.equal('Output');
      expect(precompileFunc.calledWith(file, callback)).to.be.true;
      done();
    };
    precompile(file, callback);
  });
});
