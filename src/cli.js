'use strict';

const chalk       = require('chalk');
const _           = require('lodash');
const Table       = require('cli-table2');
const prettyjson  = require('prettyjson');
const utils       = require('./utils');

module.exports = {

    debugging: false,

    _muted: false,

    _paused: false,

    _queue: [],

    lineWidth: 40,

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

    theme(theme) {
        this._theme = theme;
    },

    log(text) {
        this.write(text);
        return this;
    },

    br(){
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
        this.write(table.toString());
        return this;
    },

    write(str, type){
        if (!this.isMuted()) {
            str = type ? this._format(str, type) : str;
            if (this.isPaused()) {
                this._queue.push(str);
            } else {
                console.log(str);
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

    // pending(text, doneText, callback){
    //     const spinner = new Spinner(`%s ${text}...`);
    //     const done = () => {
    //         spinner.stop();
    //         if (doneText) {
    //             this.write(doneText, null, true);
    //         }
    //         this.br();
    //         this.unpause();
    //     };
    //     this.pause();
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
        const prefix = _.get(this._theme, `${type}.prefix`, '');
        const textStyle = _.get(this._theme, `${type}.style`, (str) => str);
        const prefixStyle = _.get(this._theme, `${type}.prefixStyle`, textStyle);
        return `${prefixStyle(prefix)} ${textStyle(text)}`;
    },

    _processQueue() {
        while (this._queue.length) {
            this.write(this._queue.shift());
        };
    }

};
