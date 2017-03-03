/* eslint no-unused-expressions : "off", handle-callback-err: "off", "no-loop-func": "off" */

const _ = require('lodash');
const expect = require('@frctl/utils/test').expect;
const sinon = require('sinon');
const File = require('@frctl/ffs').File;
const Fractal = require('../src/fractal');

describe('components API object', function () {
  let components;

  beforeEach(function (done) {
    const fractal = new Fractal({
      src: './test/fixtures/components'
    });
    fractal.parse((...args) => {
      [, components] = args;
      done();
    });
  });

  it(`is an object`, function () {
    expect(components).to.be.an('object');
  });

  describe('.getAll()', function () {
    it(`returns an array of components`, function () {
      const result = components.getAll();
      expect(result).to.be.an('array');
      for (const component of result) {
        expect(component.role).to.equal('component');
      }
    });
  });

  describe('.count()', function () {
    it(`returns the number of components`, function () {
      const result = components.getAll();
      expect(components.count()).to.equal(result.length);
    });
  });

  describe('.find()', function () {
    it(`defers to .findByName if a single string argument is supplied`, function () {
      const stub = sinon.stub(components, 'findByName');
      components.find('button');
      expect(stub.calledWith('button')).to.be.true;
    });
    it(`calls _.find using the set of all available components and the predicate if not using .findByName`, function () {
      const stub = sinon.stub(_, 'find');
      const predicate = {name: 'button'};
      components.find(predicate);
      expect(stub.calledWith(components.getAll(), predicate)).to.be.true;
      stub.restore();
    });
  });

  describe('.findByName()', function () {
    it(`throws an error if an invalid name is supplied`, function () {
      for (const invalid of [123, [], () => {}]) {
        expect(() => components.findByName(invalid)).to.throw(TypeError, '[name-invalid]');
      }
    });
    it(`returns undefined if no components have a matching name`, function () {
      const result = components.findByName('foobar');
      expect(result).to.be.undefined;
    });
    it(`returns a component when a match is found`, function () {
      const result = components.findByName('button');
      expect(result).to.be.an('object');
      expect(result.role).to.equal('component');
      expect(result.name).to.equal('button');
    });
  });

  describe('.getViewsFor()', function () {
    it(`accepts a component name as the first argument`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        expect(components.getViewsFor('button')).to.be.an('array');
        done();
      });
    });
    it(`accepts a component object as the first argument`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        const button = components.find('button');
        expect(components.getViewsFor(button)).to.be.an('array');
        done();
      });
    });
    it(`returns an array of views`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        const views = components.getViewsFor('button');
        expect(views).to.be.an('array');
        for (const view of views) {
          expect(view).to.be.instanceof(File);
          expect(view.role).to.equal('view');
        }
        done();
      });
    });
    it(`throws an error if the component is not found`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        expect(() => components.getViewsFor('sdfsdfsdf')).to.throw(Error, '[component-not-found]');
        done();
      });
    });
  });

  describe('.getViews()', function () {
    it(`defers to the files API .filterByRole method` /* , function (done) {
      getInstanceWithAdapter().parse((err, components, files) => {
        const stub = sinon.stub(files, 'filterByRole');
        expect(stub.calledWith('view')).to.be.true;
        stub.restore();
        done();
      });
    } */);
  });

  describe('.findView()', function () {
    it(`throws an error if no adapters have been registered`, function () {
      expect(() => components.findView('button')).to.throw(Error, '[no-adapters]');
      expect(() => components.findView('button', 'nunjucks')).to.throw(Error, '[no-adapters]');
    });
    it(`accepts a component name as the first argument`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        expect(components.findView('button')).to.be.an('object');
        expect(components.findView('button').role).to.equal('view');
        done();
      });
    });
    it(`accepts a component object as the first argument`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        const button = components.find('button');
        expect(components.findView(button)).to.be.an('object');
        expect(components.findView(button).role).to.equal('view');
        done();
      });
    });
    it(`returns undefined if no view is found`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        expect(components.findView('asdasd', 'nunjucks')).to.be.undefined;
        expect(components.findView('button', 'asdasd')).to.be.undefined;
        done();
      });
    });
    it(`returns a matching view if found`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        expect(components.findView('button', 'nunjucks')).to.be.an('object');
        expect(components.findView('button', 'nunjucks').role).to.equal('view');
        expect(components.findView('button')).to.be.an('object');
        expect(components.findView('button').role).to.equal('view');
        done();
      });
    });
  });

  describe('.renderView()', function () {
    it(`throws an error if no adapters have been registered`, function () {
      expect(() => components.renderView(new File({path: '/doo/bar.njk'}), {}, () => {})).to.throw(Error, '[no-adapters]');
    });
    it(`throws an error if incorrect arguments are supplied`, function (done) {
      getInstanceWithAdapter().parse((err, components) => {
        const view = components.findView('button');
        expect(() => components.renderView({})).to.throw(TypeError, '[view-invalid]');
        expect(() => components.renderView(view, 'asdasd')).to.throw(TypeError, '[context-invalid]');
        expect(() => components.renderView(view, {}, 123)).to.throw(TypeError, '[callback-invalid]');
        done();
      });
    });
  });
});

function getInstanceWithAdapter() {
  const fractal = new Fractal({
    src: './test/fixtures/components'
  });
  fractal.addAdapter('nunjucks');
  return fractal;
}
