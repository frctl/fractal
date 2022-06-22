'use strict';

const _ = require('lodash');
const Table = require('cli-table3');
const Theme = require('./themes/default');
const utils = require('../../core').utils;

class Console {
    constructor() {
        this._logger = console;
        this._theme = new Theme();
        this._debugging = false;
    }

    get theme() {
        return this._theme;
    }

    br() {
        this.write('');
        return this;
    }

    log(text) {
        this.write(text, 'log');
        return this;
    }

    debug(text, data) {
        if (this._debugging) {
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

    error(err, data) {
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
        data.then((data) => this.write(utils.stringify(data)));
    }

    box(header, body, footer) {
        const table = new Table({
            head: [],
            chars: { mid: '─', 'left-mid': '│', 'mid-mid': '─', 'right-mid': '│' },
        });
        if (header) {
            table.push([header]);
        }
        body = [].concat(body);
        for (const line of body) {
            table.push([line]);
        }
        if (footer) {
            table.push([footer]);
        }
        this.write(table.toString(), null);
        return this;
    }

    write(str, type) {
        str = _.isString(str) ? str : str.toString();
        str = type ? this._format(str, type) : str;
        this._logger.log(str);
    }

    _format(text, type) {
        return this._theme.format(text, type);
    }

    debugMode(status) {
        this._debugging = !!status;
    }
}

module.exports = Console;
