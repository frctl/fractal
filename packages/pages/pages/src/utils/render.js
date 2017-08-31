const {forEach, get} = require('lodash');
const funjucks = require('@frctl/funjucks');

module.exports = async function(pages, globals = {}, opts = {}, fractal){

  const templates = get(globals, 'collections.site.templates', []);

  opts.loaders = opts.loaders || [];
  opts.loaders.push({
    getSource: function(path) {
      const file = templates.find(file => file.relative === path);
      if (file) {
        return {
          src: file.contents.toString(),
          path: file.permalink,
          noCache: true
        };
      }
    }
  });

  const env = funjucks(fractal, opts);
  forEach(globals, (value, key) => env.addGlobal(key, value));

  return pages.mapAsync(async page => {
    if (page.render) {
      let contents;
      if (page.engine) {
        contents = await fractal.renderString(page.contents.toString(), page.data, {adapter: page.engine});
      } else {
        contents = await env.renderString(page.contents.toString(), {page, target: page.target, [page.targetAlias]: page.target});
      }
      page.contents = Buffer.from(contents);
    }
    return page;
  });

};
