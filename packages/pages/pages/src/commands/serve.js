// const Pages = require('../pages');

module.exports = function pagesInfoCommand(opts = {}) {
  return {

    name: 'pages-serve',

    command: 'serve',

    description: 'Start the Pages server',

    handler(argv, app, cli) {
      // const pages = new Pages(opts);

      return `
        <success><reset>Fractal Pages dev server started</reset></success>
      `;
    }
  };
};
