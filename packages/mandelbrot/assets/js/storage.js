'use strict';

module.exports = {

    get(name, fallback) {
        const result = localStorage.getItem(name);
        return result ? JSON.parse(result) : fallback;
    },

    set(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

};
