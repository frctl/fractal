'use strict';

const chai   = require('chai');
const expect = chai.expect;

const Web    = require('../src/web');

describe('fractal', function(){

    let web;

    before(function(){
        web = new Web();
    });

    it('is configurable');

    describe('.serve()', function(){
        it('starts a web server');
    });

    describe('.build()', function(){
        it('starts the static build process');
    });

});
