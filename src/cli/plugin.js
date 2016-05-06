'use strict';

const Path     = require('path');
const _        = require('lodash');

module.exports = class Plugin {

    constructor() {
        this.name      = null;
        this.version   = null;
        this.title     = null;
        this._commands = new Map();
        this.config    = {};
    }

    command(name, callback, opts) {
        this._commands.set(name, {
            name: name,
            callback: callback,
            opts: opts || {}
        });
    }

    commands() {
        return this._commands;
    }

};
