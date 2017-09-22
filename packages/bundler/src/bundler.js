const {FileCollection} = require('@frctl/support');
const {Parser} = require('@frctl/parser');

const _apps = new WeakMap();
const _assets = new WeakMap();

class Bundler {
  constructor(app, opts={}) {
    _apps.set(this, app);
    // FIXME: obvs needs refinement/rethinking, quick & dirty for now
    const assets = ((opts.assets && opts.assets.match) || app.get('components.config.defaults.assets.match'))
    console.log(assets);
    _assets.set(this, assets);
  }

  async generate() {
    const app = _apps.get(this);
    const result = await app.parse();

    return result;
  }

  async getAssets() {
    // No emitting for now
    const app = _apps.get(this);
    const globalAssetsMatch = _assets.get(this);
    const components = await app.getComponents();
    const files = await app.getFiles();
    const componentFiles = components.map(component=>component.getFiles()).toArray();
    const componentAssets = components.reduce((acc,component)=>{
      const files = component.getAssets().toArray();
      console.log(1, files);
      try {
        if (files && files.length) acc = acc.concat(files);
      } catch (err) {
        console.log(err);
      }

      return acc;
    }, new FileCollection());
    console.log(2, componentAssets);

    const orphanedAssetFiles = files
      .reject(file => componentFiles.includes(files) || file.isDirectory())
      .filter(globalAssetsMatch);

    console.log(3, orphanedAssetFiles);
    return orphanedAssetFiles.concat(componentAssets);
  }

  getParser() {
    return new Parser({
      src: _assets.get(this)});
  }
}

module.exports = Bundler;
