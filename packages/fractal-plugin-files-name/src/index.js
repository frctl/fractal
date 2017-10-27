module.exports = function () {
  return {
    name: 'name',
    transform: 'files',
    handler: function name(files) {
      // Arguments here do not require checking as this function will always be wrapped in function with checks
      return files.map(file => {
        const stem = file.stem;
        const [, name] = stem.match(/^_?(?:\d+-)?(.*)$/);
        file.name = name;
        return file;
      });
    }
  };
};
