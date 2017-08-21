const {ComponentCollection} = require('@frctl/support');

module.exports = function () {
  return {

    name: 'components',

    transform() {
      return new ComponentCollection();
    }

  };
};
