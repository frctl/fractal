/* eslint-disable import/no-dynamic-require */
const path = require('path');

const pluginList = ['adapter', 'name', 'role']
  .map(name => ({
    name: name,
    plugin: require(path.join('../../../src/files/plugins', name))
  }));

const plugins = pluginList.reduce((memo, {
  name,
  plugin
}) => Object.assign(memo, {
  [name]: plugin
}), {});

module.exports = {
  pluginList, plugins
};
