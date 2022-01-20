const { utils } = require('@frctl/core');
const inquirer = require('inquirer');

// In the future, use template parameter to ask special questions depending on template name.
module.exports = async ({ targetDir }) => {
    const questions = [
        {
            type: 'input',
            name: 'projectTitle',
            message: "What's the title of your project?",
            default: utils.titlize(targetDir),
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

    return await inquirer.prompt(questions);
};
