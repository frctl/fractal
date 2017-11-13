const {SafeString} = require('nunjucks').runtime;
const highlight = require('highlight.js');
const {File} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'highlight',

    async: true,

    async filter(target, ...args) {
      const done = args.pop();
      const [lang] = args;
      try {
        target = await Promise.resolve(target);
        if (target instanceof SafeString) {
          target = target.toString();
        }
        const contents = File.isFile(target) ? target.contents.toString() : target.toString();
        const output = lang ? highlight.highlight(lang, contents) : highlight.highlightAuto(contents);
        const wrapped = new SafeString(`<pre><code class="hljs ${output.language}">${output.value}</code></pre>`);
        done(null, wrapped);
      } catch (err) {
        done(err);
      }
    }

  };
};
