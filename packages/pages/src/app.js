const {join} = require('path');
const App = require('@frctl/app');
const Renderer = require('@frctl/renderer');
const {EmittingPromise} = require('@frctl/support');
const {permalinkify} = require('@frctl/utils');
const {Fractal} = require('@frctl/fractal');
const debug = require('debug')('frctl:pages');
const {assert} = require('check-types');
const Config = require('./config/store');
const engine = require('./engine');
const clean = require('./utils/clean');
const write = require('./utils/write');

const _fractal = new WeakMap();

class Pages extends App {

  constructor(fractal, config = {}) {
    assert.string(config.dest, `Pages.constructor: You must provide a 'dest' value in your pages configuration to specify the output directory [dest-missing]`);
    assert.instance(fractal, Fractal, `Pages.constructor: You must provide a Fractal instance [fractal-invalid]`);
    super(new Config(config));
    _fractal.set(this, fractal);
    this.debug('instantiated new Pages instance');
  }

  build(opts = {}) {
    let filter = () => true;

    if (Array.isArray(opts.filter)) {
      this.debug(`Building pages: ${opts.filter.join(',')}`);
      const permalinks = opts.filter.map(url => permalinkify(url));
      filter = page => permalinks.includes(page.permalink);
    }

    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const collections = await this.getCollections(emitter);
        const pages = collections.site.pages.filter(filter);
        const rendered = await this.renderPages(pages, collections, opts, emitter);

        if (opts.write) {
          const dest = opts.dest || this.get('dest');
          if (this.get('clean')) {
            this.debug(`cleaning ${dest}`);
            await clean(dest, this.get('clean'));
          }
          this.debug(`writing pages to ${dest}`);
          await write(dest, rendered.map(file => {
            file.path = join(dest, file.permalink);
            file.base = dest;
            return file;
          }));
        }

        resolve(rendered);
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  async getCollections(emitter = {emit: () => {}}) {
    if (this.fractal.dirty) {
      this.dirty = true;
    }
    const parserOutput = [this.fractal, this].map(app => app.parse({emitter}));
    const [library, site] = await Promise.all(parserOutput);
    return {library, site};
  }

  getRenderer({site, library}) {
    const pagesEngine = engine(this.get('engine'), {
      fractal: this.fractal,
      components: library.components,
      pages: site.pages,
      collections: {site, library}
    });

    pagesEngine.env.addGlobal('site', this.get('site'));

    return new Renderer([
      pagesEngine,
      ...this.fractal.get('engines')
    ]);
  }

  async renderPages(pages, collections, opts = {}, emitter = {emit: () => {}}) {
    const renderer = this.getRenderer(collections);

    return pages.mapToArrayAsync(async page => {
      const file = page.toFile();
      file.permalink = page.permalink;
      if (page.render) {
        this.debug('rendering page %s', page.permalink);

        const engine = page.engine || 'pages';

        const context = {
          [page.targetAlias]: page.target,
          page,
          target: page.target
        };

        const contents = await renderer.render(page.contents.toString(), context, {
          engine,
          components: collections.library.components,
          templates: collections.site.files
        });

        file.contents = Buffer.from(contents);
      }
      return file;
    });
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get fractal() {
    return _fractal.get(this);
  }

  get version() {
    return Pages.version;
  }

  get [Symbol.toStringTag]() {
    return 'Pages';
  }

}

Pages.version = require('../package.json').version;

module.exports = Pages;
