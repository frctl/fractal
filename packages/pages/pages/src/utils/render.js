const debug = require('debug')('frctl:pages');

module.exports = function (pages, env) {
  return pages.mapToArrayAsync(async page => {
    const file = page.toFile();
    file.permalink = page.permalink;
    if (page.render) {
      debug('rendering page %s', page.permalink);
      let contents;
      // if (page.engine) {
      //   contents = await fractal.render(page.contents.toString(), page.data, {adapter: page.engine});
      // } else {
      contents = await env.renderString(page.contents.toString(), {
        page,
        target: page.target,
        [page.targetAlias]: page.target
      });
      // }
      file.contents = Buffer.from(contents);
    }
    return file;
  });
};
