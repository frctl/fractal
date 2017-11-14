
module.exports = function infoCommand() {
  return {

    name: 'default',

    command: '*',

    handler(argv, app, cli) {
      const commands = cli.getCommands().filter(cmd => cmd.description);
      let commandList = '';
      if (commands.length > 0) {
        commandList = `<br><dim>Available commands:</dim><br><br>`;
        commandList += `${commands.map(cmd => `<cyan> ${cli.bin} ${cmd.command}</cyan> - ${cmd.description}`).join('<br>')}<br>`;
      }

      return `
        <green>Fractal CLI <dim>v${cli.version}</dim></green>
        ${commandList}
        <dim>Run <reset><cyan>${cli.bin} --help</cyan></reset> for full details on available commands and options.</dim>
      `;
    }
  };
};
