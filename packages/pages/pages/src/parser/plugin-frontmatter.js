const matter = require('gray-matter');
const {defaultsDeep} = require('@frctl/utils');

module.exports = function () {
  return {
    name: 'frontmatter',
    transform: 'templates',
    handler(files) {
      return files.map(file => {
        file.config = file.config || {};
        if (file.contents) {
          const contents = file.contents.toString().trim();
          if (contents.startsWith('---')) {
            const parsed = matter(contents);
            file.config = defaultsDeep(parsed.data || {}, file.config);
            file.contents = Buffer.from(parsed.content);
          }
        }
        return file;
      });
    }
  };
};
