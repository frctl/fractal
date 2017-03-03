const assert = require('check-types').assert;

module.exports = function () {
  return {

    name: 'filterByRole',

    handler: function (role) {
      assert.string(role, `files.filterByRole: 'role' must be a string [role-invalid]`);
      return this.getAll().filter(file => file.role === role);
    }

  };
};
