module.exports = function (opts = {}) {
  return {

    name: 'templates',

    transform(files, state, app) {
      let templatesFilter = file => file.isDirectory() !== true && file.hasFrontMatter;
      return files.filter(templatesFilter).map(file => {
        file.type = 'template';
        return file;
      });
    }
  };
};
