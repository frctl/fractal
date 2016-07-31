'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const chalk = require('chalk');
const Table = require('cli-table2');
const slog = require('log-update');
const Theme = require('./theme');
const defaultTheme = require('./themes/default');
const utils = require('../core/utils');

class Console {

    constructor(logger) {
        this._logger = logger || console;
        this._theme = defaultTheme;
        this._slogging = false;
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

    br() {
        slog.clear();
        this.write('');
        return this;
    }

    log(text) {
        this.write(text, 'log');
        return this;
    }

    debug(text, data) {
        if (this._debugging) {
            if (this._slogging) {
                this.unslog();
                this.br();
            }
            this.write(text, 'debug');
            if (data) this.dump(data);
        }
        return this;
    }

    success(text) {
        this.write(text, 'success');
        return this;
    }

    warn(text) {
        this.write(text, 'warn');
        return this;
    }

    update(text, type) {
        slog(type ? this._format(text, type) : text);
        return this;
    }

    clear() {
        slog.clear();
        return this;
    }

    persist() {
        slog.done();
        return this;
    }

    error(err, data) {
        if (this.isSlogging()) {
            this.unslog().br();
        }
        this.write(err, 'error');
        if ((data || err instanceof Error) && this._debugging) {
            data = data || err;
            if (data.stack) {
                this.log('    ' + _.trim(data.stack.toString().replace(err.toString(), '')));
            } else {
                this.dump(data);
            }
        }
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
            chars: { mid: chalk.dim('─'), 'left-mid': '│', 'mid-mid': chalk.dim('─'), 'right-mid': '│' },
        });
        if (header) {
            table.push([header]);
        }
        body = [].concat(body);
        for (const line of body) {
            table.push([line]);
        }
        if (footer) {
            table.push([chalk.dim(footer)]);
        }
        this.unslog().write(table.toString(), null);
        return this;
    }

    write(str, type) {
        str = _.isString(str) ? str : str.toString();
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
