const tildify = require('tildify');

module.exports = function infoCommand(opts = {}) {
  const defaults = {

    name: 'fractal-info',

    command: '*',

    handler(argv, app, cli) {
      const commands = cli.getCommands().filter(cmd => cmd.description);

      let commandList = '';
      if (commands.length > 0) {
        commandList = `<br><dim>Available commands:</dim><br><br>`;
        commandList += `${commands.map(cmd => `<dim>$</dim> <yellow>${argv.$0} ${cmd.command}</yellow> - ${cmd.description}`).join('<br>')}<br>`;
      }

      return `
        &nbsp;
        <hr>

        <green>Fractal CLI <dim>v${cli.version}</dim></green>

        <dim>CWD:</dim> ${tildify(cli.cwd)}
        <dim>Config path:</dim> ${cli.configPath ? tildify(cli.configPath) : 'No config file found'}
        ${commandList}
        <dim>Run <reset><cyan>${argv.$0} --help</cyan></reset> for full details on available commands and options.</dim>

        <hr>
        &nbsp;
      `;
    }
  };

  return Object.assign({}, defaults, opts);
};
