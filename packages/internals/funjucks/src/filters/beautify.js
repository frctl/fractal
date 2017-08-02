const beautify = require('js-beautify');
const Vinyl = require('vinyl');
const {defaultsDeep} = require('@frctl/utils');

module.exports = function (opts = {}) {
  return {

    name: 'beautify',

    async: true,

    async filter(target, ...args) {
      const [done, lang = 'html', runtimeOpts = {}] = args.reverse();
      const options = defaultsDeep(runtimeOpts, opts);

      try {
        target = await Promise.resolve(target);
        const contents = Vinyl.isVinyl(target) ? target.contents.toString() : target.toString();
        if (!beautify[lang]) {
          throw new Error(`Cannot beautify ${lang} [lang-invalid]`);
        }
        done(null, beautify[lang](contents, options));
      } catch (err) {
        done(err);
      }
    }
  };
};
