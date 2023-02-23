const path = require('path');

const { utils, shell } = require('@frctl/core');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

const pkg = require('../package.json');

module.exports = async ({ targetPath, templatePath, answers }) => {
    const componentsDir = path.join(targetPath, answers.componentsDir);
    const docsDir = path.join(targetPath, answers.docsDir);
    const publicDir = path.join(targetPath, answers.publicDir);
    const packageJSONPath = path.join(targetPath, 'package.json');
    const gitIgnorePath = path.join(targetPath, '.gitignore');
    const fractalFilePath = path.join(targetPath, 'fractal.config.js');
    const docsIndexPath = path.join(docsDir, '01-index.md');
    const componentCopyTo = path.join(componentsDir, 'example');

    const fractalFileTpl = path.join(templatePath, 'fractal.hbs');
    const docsIndexTpl = path.join(templatePath, 'docs/index.md');
    const exampleComponent = path.join(templatePath, 'components/example');

    const packageJSON = {
        name: utils.slugify(answers.projectTitle),
        version: '0.1.0',
        dependencies: {
            '@frctl/fractal': `${pkg.devDependencies['@frctl/fractal']}`,
        },
        scripts: {
            'fractal:start': 'fractal start --sync',
            'fractal:build': 'fractal build',
        },
    };

    const fractalContents = Handlebars.compile(fs.readFileSync(fractalFileTpl, 'utf8'))(answers);
    const indexContents = Handlebars.compile(fs.readFileSync(docsIndexTpl, 'utf8'))(answers);

    // ensure target folders exist
    await fs.ensureDir(targetPath);
    await fs.ensureDir(componentsDir);
    await fs.ensureDir(docsDir);
    await fs.ensureDir(publicDir);

    // write package.json
    await fs.writeJson(packageJSONPath, packageJSON, { spaces: 2 });

    // copy example component
    await fs.copy(exampleComponent, componentCopyTo);

    // write git-specific files
    if (answers.useGit) {
        shell.touch(path.join(publicDir, '.gitkeep'));
        await fs.writeFile(gitIgnorePath, 'node_modules\n');
    }

    // write config file
    await fs.writeFile(fractalFilePath, fractalContents);

    // write docs index
    await fs.writeFile(docsIndexPath, indexContents);
};
