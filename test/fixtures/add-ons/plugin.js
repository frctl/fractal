module.exports = function (opts = {}) {
  return {

    name: 'example-plugin',

    handler(items) {
      return items;
    }

  };
};
