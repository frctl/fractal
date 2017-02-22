module.exports = function () {
  return {

    name: 'getFiles',

    handler: function () {
      return this.$data.files;
    }

  };
};
