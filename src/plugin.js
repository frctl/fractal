'use strict';

const Path     = require('path');
const _        = require('lodash');

module.exports = class Plugin {

    constructor() {
        this.name      = null;
        this.version   = null;
        this.title     = null;
        this._commands = new Map();
        this.defaults  = {};
    }

    command(name, callback) {
        this._commands.set(name, callback);
    }

    commands() {
        return this._commands;
    }

};
