const path = require('path');

module.exports = function () {
  return function addFileProps(components, done) {
    components.forEach(component => {
      component.files = component.files.map(file => {
        file.scope = 'component';
        Object.defineProperty(file, 'componentPath', {
          get() {
            return path.relative(component.path, file.path);
          }
        });
        return file;
      });
    });

    done();
  };
};
