'use strict';

const chai   = require('chai');
const expect = chai.expect;

const app    = require('../src/fractal');
const Server = require('../src/web/server');

describe('Server', function(){

    let server;

    before(function(){
        server = new Server({}, app);
    });

    it('is an event emitter', function(){
        expect(server.hasMixedIn('Emitter')).to.be.true;
    });
    
});
