'use strict';

const Promise = require('bluebird');
const Path = require('path');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const execa = require('execa');
const shell = require('@frctl/core').shell;
const fs = require('fs-extra');
const helpers = require('@frctl/core').utils;

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
        const docsIndexTpl = Path.join(viewsPath, 'docs/index.md');
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
                message: "What's the title of your project?",
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
            const fractalFilePath = Path.join(basePath, 'fractal.config.js');
            const docsIndexPath = Path.join(docsDir, '01-index.md');
            const componentCopyTo = Path.join(componentsDir, 'example');

            const packageJSON = {
                name: helpers.slugify(answers.projectTitle),
                version: '0.1.0',
                dependencies: {
                    '@frctl/fractal': `^${fractal.get('version')}`,
                },
                scripts: {
                    'fractal:start': 'fractal start --sync',
                    'fractal:build': 'fractal build',
                },
            };

            const fractalContents = Handlebars.compile(fs.readFileSync(fractalFileTpl, 'utf8'))(answers);
            const indexContents = Handlebars.compile(fs.readFileSync(docsIndexTpl, 'utf8'))(answers);

            return fs
                .ensureDir(basePath)
                .then(() => {
                    return Promise.all([
                        fs.ensureDir(componentsDir),
                        fs.ensureDir(docsDir),
                        fs.ensureDir(publicDir),
                        fs.writeJson(packageJSONPath, packageJSON),
                    ]);
                })
                .then(() => {
                    return fs.copy(exampleComponent, componentCopyTo);
                })
                .then((paths) => {
                    if (answers.useGit) {
                        shell.touch(Path.join(publicDir, '.gitkeep'));
                        return fs.writeFile(gitIgnorePath, 'node_modules\n');
                    }
                    return paths;
                })
                .then(() => {
                    return Promise.all([
                        fs.writeFile(fractalFilePath, fractalContents),
                        fs.writeFile(docsIndexPath, indexContents),
                    ]);
                })
                .finally(async () => {
                    console.log('Installing NPM dependencies - this may take some time!');
                    shell.cd(basePath);
                    const { stdout } = await execa('npm', ['install']);
                    console.log(stdout);
                    console.success('Your new Fractal project has been set up.');
                    done();
                })
                .catch((e) => {
                    fs.remove(basePath);
                    console.error(e);
                    done();
                });
        });
    },
};
