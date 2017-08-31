const {forEach} = require('lodash');
const funjucks = require('@frctl/funjucks');

module.exports = async function(pages, globals = {}, opts = {}, fractal){

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
