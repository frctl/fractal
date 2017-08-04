
module.exports = function () {
  return {

    name: 'stringify',

    async: false,

    filter: function (obj) {
      if (typeof obj === 'string') {
        return obj;
      }
      return JSON.stringify(obj, null, 2);
    }
  };
};
