#!/usr/bin/env node

const path = require('path');

const { shell } = require('@frctl/core');
const execa = require('execa');
const fs = require('fs-extra');
// const inquirer = require('inquirer');

const getAnswers = require('./get-answers');
const generateProject = require('./generate-project');

const templatesDir = path.join(__dirname, '../templates');

(async () => {
    const targetDir = process.argv.length >= 3 ? process.argv[2] : '.';
    const targetPath = path.join(process.cwd(), targetDir);

    try {
        // ensure creating project in a new directory
        const pathExists = await fs.pathExists(targetPath);

        if (pathExists) {
            console.error(`Cannot create new project: The directory ${targetPath} already exists.`);
            return;
        }

        // enable when we have multiple starter templates
        /*
        const { template } = await inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: 'What template do you want to start from?',
                choices: [
                    'handlebars',
                ],
            }
        ]);
        */
        const template = 'handlebars';
        const templatePath = path.join(templatesDir, template);

        console.log('Creating new project.... just a few questions:');
        // ask questions, get answers
        const answers = await getAnswers({
            template,
            targetDir,
        });

        console.log('Generating project structure...');
        await generateProject({
            targetPath,
            templatePath,
            answers,
        });

        // do initial install
        console.log('Installing dependencies... This may take a while!');
        shell.cd(targetPath);
        await execa('npm', ['install'], { stdio: 'inherit' });

        // success!
        console.log('Your new Fractal project has been set up.');
    } catch (e) {
        await fs.remove(targetPath);
        console.error(e);
    }
})();
