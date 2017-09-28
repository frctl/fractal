const {relative} = require('path');
const tildify = require('tildify');

module.exports = function infoCommand() {
  return {

    name: 'fractal-info',

    command: '*',

    handler(argv, app, cli) {
      const commands = cli.getCommands().filter(cmd => cmd.description);

      let commandList = '';
      if (commands.length > 0) {
        commandList = `<br><dim>Available commands:</dim><br><br>`;
        commandList += `${commands.map(cmd => `<cyan> ${argv.$0} ${cmd.command}</cyan> - ${cmd.description}`).join('<br>')}<br>`;
      }

      const configPath = cli.configPath ? relative(cli.cwd, cli.configPath) : null;

      return `
        <green>Fractal CLI <dim>v${cli.version}</dim></green>

        <dim>CWD:</dim> ${tildify(cli.cwd)}
        ${cli.configPath ? `<dim>Using config from</dim> ${configPath}` : '<dim>No config file found</dim>'}
        ${commandList}
        <dim>Run <reset><cyan>${argv.$0} --help</cyan></reset> for full details on available commands and options.</dim>
      `;
    }
  };
};
