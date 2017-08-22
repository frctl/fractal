
class Pages {

  constructor(config = {}){

  }

  get version() {
    return require('../package.json').version;
  }

}

module.exports = Pages;
