const debug = require('debug')('frctl:pages');
const {forEach, get} = require('lodash');
const funjucks = require('@frctl/funjucks');

const helpers  = ['permalink'];

module.exports = async function (pages, globals = {}, opts = {}, fractal) {
  debug('initialising renderer');

  const templates = get(globals, 'collections.site.templates', []);

  opts.loaders = opts.loaders || [];
  opts.loaders.push({
    getSource: function (path) {
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

  helpers.forach(name => {
    const helper = require(`./helper-${helper}`)
  })

  const rendered = pages.mapAsync(async page => {
    if (page.render) {
      debug('rendering page %s', page.permalink);
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

  debug('rendering complete');

  return rendered;
};
