'use strict';

const Path       = require("path");
const expect     = require("chai").expect;
const data       = require('../src/data');

describe("data", function(){

    describe("load", function() {
        it("loads js format data", function(){
            data.readFile('test/fixtures/config.js').then(function(data){
                expect(data).to.be.an('object');
                expect(data.toggle).to.be.true;
            })
        });
        // it("throw an error if a configuration file is not found", function(){
        //     expect(data.readFile()).to.throw(Error);
        // });
    });

});
