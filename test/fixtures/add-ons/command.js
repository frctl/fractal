module.exports = function(opts = {}){

  return {
    name: 'test-command',
    command: 'test <what>',
    description: 'This is a test command',
    handler(argv){
      return `testing ${argv.what}`;
    }
  }

};
