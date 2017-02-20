module.exports = function () {
  return function parsePath(files, done) {
    files.forEach(file => {
      const stem = file.stem;
      const [, name] = stem.match(/^_?(?:\d+-)?(.*)$/);
      file.name = name;
    });

    done();
  };
};
