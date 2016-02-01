'use strict';

module.exports = class Service {

    constructor(config) {
        this.config = config;
    }

    static getName(){
        throw new Error(`${this.name} must implement the getName() method.`);
    }

    static getCommands(done) {
        return [];
    }

    static getDefaults() {
        return {};
    }
};
