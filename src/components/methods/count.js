
module.exports = function () {
  return {

    name: 'count',

    handler: function () {
      return this.$data.length;
    }

  };
};
