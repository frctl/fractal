module.exports = function (opts = {}) {
  return {

    name: 'pages-author',

    command: 'author',

    description: 'Author a Fractal pages site',

    handler(argv) {
      return `
        <green>Fractal Pages</green>
      `;
    }
  };
};
