
module.exports = function () {
  return {

    name: 'render',

    async: true,

    filter: async function (target, ...args) {
      let [done, context = {}, opts = {}] = args.reverse();
      try {
        const result = await this.env.fractal.render(target, context, opts);
        done(null, result);
      } catch (err) {
        done(err);
      }
    }
  };
};
