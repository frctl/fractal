module.exports = function (opts = {}) {
  return {

    name: 'fractal-preset-core',

    config: {
      plugins: [
        require('@frctl/fractal-plugin-files-name')
      ]
    }

  };
};
