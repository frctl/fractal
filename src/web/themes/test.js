'use strict';

const Path        = require('path');
const Theme       = require('../theme');

module.exports = function(){

    const theme = new Theme({
        views: Path.join(__dirname, 'views')
    });

    theme.route('/', {
        handle: 'overview',
        view: 'index.nunj',
    })

    return theme;

};
