'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const Path = require('path');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const shell = require('shelljs');
const fs = Promise.promisifyAll(require('fs-extra'));
const helpers = require('../../core/utils');

module.exports = {

    command: 'new <path>',

    config: {
        description: 'Create a new Fractal project',
        scope: ['global'],
    },

    action(args, done) {
        const fractal = this.fractal;
        const console = this.console;
        const baseDir = args.path;
        const basePath = baseDir.startsWith('/') ? baseDir : Path.join(process.cwd(), baseDir);
        const viewsPath = Path.join(__dirname, '../../../views/cli/new');
        const fractalFileTpl = Path.join(viewsPath, 'fractal.hbs');
        const docsIndexTpl = Path.join(viewsPath, 'docs/index.hbs');
        const exampleComponent = Path.join(viewsPath, 'components/example');

        if (helpers.fileExistsSync(basePath)) {
            console.error(`Cannot create new project: The directory ${basePath} already exists.`);
            done();
            return;
        }

        console.br().log('Creating new project.... just a few questions:').br();

        const questions = [
            {
                type: 'input',
                name: 'projectTitle',
                message: 'What\'s the title of your project?',
                default: helpers.titlize(args.path),
            },
            {
                type: 'input',
                name: 'componentsDir',
                message: 'Where would you like to keep your components?',
                default: 'components',
            },
            {
                type: 'input',
                name: 'docsDir',
                message: 'Where would you like to keep your docs?',
                default: 'docs',
            },
            {
                type: 'input',
                name: 'publicDir',
                message: 'What would you like to call your public directory?',
                default: 'public',
            },
            {
                type: 'confirm',
                name: 'useGit',
                message: 'Will you use Git for version control on this project?',
                default: true,
            },
        ];

        return inquirer.prompt(questions).then(function (answers) {
            console.log('Generating project structure...');

            const componentsDir = Path.join(basePath, answers.componentsDir);
            const docsDir = Path.join(basePath, answers.docsDir);
            const publicDir = Path.join(basePath, answers.publicDir);
            const packageJSONPath = Path.join(basePath, 'package.json');
            const gitIgnorePath = Path.join(basePath, '.gitignore');
            const fractalFilePath = Path.join(basePath, 'fractal.js');
            const docsIndexPath = Path.join(docsDir, '01-index.md');
            const componentCopyTo = Path.join(componentsDir, 'example');

            const packageJSON = {
                name: helpers.slugify(answers.projectTitle),
                version: '0.1.0',
                dependencies: {
                    '@frctl/fractal': `^${fractal.get('version')}`,
                },
            };

            const fractalContents = Handlebars.compile(fs.readFileSync(fractalFileTpl, 'utf8'))(answers);
            const indexContents = Handlebars.compile(fs.readFileSync(docsIndexTpl, 'utf8'))(answers);

            return fs.ensureDirAsync(basePath).then(() => {
                return Promise.all([
                    fs.ensureDirAsync(componentsDir),
                    fs.ensureDirAsync(docsDir),
                    fs.ensureDirAsync(publicDir),
                    fs.writeJsonAsync(packageJSONPath, packageJSON),
                ]);
            }).then(paths => {
                return fs.copyAsync(exampleComponent, componentCopyTo);
            }).then(paths => {
                if (answers.useGit) {
                    shell.touch(Path.join(publicDir, '.gitkeep'));
                    return fs.writeFileAsync(gitIgnorePath, 'node_modules\n');
                }
                return paths;
            }).then(paths => {
                return Promise.all([
                    fs.writeFileAsync(fractalFilePath, fractalContents),
                    fs.writeFileAsync(docsIndexPath, indexContents),
                ]);
            }).finally(() => {
                console.log('Installing NPM dependencies - this may take some time!');
                shell.cd(basePath);
                const install = shell.exec('npm i', {
                    silent: false,
                }, function () {
                    console.success('Your new Fractal project has been set up.');
                    done();
                });
                install.stdout.on('data', (data) => console.log);
            }).catch(e => {
                fs.remove(basePath);
                console.error(e);
                done();
            });
        });
    },

};
