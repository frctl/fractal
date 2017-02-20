module.exports = function(){

  return {

    name: 'getResources',

    handler: function () {
      return this.$data.resources;
    }

  };

};
