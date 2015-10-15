var yaml = require('js-yaml');

module.exports = {

    fetchFromFile: function(file){
        if (file) {
            var data = {};
            switch(file.fileInfo.ext) {
                case ".js":
                    data = require(file.fileInfo.absolute);
                    break;
                case ".json":
                    data = JSON.parse(file.content);
                    break;
                case ".yml":
                case ".yaml":
                    data = yaml.safeLoad(file.content);
                    break;
            }
            return data;
        }
        return null;
    }

};
