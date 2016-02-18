'use strict';

const chalk       = require('chalk');
const _           = require('lodash');
const Table       = require('cli-table2');
const prettyjson  = require('prettyjson');
const utils       = require('./utils');
const slog        = require('single-line-log').stdout;
const Spinner = require('cli-spinner').Spinner;

module.exports = {

    debugging: false,

    _muted: false,

    _paused: false,

    _queue: [],

    lineWidth: 40,

    _slogging: false,

    _theme: {
        log: {},
        success: {
            prefix: '✔',
            style: chalk.green,
        },
        debug: {
            prefix: '⚡',
            style: chalk.dim,
        },
        notice: {
            prefix: '⚑'
        },
        error: {
            prefix: '✘',
            style: chalk.red,
        }
    },

    setTheme(theme) {
        this._theme = theme;
    },

    themeValue(path, otherwise){
        return _.get(this._theme, path, otherwise);
    },

    log(text) {
        this.write(text);
        return this;
    },

    br(){
        slog.clear();
        this.write('');
        return this;
    },

    debug(text){
        if (this.debugging) {
            this.write(text, 'debug');
        }
        return this;
    },

    success(text){
        this.write(text, 'success');
        return this;
    },

    error(text){
        this.unslog();
        text = text.toString().replace('Error: ','');
        this.write(text, 'error');
        return this;
    },

    notice(text){
        this.write(text, 'notice');
        return this;
    },

    dump(data){
        if (!data || ! _.isObject(data)) {
            return this.write(data);
        }
        if (!_.isFunction(data.then)) {
            data = Promise.resolve(data);
        }
        data.then(data => this.write(prettyjson.renderString(utils.stringify(data))));
    },

    box(header, body, footer) {
        const table = new Table({
            head: [],
            chars: {'mid': chalk.dim('─'), 'left-mid': '│', 'mid-mid': chalk.dim('─'), 'right-mid': '│'}
        });
        table.push([header]);
        body = [].concat(body);
        for (let line of body) {
            table.push([line]);
        }
        if (footer) {
            table.push([chalk.dim(footer)]);
        }
        this.write(table.toString(), null);
        return this;
    },

    write(str, type){
        if (!this.isMuted()) {
            str = type ? this._format(str, type) : str;
            if (this.isPaused()) {
                this._queue.push(str);
            } else {
                if (this.isSlogging()) {
                    slog(str);
                } else {
                    process.stdout.write(`${str}\n`);
                }
            }
        }
    },

    // ascii(text, font){
    //     this.write(figlet.textSync(text, {
    //         font: font || 'Small Isometric1',
    //         horizontalLayout: 'default',
    //         verticalLayout: 'default'
    //     }));
    //     return this;
    // },

    // pending(text, callback){
    //     callback = callback || () => {};
    //     const spinner = new Spinner(`%s ${text}...`);
    //     const done = () => {
    //         spinner.stop();
    //         this.br();
    //         // this.unpause();
    //     };
    //     // this.pause();
    //     spinner.setSpinnerString(18);
    //     spinner.start();
    //     callback(spinner, done);
    //     return this;
    // },

    // progress(text, opts, callback){
    //     var bar = new ProgressBar(`${text} [:bar]`, opts);
    //     callback(bar);
    //     return this;
    // },

    //
    // taskStart(taskName){
    //     sll('startinf....')
    // },
    //
    // taskEnd(taskName){
    //     sll('done!');
    //
    // },
    //
    // table(){
    //
    // },
    //
    // ask(text, handler) {
    //
    // },

    slog(){
        this._slogging = true;
        return this;
    },

    unslog(){
        this._slogging = false;
        slog.clear();
        return this;
    },

    isSlogging(){
        return this._slogging;
    },

    mute(){
        this._muted = true;
        return this;
    },

    unmute(){
        this._mute = false;
        return this;
    },

    isMuted(){
        return this._mute;
    },

    pause(){
        this._paused = true;
        return this;
    },

    unpause(){
        this._paused = false;
        this._processQueue();
        return this;
    },

    isPaused(){
        return this._paused;
    },

    _format(text, type){
        const prefix = this.themeValue(`${type}.prefix`, '');
        const textStyle = this.themeValue(`${type}.style`, (str) => str);
        const prefixStyle = this.themeValue(`${type}.prefixStyle`, textStyle);
        return `${prefixStyle(prefix)} ${textStyle(text)}`;
    },

    _processQueue() {
        while (this._queue.length) {
            this.write(this._queue.shift());
        };
    }

};
