const {FileCollection, File} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'files',

    priority: 0,

    passthru: true,

    collection: FileCollection,

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
