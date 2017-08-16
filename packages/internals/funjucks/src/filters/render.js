
module.exports = function () {
  return {

    name: 'render',

    async: true,

    filter: async function (target, ...args) {
      let [done, opts = {}, context = {}] = args.reverse();
      try {
        const result = await this.fractal.render(target, context, opts);
        done(null, result);
      } catch (err) {
        done(err);
      }
    }
  };
};
