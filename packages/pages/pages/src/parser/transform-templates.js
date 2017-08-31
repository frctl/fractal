const {toArray} = require('@frctl/utils');

module.exports = function (opts = {}) {
  return {

    name: 'templates',

    transform(files, state, app) {
      let templatesFilter;
      if (app.get('templates.filter')) {
        templatesFilter = app.get('templates.filter');
      } else {
        const extensions = toArray(app.get('templates.match', ['.html']));
        templatesFilter = file => extensions.includes(file.extname);
      }
      return files.filter(file => file.isDirectory() !== true).filter(templatesFilter).map(file => {
        file.type = 'template';
        return file;
      });
    }
  };
};
