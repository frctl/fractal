var expect  = require("chai").expect;
var fractal = require('../src/fractal.js');
var config  = require('../config.js');

describe("fractal", function(){

    describe(".get()", function() {
        it("return the full the configuration object when called with no arguments", function(){
            expect(fractal.get()).to.equal(config);
        });
        
        // it("should get configuration values", function(){
        //     expect(fractal.get()).to.equal(config);
        // });
        // it("should set configuration values");
    });

});
