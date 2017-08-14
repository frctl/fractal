const makePlugin = (n, t = 'files') => ({
  name: n,
  collection: t,
  handler: i => i
});

module.exports.makePlugin = makePlugin;
