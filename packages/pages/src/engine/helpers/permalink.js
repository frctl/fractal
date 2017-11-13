module.exports = function () {
  return {

    name: 'permalink',

    helper: function (...args) {
      const page = this.env.pages.find(...args);
      if (!page || !page.permalink) {
        throw new Error(`Could not generate permalink for page`);
      }
      return page.permalink;
    }
  };
};
