'use strict';

const storages = {
    local: localStorage,
    session: sessionStorage,
};

module.exports = {
    get(name, fallback, storage = 'local') {
        const result = storages[storage].getItem(name);
        return result ? JSON.parse(result) : fallback;
    },

    set(name, value, storage = 'local') {
        storages[storage].setItem(name, JSON.stringify(value));
    },
};
