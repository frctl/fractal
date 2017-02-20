module.exports = function () {
  return {

    name: 'render',

    handler(target, opts, done) {
      done(new Error('The root render method has yet been implemented'));
    }

  };
};
