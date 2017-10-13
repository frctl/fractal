module.exports = function (opts = {}) {
  return {

    name: 'await',

    async: true,

    async filter(promise, ...args) {
      const done = args.pop();
      try {
        done(null, await Promise.resolve(promise));
      } catch (err) {
        done(err);
      }
    }
  };
};
