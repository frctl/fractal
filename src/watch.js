const fs = require('@frctl/fs');

module.exports = function watch(paths, events, callback) {
  fs.watch(paths, (event, path) => {
    events.emit('change', event, path);
    callback();
  });
};
