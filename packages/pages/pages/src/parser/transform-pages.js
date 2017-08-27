const {Collection} = require('@frctl/support');

module.exports = function (opts = {}) {
  return {

    name: 'pages',

    transform(files, {templates, assets}, app) {

      return Collection.from([]);
    }
  };
};
