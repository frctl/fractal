'use strict';

const HighlightJs = require('highlight.js');
const _ = require('lodash');
const LRU = require('lru-cache');

const utils = require('./utils');

const cache = new LRU({
    // 10MB cache, dunno what's good
    max: 1024 * 1024 * 10,
    length: (n) => n.length,
});

/**
 * @param {string} content
 * @param {string} lang
 */
module.exports = function highlighter(content, lang) {
    content = _.toString(content);
    lang = lang ? lang.toLowerCase() : lang;
    const md5 = utils.md5(content);
    let ret = cache.get(md5);

    if (!ret) {
        ret = module.exports._highlight(content, lang);
        cache.set(md5, ret);
    }

    return ret;
};

/**
 * @param {string} content
 * @param {string} lang
 */
module.exports._highlight = function _highlight(content, lang) {
    try {
        return lang ? HighlightJs.highlight(lang, content).value : HighlightJs.highlightAuto(content).value;
    } catch (e) {
        return HighlightJs.highlightAuto(content).value;
    }
};

module.exports._cache = cache;
