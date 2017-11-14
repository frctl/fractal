const nunjucks = require('nunjucks');

module.exports = function () {
  return {

    name: 'linkTo',

    helper: function (...args) {
      const page = this.env.pages.find(...args);
      if (!page || !page.permalink) {
        throw new Error(`Could not generate permalink for page`);
      }

      return new nunjucks.runtime.SafeString(`<a href="${page.permalink}">${page.label || page.title}</a>`);
    }
  };
};
