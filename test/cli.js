'use strict';

const chai    = require('chai');
const sinon   = require('sinon');
const expect  = chai.expect;

const app     = require('../src/fractal');
const Cli     = require('../src/cli');
const Console = require('../src/cli/console');

describe('Cli', function(){

    let cli;

    beforeEach(function(){
        cli = new Cli(app);
        cli.logger = new Console({
            log: function(){}
        });
    });
    
    it('is configurable');

    describe('.console', function(){
        it('is an instance of Console', function(){
            expect(cli.console).to.be.instanceof(Console);
        });
    });

    describe('.theme()', function(){
        it('sets the theme from an object', function(){
            let theme = {
                delimiter: 'foo'
            };
            cli.theme(theme);
            expect(cli.console.themeValue('delimiter', theme.delimiter));
        });
    });

    describe('.add()', function(){
        it('adds a command with no configuration', function(){
            cli.command('test-command', function(){
                // do nothing
            });
            expect(cli.has('test-command')).to.be.true;
        });

        it('adds a command configuration', function(){
            cli.command('test-command', {
                description: 'This is the description'
            }, function(){
                // do nothing
            });
            expect(cli.has('test-command')).to.be.true;
        });
    });

    describe('.exec()', function(){
        it('executes a command from a string', function(done){
            const spy = sinon.spy();
            cli.command('test-command', spy);
            cli.exec('test-command').then(function(){
                expect(spy.called).to.be.true;
                done();
            });
        });
    });

    describe('.exec()', function(){
        it('executes a command');
    });

    for (let method of ['log', 'error', 'alert', 'debug']) {
        describe(`.${method}()`, function(){
            it(`calls the console ${method} method`, function(){
                const spy = sinon.spy(cli.console, method);
                cli[method]('Message');
                expect(spy.called).to.be.true;
                expect(spy.calledWith('Message')).to.be.true;
            });
        });
    }

});
