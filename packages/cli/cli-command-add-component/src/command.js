const {join, relative} = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const {normalizeId, normalizePath} = require('@frctl/utils');

module.exports = function addComponentCommand() {

  return {

    name: 'fractal-add-component',

    command: 'add <component-id>',

    description: 'Add a new component to the component library',

    builder: {
      dir: {
        alias: 'd',
        describe: 'the path to the directory in which the component should be added'
      }
    },

    async handler(argv, app, cli) {

      const skelPath = join(__dirname, '../skel/@component');

      if (!cli.config) {
        throw new Error(`The add component command can only be run within an existing Fractal project`);
      }

      const sources = app.getParser().sources;
      const src = sources.length ? sources[0].base : undefined;

      const dirPath = argv.dir ? normalizePath(argv.dir, cli.cwd) : src;
      if (!dirPath) {
        throw new Error(`No src directory found`);
      }

      const relPath = relative(cli.cwd, dirPath);

      const id = normalizeId(argv.componentId).replace(/^@/,'');
      const name = `@${id}`;

      const componentDir = join(dirPath, name);

      if (fs.existsSync(componentDir)) {
        throw new Error(`The directory ${componentDir} already exists. Please choose another component name or location.`);
      }

      fs.copySync(skelPath, componentDir);

      return `
        <success>New component added</success>

        Id: <gray>${id}</gray>
        Path: <gray>${relPath}/${name}</gray>
      `;
    }
  };
};
