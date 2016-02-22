'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const Path       = require('path');
const inquirer   = require('inquirer');
const Handlebars = require('handlebars');
const shell      = require('shelljs');
const touch      = Promise.promisify(require("touch"));
const fs         = Promise.promisifyAll(require('fs-extra'));
const cli        = require('../cli');

module.exports = {

    name: 'new',

    opts: {
        description: 'Create a new Fractal project',
        scope: ['global']
    },

    callback: function (args, opts, app) {
        const helpers = app.utils.helpers;

        if (!args[0]) {
            cli.error('You must specify a path - e.g. \'fractal new foo/bar\'');
            process.exit(1);
        }

        const baseDir          = args[0];
        const basePath         = baseDir.startsWith('/') ? baseDir : Path.join(process.cwd(), baseDir);
        const skelPath         = Path.join(__dirname, '../../skel/new');
        const fractalFileTpl   = Path.join(skelPath, 'fractal.hbs');
        const docsIndexTpl     = Path.join(skelPath, 'docs/index.hbs');
        const exampleComponent = Path.join(skelPath, 'components/example');

        if (helpers.fileExistsSync(basePath)) {
            throw new Error(`Cannot create new project: The directory ${basePath} already exists.`);
        }

        const questions = [
            {
                type: 'input',
                name: 'projectTitle',
                message: 'What\'s the title of your project?',
                default: 'My Component Library'
            },
            {
                type: 'input',
                name: 'componentsDir',
                message: 'Where would you like to keep your components?',
                default: 'components'
            },
            {
                type: 'input',
                name: 'docsDir',
                message: 'Where would you like to keep your docs?',
                default: 'docs'
            },
            {
                type: 'input',
                name: 'publicDir',
                message: 'What would you like to call your public directory?',
                default: 'public'
            },
            {
                type: "confirm",
                name: 'useGit',
                message: 'Will you use Git for version control on this project?',
                default: true
            }
        ];

        inquirer.prompt(questions, function( answers ) {

            cli.notice('Generating project structure...');

            const componentsDir   = Path.join(basePath, answers.componentsDir);
            const docsDir         = Path.join(basePath, answers.docsDir);
            const publicDir       = Path.join(basePath, answers.publicDir);
            const packageJSONPath = Path.join(basePath, 'package.json');
            const gitIgnorePath   = Path.join(basePath, '.gitignore');
            const fractalFilePath = Path.join(basePath, 'fractal.js');
            const docsIndexPath   = Path.join(docsDir, '01-index.md');
            const componentCopyTo = Path.join(componentsDir, 'example');

            const packageJSON = {
                "name": helpers.slugify(answers.projectTitle),
                "version": "0.1.0",
                "dependencies": {}
            };

            const fractalContents = Handlebars.compile(fs.readFileSync(fractalFileTpl, 'utf8'))(answers);
            const indexContents   = Handlebars.compile(fs.readFileSync(docsIndexTpl, 'utf8'))(answers);

            fs.ensureDirAsync(basePath).then(() => {
                return Promise.all([
                    fs.ensureDirAsync(componentsDir),
                    fs.ensureDirAsync(docsDir),
                    fs.ensureDirAsync(publicDir),
                    fs.writeJsonAsync(packageJSONPath, packageJSON)
                ]);
            }).then(paths => {
                return fs.copy(exampleComponent, componentCopyTo);
            }).then(() => {
                if (answers.useGit) {
                    return Promise.all([
                        touch(Path.join(publicDir, '.gitkeep')),
                        fs.writeFileAsync(gitIgnorePath, 'node_modules\n'),
                    ]);
                }
                return paths;
            }).then(() => {
                return Promise.all([
                    fs.writeFileAsync(fractalFilePath, fractalContents),
                    fs.writeFileAsync(docsIndexPath, indexContents),
                ]);
            }).finally(() => {
                cli.notice('Installing NPM dependencies - this may take some time!');
                shell.cd(basePath);
                shell.exec('npm i @frctl/fractal --save').stdout;
                cli.success(`Your new Fractal project has been set up.`);
            }).catch(e => {
                fs.remove(basePath);
                cli.error(e);
            });

        });

        return;
    }

};
