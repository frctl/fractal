const {join} = require('path');
const simpleGit = require('simple-git/promise');
const tildify = require('tildify');
const fs = require('fs-extra');
const shell = require('shelljs');

const defaultStarterUrl = 'https://github.com/frctl/fractal-starter-default';

module.exports = function newProjectCommand() {
  return {

    name: 'new-project',

    command: 'new <directory-path>',

    description: 'Create a new starter project',

    async handler(argv, app, cli, {log}) {

      process.on('SIGINT', () => {
        shell.exit(0);
      });

      if (!shell.which('git')) {
        log('The Fractal new project command requires Git to be installed on your machine');
        shell.exit(1);
      }

      log('Creating directory...');

      const dirPath = join(cli.cwd, argv.directoryPath);
      const tildeDir = tildify(dirPath);

      if (fs.existsSync(dirPath)) {
        return (`<error>The directory '${argv.directoryPath}' already exists.</error>`);
      }

      log('Cloning git repo...');

      const git = simpleGit(cli.cwd);

      try {
        await git.clone(defaultStarterUrl, dirPath);
      } catch (err) {
        throw new Error(`Failed to clone starter project Git repository [${err.message}]`);
      }

      log('Installing NPM dependencies...');

      shell.cd(argv.directoryPath);
      const result = shell.exec(`npm install --only=prod`);
      if (result.code > 0) {
        throw new Error(`Failed to install NPM dependencies in the new project`);
      }

      try {
        await fs.removeSync(join(dirPath, '.git'));
        shell.exec('git init');
      } catch (err) {
        throw new Error(`Failed to reset git repo information [${err.message}]`);
      }

      return `
        <success>New Fractal starter project created</success>

        Project path: <gray>${tildeDir}</gray>
      `;
    }
  };
};
