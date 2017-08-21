module.exports = function (opts = {}) {
  return {

    name: 'fractal-preset-core',

    config: {

      transforms: [
        require('@frctl/fractal-transform-components')
      ]
    }

  };
};
