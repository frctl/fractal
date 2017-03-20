const cli = require('@frctl/console');

module.exports = function (fractal) {
  return {

    command: '*',

    desc: null,

    handler(argv) {
      cli.draw.br();

      let content = `${cli.format('Fractal CLI', 'green.bold')} ${cli.format(`v${fractal.version}`, 'dim')}

Use ${cli.format(`\`${argv.$0} --help\``, 'cyan.bold')} for usage info and available commands.`;

      cli.draw.box(content, {
        fullWidth: true,
        align: 'left',
        borderColor: 'dim'
      });

      cli.draw.br();
    }

  };
};
