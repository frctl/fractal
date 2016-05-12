'use strict';

const _            = require('lodash');
const chalk        = require('chalk');
const Table        = require('cli-table2');
const slog         = require('single-line-log').stdout;
const Theme        = require('./theme');
const defaultTheme = require('./themes/default');
const utils        = require('../core/utils');

class Console {

    constructor(logger){
        this._logger    = logger || console;
        this._theme     = defaultTheme;
        this._slogging  = false;
        this._debugging = false;
    }

    set theme(theme) {
        if (!theme instanceof Theme) {
            throw new Error('Fractal themes must inherit from the base Theme class.');
        }
        this._theme = theme;
    }

    get theme() {
        return this._theme;
    }

    log(text) {
        this.write(text, 'log');
        return this;
    }

    br() {
        slog.clear();
        this.write('');
        return this;
    }

    debug(text) {
        if (this._debugging) {
            if (this._slogging) {
                this.unslog();
                this.br();
            }
            this.write(text, 'debug');
        }
        return this;
    }

    success(text) {
        this.write(text, 'success');
        return this;
    }

    alert(text) {
        this.write(text, 'alert');
        return this;
    }

    error(text) {
        if (this.isSlogging()) {
            this.unslog().br();
        }
        var str = text.toString().replace(/^Error: /, '');
        this.write(str, 'error');
        if (text.stack) this.debug(text.stack);
        return this;
    }

    notice(text) {
        this.write(text, 'notice');
        return this;
    }

    dump(data) {
        if (!data || !_.isObject(data)) {
            return this.write(data);
        }
        if (!_.isFunction(data.then)) {
            data = Promise.resolve(data);
        }
        data.then(data => this.write(utils.stringify(data)));
    }

    box(header, body, footer) {
        const table = new Table({
            head: [],
            chars: { mid: chalk.dim('─'), 'left-mid': '│', 'mid-mid': chalk.dim('─'), 'right-mid': '│' }
        });
        if (header) {
            table.push([header]);
        }
        body = [].concat(body);
        for (let line of body) {
            table.push([line]);
        }
        if (footer) {
            table.push([chalk.dim(footer)]);
        }
        this.write(table.toString(), null);
        return this;
    }

    write(str, type) {
        str = type ? this._format(str, type) : str;
        if (this.isSlogging()) {
            slog(str);
        } else {
            this._logger.log(str);
        }
    }

    columns(data, options) {
        const columnify = require('columnify');
        this.write(columnify(data, options));
        return this;
    }

    slog() {
        this._slogging = true;
        return this;
    }

    unslog() {
        this._slogging = false;
        slog.clear();
        return this;
    }

    isSlogging() {
        return this._slogging;
    }

    _format(text, type) {
        return this._theme.format(text, type);
    }

    debugMode(status) {
        this._debugging = !! status;
    }

}

module.exports = Console;
