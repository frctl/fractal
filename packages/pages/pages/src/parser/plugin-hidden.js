const {sep} = require('path');

module.exports = function () {
  return {
    name: 'hidden',
    transform: 'files',
    handler(files) {
      return files.map(file => {
        file.hidden = false;
        for (const segment of file.relative.split(sep)) {
          if (segment.startsWith('_')) {
            file.hidden = true;
            break;
          }
        }
        return file;
      });
    }
  };
};
