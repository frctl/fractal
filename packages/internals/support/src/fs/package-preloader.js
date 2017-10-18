/***
 * Credit to https://github.com/christianalfoni/webpack-bin/blob/master/server/preLoadPackages.js
 */
var path = require('path');
var fs = require('fs');
var dir = require('node-dir');

var loadedDeps = [];

var preLoadPackage = function (memFs, name) {

  // fsevents is MAC specific
  if (name === 'fsevents') {
    return;
  }

  if (loadedDeps.indexOf(name) >= 0) {
    return;
  }

  loadedDeps.push(name);
  setTimeout(function () {
    var packagePath = path.resolve('node_modules', name);
    var packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json')).toString());

    dir.files(packagePath, function (err, files) {
      if (err) throw err;
      files.forEach(function (file) {
        var relativeFile = file;
        var paths = relativeFile.split(path.sep).slice(1);
        paths.reduce(function (currentPath, pathPart, index) {
          currentPath += path.sep + pathPart;
          if (index < paths.length - 1 && !memFs.existsSync(currentPath)) {
            memFs.mkdirpSync(currentPath);
          }
          return currentPath;
        }, '');

        if (path.extname(relativeFile)) {
          var content = fs.readFileSync(file, 'utf8');
          memFs.writeFileSync(relativeFile, content || ' ');
          // console.log('writing file', relativeFile);
        }
      });
    });
    Object.keys(packageJson.dependencies || {}).forEach(preLoadPackage.bind(null, memFs));
  })
}


module.exports = (memFs, packages) => {
  packages.forEach(preLoadPackage.bind(null, memFs));
};
