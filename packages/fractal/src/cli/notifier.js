'use strict';

const _ = require('lodash');
const chalk = require('chalk');

class Notifier {

    constructor(console, interactive) {
        this._console = console;
        this._interactive = interactive;
    }

    updateAvailable(details) {
        this._console.br();
        this._console.box(null,
`Fractal update available! ${chalk.dim(details.current)} → ${chalk.green(details.latest)}
Run ${chalk.cyan('npm i -g ' + details.name)} to update.`
        ).unslog();
        this._console.br();
    }

    versionMismatch(details) {
        this._console.log(`Fractal version mismatch! Global: ${details.cli} / Local: ${details.local}`);
    }
}

module.exports = Notifier;
