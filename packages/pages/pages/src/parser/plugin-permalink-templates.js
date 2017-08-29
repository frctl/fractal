const {dirname} = require('path');
const {permalinkify} = require('@frctl/utils');

module.exports = function(){

  return {
    name: 'permalink-templates',
    transform: 'templates',
    handler(files, state, app){
      return files.map(file => {
        const dir = dirname(file.relative) === '.' ? '' : dirname(file.relative);
        const urlPath = `${dir}/${file.stem}`;
        file.permalink = permalinkify(urlPath, app.config.pick('indexes','ext'));
        return file;
      });
    }
  }

};
