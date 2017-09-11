module.exports = function(){

  return {
    name: 'permalink',
    helper:  function(...args){
      const site = args.pop();
      const page = site.find(...args);
      if (!page || !page.permalink) {
        throw new Error(`Could not generate page for permalink`);
      }
      return page.permalink;
    }
  }

};
