module.exports = function (opts = {}) {
  return {

    name: 'example-plugin',

    transform: 'files',

    handler(items) {
      return items;
    }

  };
};
