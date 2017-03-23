const cli = require('@frctl/console');

module.exports = function (fractal) {
  return {

    command: 'list',

    desc: 'Output a list of all components in the library',

    builder(yargs) {
      return yargs.option('prop', {

      });
    },

    handler() {
      cli.draw.br();

      if (!this.env.configPath) {
        cli.error('The `list` command must be run within a Fractal project - no configuration found.');
        cli.draw.br();
        return;
      }

      const spinner = cli.start.spinner('Parsing components...');

      fractal.parse((err, components) => {
        spinner.stop();

        if (err) {
          cli.error(err);
          return;
        }

        const data = components.getAll().map(component => {
          const columns = {
            component: cli.format(component.label, 'magenta.bold'),
            location: cli.format(component.dir.relative, 'dim')
          };
          if (component.status) {
            columns.status = component.status.label || component.status;
          }
          return columns;
        });

        cli.draw
          .header(`All components (${components.count()} found)`, {
            borderStyle: 'dim'
          })
          .br()
          .columns(data)
          .br();
      });
    }

  };
};
