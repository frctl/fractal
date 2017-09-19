const EventEmitter = require('events');
const {File} = require('@frctl/support');
const {toArray} = require('@frctl/utils');
const {expect, sinon} = require('../../../../test/helpers');
const Adapter = require('./adapter');
const Renderer = require('./renderer');

const adapters = [{
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
}, {
  name: 'fwig',
  match: '.fig',
  render: () => Promise.resolve('the rendered string')
}];

const funjucksFile = new File({
  path: 'path/to/file.fjk',
  contents: Buffer.from('asdasd')
});

function makeRenderer(adapter = []) {
  return new Renderer(toArray(adapter));
}

describe('Renderer', function () {
  describe('constructor', function () {
    it('adds adapters if provided', function () {
      const renderer = new Renderer();
      expect(renderer.adapters.length).to.equal(0);
      const renderer2 = new Renderer(adapters);
      expect(renderer2.adapters.length).to.equal(2);
    });
  });

  describe('.addAdapter()', function () {
    it('adds a single adapter', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      expect(renderer.adapters.length).to.equal(1);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
    });
    it('adds an array of adapters', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters);
      expect(renderer.adapters.length).to.equal(adapters.length);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
      expect(renderer.adapters[1].name).to.equal(adapters[1].name);
    });
    it('wraps all adapter objects in Adapter instances', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters);
      for (const adapter of renderer.adapters) {
        expect(adapter).to.be.instanceOf(Adapter);
      }
    });
    it('pushes adapters onto the end of the stack', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      renderer.addAdapter(adapters[1]);
      expect(renderer.adapters[1].name).to.equal(adapters[1].name);
    });
    it('replaces previously added adapters that have the same name', async function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters);
      expect(renderer.adapters.length).to.equal(adapters.length);
      renderer.addAdapter({
        name: 'funjucks',
        match: '.foo',
        render() {
          return Promise.resolve('override');
        }
      });
      expect(renderer.adapters.length).to.equal(adapters.length);
      const adapter = renderer.adapters.find(adapter => adapter.name === 'funjucks');
      expect(await adapter.render(funjucksFile.contents.toString())).to.equal('override');
    });
    it('returns the renderer instance', function () {
      const renderer = makeRenderer();
      expect(renderer.addAdapter(adapters)).to.equal(renderer);
    });
  });

  describe('.getDefaultAdapter()', function () {
    it('returns the first adapter', function () {
      const renderer = makeRenderer(adapters);
      expect(renderer.getDefaultAdapter().name).to.equal(adapters[0].name);
    });
  });

  describe('.getAdapter()', function () {
    it('finds an adapter by name', function () {
      const renderer = makeRenderer(adapters);
      expect(renderer.getAdapter('funjucks')).to.be.instanceOf(Adapter);
      expect(renderer.getAdapter('funjucks').name).to.equal('funjucks');
    });
  });

  describe('.getAdapterFor()', function () {
    it('returns the first adapter that matches the file provided', function () {
      const renderer = makeRenderer(adapters);
      renderer.addAdapter({
        name: 'funjucks2',
        match: '.fjk',
        render: () => Promise.resolve('take 2')
      });
      expect(renderer.getAdapterFor(funjucksFile).name).to.equal(adapters[0].name);
    });
    it('returns undefined if no matching adapter can be found', function () {
      const renderer = makeRenderer(adapters);
      expect(renderer.getAdapterFor(new File({path: 'foo.bar'}))).to.equal(undefined);
    });
    it('throws an error if a File instance or path is not provided', function () {
      const renderer = makeRenderer(adapters);
      expect(() => renderer.getAdapterFor({})).to.throw('[matcher-invalid]');
      expect(() => renderer.getAdapterFor()).to.throw('[matcher-invalid]');
    });
  });

  describe('.render()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer(adapters);
      const result = renderer.render('foo');
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
    it('calls the adapter render method with the expected arguments', async function () {
      const renderSpy = sinon.spy(adapters[0], 'render');
      const renderer = new Renderer();
      const context = {};
      const opts = {
        collections: {}
      };
      renderer.addAdapter(adapters);
      const result = await renderer.render('foo', context, opts);
      expect(renderSpy.calledWith('foo', context, opts)).to.equal(true);
      expect(result).to.equal(await adapters[0].render('foo', context, opts));
      renderSpy.restore();
    });
    it('calls start and end events on an emitter if provided', function () {
      let counter = 0;
      const emitter = new EventEmitter();
      emitter.on('render.start', props => {
        counter++;
        expect(props).to.have.all.keys(['tpl', 'adapter', 'opts', 'context']);
      });
      emitter.on('render.complete', props => {
        counter++;
        expect(props).to.have.all.keys(['result', 'tpl', 'adapter', 'opts', 'context']);
      });
      return makeRenderer(adapters).render('foo', {}, {adapter: 'funjucks'}, emitter).then(() => {
        expect(counter).to.equal(2);
      });
    });
    it('rejects if no matching adapter can be found', function () {
      return expect(makeRenderer().render('foo')).to.be.rejectedWith('[adapter-not-found]');
    });
    it('rejects if the template is not a string', function () {
      return expect(makeRenderer(adapters).render({foo: 'bar'})).to.be.rejectedWith('[template-invalid]');
    });
    it('rejects if no template is provided', function () {
      return expect(makeRenderer(adapters).render(undefined)).to.be.rejectedWith('[template-invalid]');
    });
    it('rejects if invalid context is supplied', function () {
      return expect(makeRenderer(adapters).render('foo', 'not an object')).to.be.rejectedWith('[context-invalid]');
    });
    it('rejects if invalid options are supplied', function () {
      return expect(makeRenderer(adapters).render('foo', {}, 'not an options object')).to.be.rejectedWith('[opts-invalid]');
    });
  });

  describe('.adapters', function () {
    it('returns the array of adapters', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      expect(renderer.adapters).to.be.an('array');
      expect(renderer.adapters.length).to.equal(1);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
    });
  });
});
