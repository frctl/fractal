const {join} = require('path');
const del = require('del');

module.exports = function (dest, filter) {
  const cleanFilter = filter || '**';
  const cleanPath = [].concat(cleanFilter).map(glob => {
    if (glob.startsWith('!')) {
      return '!' + join(dest, glob.replace(/^!/, ''));
    }
    return join(dest, glob);
  });

  return del(cleanPath);
};
