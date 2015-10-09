var Handlebars          = require('handlebars');
var fs                  = require('fs');
var path                = require('path');

var config              = require("../../config");
var hbs                 = Handlebars.create();

module.exports = Generators;

fs.readdirSync(path.join(__dirname, '../../generators')).forEach(function(fileName){
    var generator = require(path.join(__dirname, "../../generators", fileName))(hbs);
    console.log(generator);
    generator.then(function(func){
        hbs.registerHelper(fileName.replace('\.js',''), func);    
    });
});

function Generators(){
};

Generators.prototype.process = function(item){
    var template = hbs.compile(item.raw.toString());
    item.raw = new Buffer(template(this.getData(item)) + "\n", "utf-8");
    return item;
};

Generators.prototype.getData = function(item){
    return {
        page: item.data,
        config: config.all()
    };
};