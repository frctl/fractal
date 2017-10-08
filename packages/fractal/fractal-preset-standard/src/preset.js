module.exports = function (opts = {}) {
  return {

    name: 'fractal-preset-standard',

    config: {
      plugins: [
        require('@frctl/fractal-plugin-files-name')
      ]
    }

  };
};
