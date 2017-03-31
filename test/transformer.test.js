/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const fs = require('@frctl/ffs');
const expect = require('@frctl/utils/test').expect;
const transformer = require('../src/parser/transformer');

const files = [
  new fs.File({
    path: 'path/to/@component',
    isDirectory: true
  }),
  new fs.File({
    path: 'path/to/@component/view.njk'
  })
];

describe('files -> components transformer', function () {
  it(`is a function`, function () {
    expect(transformer).to.be.a('function');
  });

  it(`throws an error on invalid input`, function () {
    expect(() => transformer([])).to.not.throw(TypeError, `[files-invalid]`);
    expect(() => transformer(files)).to.not.throw(TypeError, `[files-invalid]`);
    expect(() => transformer('oo')).to.throw(TypeError, `[files-invalid]`);
  });

  it(`returns an array of components`, function () {
    const components = transformer(files);
    expect(components).to.be.an('array');
    for (const component of components) {
      expect(component.path).to.be.a('string');
      expect(component.name).to.be.a('string');
      expect(component.label).to.be.a('string');
      expect(component.role).to.equal('component');
      expect(component.label).to.be.a('string');
      expect(component.files).to.be.an('array');
      for (const file of component.files) {
        expect(file).to.be.an.instanceof(fs.File);
      }
    }
  });
});
