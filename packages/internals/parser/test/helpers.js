const makePlugin = (n, t = 'files') => ({
  name: n,
  collection: t,
  handler: function () {}
});

module.exports.makePlugin = makePlugin;
