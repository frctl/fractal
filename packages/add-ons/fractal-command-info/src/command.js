const tildify = require('tildify');

module.exports = function infoCommand(opts = {}) {
  const defaults = {

    name: 'fractal-info',

    command: '*',

    handler(argv, app, cli) {
      return `
        &nbsp;
        <hr>

        <green>Fractal CLI <dim>v${cli.version}</dim></green>

        <dim>CWD:</dim> ${tildify(cli.cwd)}
        <dim>Config path:</dim> ${cli.configPath ? tildify(cli.configPath) : 'No config file found'}

        <dim>Run <reset><cyan>${argv.$0} --help</cyan></reset> for a list of available commands.</dim>

        <hr>
        &nbsp;
      `;
    }
  };

  return Object.assign({}, defaults, opts);
};
