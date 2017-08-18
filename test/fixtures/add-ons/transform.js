module.exports = function (opts = {}) {
  return {

    name: 'example-transform',

    transform(items) {
      return items;
    }

  };
};
