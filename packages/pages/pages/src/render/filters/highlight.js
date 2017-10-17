const highlight = require('highlight.js');
const {File} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'highlight',

    async: true,

    async filter(target, ...args) {
      const [done, lang] = args.reverse();
      try {
        target = await Promise.resolve(target);
        const contents = File.isFile(target) ? target.contents.toString() : target.toString();
        const output = lang ? highlight.highlight(lang, contents) : highlight.highlightAuto(contents);
        done(null, `
          <code class="hljs ${output.language}">
            <pre>${output.value}</pre>
          </code>
        `);
      } catch (err) {
        done(err);
      }
    }

  };
};
