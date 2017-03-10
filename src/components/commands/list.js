module.exports = function(fractal) {

  return {

    command: 'list',

    desc: 'List components',

    handler: function(){

      fractal.parse((err, components) => {
        for (const component of components.getAll()) {
          console.log(`-> ${component.label}`);
        }
      });
    }

  }
};
