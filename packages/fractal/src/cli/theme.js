'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = class Theme {

    constructor(config) {
        config = config || {};
        this._delimiter = {
            text: 'fractal ➤',
            format: chalk.magenta,
        };
        this._styles = {
            log: {
                prefix: null,
                format: s => s,
            },
            debug: {
                prefix: '⚑',
                format: chalk.dim,
            },
            info: {
                prefix: '⚑',
            },
            warn: {
                prefix: '‼︎',
                format: chalk.yellow,
            },
            error: {
                prefix: '✘',
                format: chalk.red,
            },
            success: {
                prefix: '✔',
                format: chalk.green,
            },
        };

        if (config.delimiter) {
            this.setDelimiter(config.delimiter.text, config.delimiter.format);
        }
        if (config.styles) {
            _.forEach(config.styles, (value, key) => {
                this.setStyle(key, value);
            });
        }
    }

    setDelimiter(text, formatter) {
        if (text) {
            this._delimiter.text = text;
        }
        if (formatter) {
            this._delimiter.format = formatter;
        }
    }

    setStyle(name, opts) {
        this._styles[name] = opts;
    }

    format(str, style, strip) {
        style = style || 'log';
        const prefix = _.get(this._styles, `${style}.prefix`, '');
        const formatter = _.get(this._styles, `${style}.format`, str => str);
        const suffix = _.get(this._styles, `${style}.suffix`, '');
        return formatter(strip ? _.trim(str) : `${prefix ? prefix + ' ' : ''}${str}${suffix ? ' ' + suffix : ''}`);
    }

    style(name) {
        return this._styles[name] ? this._styles[name] : this._styles['log'];
    }

    delimiter() {
        const formatter = this._delimiter.format || (s => s);
        return formatter(this._delimiter.text);
    }

};
