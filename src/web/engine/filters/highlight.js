'use strict';

module.exports = function (app) {
    return {
        name: 'highlight',
        filter: (str, lang) => app.get('web.highlighter')(str, lang),
    };
};
