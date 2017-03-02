
module.exports = function () {
  return {

    name: 'getAll',

    handler: function () {
      return this.$data.files;
    }

  };
};
