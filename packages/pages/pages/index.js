module.exports = function (opts = {}) {
  return {

    name: 'pages',

    commands: [
      require('./src/commands/info')(opts),
      require('./src/commands/serve')(opts),
      require('./src/commands/build')(opts)
    ]

  };
};
