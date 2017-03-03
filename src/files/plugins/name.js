module.exports = function () {
  return function setName(files, done) {
    files.forEach(file => {
      const stem = file.stem;
      const [, name] = stem.match(/^_?(?:\d+-)?(.*)$/);
      file.name = name;
    });

    done();
  };
};
