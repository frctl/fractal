const {FileCollection, File} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'files',

    passthru: true,

    transform(files) {
      return FileCollection.from(files.map(file => {
        return new File({
          cwd: file.cwd,
          path: file.path,
          base: file.base,
          stat: file.stat,
          contents: file.contents
        });
      }));
    }
  };
};
