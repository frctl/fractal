const beautify = require('js-beautify');
const {File} = require('@frctl/support');
const {isPlainObject} = require('lodash');
const condense = require('condense-newlines');
const {defaultsDeep} = require('@frctl/utils');

module.exports = function (opts = {}) {
  return {

    name: 'beautify',

    async: true,

    async filter(target, ...args) {
      const done = args.pop();
      let [lang = 'html', runtimeOpts = {}] = args;

      if (isPlainObject(lang)) {
        runtimeOpts = lang;
        lang = 'html';
      }

      const options = defaultsDeep(runtimeOpts, opts[lang] || {});

      try {
        target = await Promise.resolve(target);
        const contents = File.isFile(target) ? target.contents.toString() : target.toString();
        if (!beautify[lang]) {
          throw new Error(`Cannot beautify ${lang} [lang-invalid]`);
        }
        const reformatted = beautify[lang](contents, options);
        done(null, condense(reformatted));
      } catch (err) {
        done(err);
      }
    }
  };
};
