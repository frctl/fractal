
module.exports = function () {
  return {

    name: 'filterByRole',

    handler: function (role) {
      return this.getAll().filter(file => file.role === role);
    }

  };
};
