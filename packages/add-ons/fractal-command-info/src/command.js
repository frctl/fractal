module.exports = function infoCommand(opts = {}) {
  const defaults = {

    name: 'fractal-info',

    command: '*',

    handler(argv, app, cli) {
      // TODO: figure out a cleaner way to mark this up
      return `
        <div><dim>---</dim><br></div>
        <div>Fractal CLI version <cyan>${cli.version}</cyan><br></div>
        <div><dim>Config path:</dim> ${cli.configPath ? cli.configPath : 'No config file found'}</div>
        <div><dim>Working directory:</dim> ${cli.cwd}<br></div>
        <div>Run <cyan>${argv.$0} --help</cyan> for a list of available commands</div>
        <div><br><dim>---</dim><br></div>
      `;
    }
  };

  return Object.assign({}, defaults, opts);
};
