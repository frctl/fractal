module.exports = function (opts = {}) {
  return {

    name: 'pages',

    commands: [
      require('./src/commands/info')(opts)
    ]

  };
};
