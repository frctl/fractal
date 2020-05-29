'use strict';

const chai = require('chai');
const expect = chai.expect;

const app = require('../src/fractal')();
const Theme = require('@frctl/web').Theme;
const Server = require('@frctl/web').Server;

describe('Server', function () {
    let server;

    before(function () {
        server = new Server(new Theme(), {}, app);
    });

    it('is an event emitter', function () {
        expect(server.hasMixedIn('Emitter')).to.be.true;
    });
});
