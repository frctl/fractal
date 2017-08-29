module.exports = function (opts = {}) {
  return {

    name: 'templates',

    transform(files, state, app) {
      return files.filter(file => file.isDirectory() !== true).filter(app.get('templates.filter')).map(file => {
        file.type = 'template';
        return file;
      });
    }
  };
};
