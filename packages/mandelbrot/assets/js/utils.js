'use strict';

const $      = global.jQuery;
const config = require('./config');

module.exports = {

    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    isSmallScreen() {
        return $(document).width() < config.breakpoints.navCollapse;
    }

};
