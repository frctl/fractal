module.exports = function(){

  return {

      name: 'faux-adapter',
      match: '.faux',
      render(file, context, done) {
        done(null, 'rendered');
      }

  }

};
