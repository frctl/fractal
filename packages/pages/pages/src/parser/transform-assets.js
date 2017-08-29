module.exports = function (opts = {}) {
  return {

    name: 'assets',

    transform(files, state, app) {
      return files.filter(file => file.isDirectory() !== true).filter(app.get('assets.filter')).map(file => {
        file.type = 'asset';
        return file;
      });
    }
  };
};
