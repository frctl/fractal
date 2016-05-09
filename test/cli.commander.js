'use strict';

const chai   = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const fractal    = require('../src/fractal');
const Commander  = require('../src/cli/commander');

describe('Commander', function(){

    let commander;

    beforeEach(function(){
        commander = new Commander(null, console, fractal);
    });

    describe('.add()', function(){
        it('adds a command with no configuration', function(){
            commander.add('test-command', function(){
                // do nothing
            });
            expect(commander.has('test-command')).to.be.true;
        });

        it('adds a command configuration', function(){
            commander.add('test-command', {
                description: 'This is the description'
            }, function(){
                // do nothing
            });
            expect(commander.has('test-command')).to.be.true;
        });
    });

    describe('.exec()', function(){
        it('executes a command from a string', function(done){
            const spy = sinon.spy();
            commander.add('test-command', spy);
            commander.exec('test-command').then(function(){
                expect(spy.called).to.be.true;
                done();
            });
        });
    });

});
