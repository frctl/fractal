const {permalinkify} = require('@frctl/utils');

module.exports = function(){

  return {
    name: 'permalink-assets',
    transform: 'assets',
    handler(files, state, app){
      return files.map(file => {
        file.permalink = permalinkify(file.relative);
        return file;
      });
    }
  }

};
