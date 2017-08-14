const makePlugin = (n = 'plugin-name', t = 'files') => ({
  name: n,
  collection: t,
  handler: i => i
});

module.exports.makePlugin = makePlugin;
