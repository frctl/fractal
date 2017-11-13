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
        const contents = File.isFile(target) ? target.contents.toString() : target.toString();
        const output = lang ? highlight.highlight(lang, contents) : highlight.highlightAuto(contents);
        done(null, `
          <pre><code class="hljs ${output.language}">${output.value}</code></pre>
        `);
      } catch (err) {
        done(err);
      }
    }

  };
};
