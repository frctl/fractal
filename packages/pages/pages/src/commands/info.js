module.exports = function (opts = {}) {
  return {

    name: 'pages-info',

    command: 'pages',

    description: 'Get information about your Pages site(s)',

    handler(argv) {
      return `
        <green>Fractal Pages</green>
      `;
    }
  };
};
