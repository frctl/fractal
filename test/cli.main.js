'use strict';

const chai      = require('chai');
const expect    = chai.expect;

const Cli       = require('../src/cli');
const Logger    = require('../src/cli/logger');
const Commander = require('../src/cli/commander');

describe('Cli', function(){

    let cli;

    before(function(){
        cli = new Cli();
    });

    it('is configurable');

    describe('.logger', function(){
        it('is an instance of Logger', function(){
            expect(cli.logger).to.be.instanceof(Logger);
        });
    });

    describe('.commander', function(){
        it('is an instance of Commander', function(){
            expect(cli.commander).to.be.instanceof(Commander);
        });
    });

    describe('.theme()', function(){
        it('sets a theme');
    });

    describe('.command()', function(){
        it('adds a command');
    });

    describe('.exec()', function(){
        it('executes a command');
    });

});
