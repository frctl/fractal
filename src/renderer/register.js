const check = require('check-types');
const adapterPlugin = require('./plugin');

const assert = check.assert;

const fileDuck = {adapter: 'adapter', role: 'role', contents: Buffer.from('')};

module.exports = function register(adapter, fractal) {
  fractal.addPlugin(adapterPlugin({
    name: adapter.name,
    match: adapter.match
  }), 'files');

  fractal.addMethod(`render.${adapter.name}`, renderWrapper(adapter.name, adapter.render));

  return adapter;
};

function renderWrapper(name, renderFunc) {
  assert.string(name, `The render wrapper requires a 'name' argument of type string [name-invalid]`);
  assert.function(renderFunc, `The render wrapper requires a 'renderFunc' argument of type function [renderFunc-invalid]`);
  return function (file, context, done) {
    assert.object(file, `'${name}.render' requires a 'file' argument of type Object with the following properties: [role, contents, engine] [file-invalid]`);
    assert.like(file, fileDuck, `'${name}.render' requires a 'file' argument of type Object with the following properties: [role, contents, engine] [file-invalid]`);
    assert.object(context, `'${name}.render' requires a 'context' argument of type Object [context-invalid]`);
    assert.function(done, `'${name}.render' requires a 'done' callback [done-invalid]`);
    return renderFunc(file, context, done);
  };
}
