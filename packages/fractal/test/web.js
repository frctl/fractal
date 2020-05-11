'use strict';

const chai   = require('chai');
const expect = chai.expect;

const app    = require('../src/fractal')();
const Web    = require('../src/web');

describe('Web', function(){

    let web;

    before(function(){
        web = new Web(app);
    });

    it('is an event emitter', function(){
        expect(web.hasMixedIn('Emitter')).to.be.true;
    });
    it('is configurable', function(){
        expect(web.hasMixedIn('Configurable')).to.be.true;
    });

    describe('.serve()', function(){
        it('starts a web server');
    });

    describe('.build()', function(){
        it('starts the static build process');
    });

    describe('.theme()', function(){
        it('adds a theme');
    });

});
