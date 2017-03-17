/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

function getList(folder) {
  return fs.readdirSync(folder)
    .filter(file => fs.statSync(path.join(folder, file)).isFile())
    .map(file => ({
      name: file.replace(path.extname(file), ''),
      plugin: require(path.join(path.relative(__dirname, '.'), folder, file))
    }));
}

function getObject(list) {
  return list.reduce((memo, {
    name,
    plugin
  }) => Object.assign(memo, {
    [name]: plugin
  }), {});
}

module.exports = function (type) {
  const folder = `./src/parser/${type}/plugins/`;

  const pluginList = getList(folder);
  const plugins = getObject(pluginList);

  return {
    getPlugins: () => pluginList,
    getPlugin: name => plugins[name]
  };
};
