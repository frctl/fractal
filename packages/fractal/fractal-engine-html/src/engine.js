module.exports = function(opts = {}){

  return {
    name: 'html',
    match: opts.match || ['.html','.xhtml','.html5'],
    render(str, context = {}, opts = {}) {
      return Promise.resolve(str);
    }
  }

};
