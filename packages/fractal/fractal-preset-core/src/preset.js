module.exports = function (opts = {}) {
  return {

    name: 'fractal-preset-core',

    config: {
      engines: [
        require('@frctl/fractal-engine-html')
      ],
      plugins: [
        require('@frctl/fractal-plugin-files-name'),
        require('@frctl/fractal-plugin-template-attrs'),
        require('@frctl/fractal-plugin-template-components'),
      ]
    }

  };
};
