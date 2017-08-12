module.exports = function corePreset(opts = {}) {
  return {

    name: 'fractal-core',

    config: {

      commands: [
        require('@frctl/fractal-command-info')
      ]

    }

  };
};
