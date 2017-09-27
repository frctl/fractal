module.exports = function (opts = {}) {
  return {

    name: 'cli-preset-core',

    config: {
      commands: [
        require('@frctl/cli-command-info'),
        require('@frctl/cli-command-new-project')
      ]
    }

  };
};
