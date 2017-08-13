const {remove} = require('lodash');
const {File} = require('@frctl/support');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('fractal:renderer:adapters');
const adapter = require('./adapter');

const _adapters = new WeakMap();

class AdapterStore {

  constructor(adapters = []) {
    _adapters.set(this, []);
    this.add(adapters);
  }

  getDefaultAdapter() {
    return this.adapters[0];
  }

  getAdapterFor(file) {
    if (!File.isFile(file)) {
      throw new Error('Can only retrieve adapters for File objects [file-invalid]');
    }
    debug('Finding adapter for file %s: ', file.path);
    for (const adapter of _adapters.get(this)) {
      if (adapter.match(file)) {
        return adapter;
      }
    }
  }

  add(items) {
    const adapters = _adapters.get(this);
    toArray(items).map(props => adapter(props)).forEach(adapter => {
      const removed = remove(adapters, item => item.name === adapter.name);
      if (removed.length > 0) {
        debug('Removed exisiting adapter: %s', removed.map(adapter => adapter.name).join(', '));
      }
      adapters.push(adapter);
      debug('Added adapter: %o', adapter);
    });
    return this;
  }

  get adapters() {
    return _adapters.get(this).slice(0);
  }

}

module.exports = AdapterStore;
