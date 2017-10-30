const {relative} = require('path');

module.exports = function infoCommand() {
  return {

    name: 'project-info',

    command: 'info',

    async handler(argv, app, cli) {
      const configPath = cli.configPath ? relative(cli.cwd, cli.configPath) : null;

      if (!configPath) {
        return (`<error>No project config file found.</error>`);
      }

      const sources = app.getParser().sources;

      if (sources.length === 0) {
        return (`<error>No src directory defined</error>`);
      }

      const components = await app.getComponents();

      const componentList = components.sortBy('id').mapToArray(c => {
        const numV = c.getVariants().length;
        return `<dim>*</dim> ${c.id} <dim>(${numV} variant${numV === 1 ? '' : 's'})</dim>`;
      }).join('<br>');

      return `
        <green>Fractal project info</green>

        <dim>Fractal version</dim>: v${app.version}
        <dim>Using config file</dim> ${configPath}

        <hr>

        <cyan>${components.length} components found</cyan>

        ${componentList}

      `;
    }
  };
};
