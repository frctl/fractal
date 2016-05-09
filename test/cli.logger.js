'use strict';

const chai   = require('chai');
const expect = chai.expect;

const Logger  = require('../src/cli/logger');

describe('Logger', function(){

    let logger;

    before(function(){
        logger = new Logger(console);
    });

    describe('.theme()', function(){
        let theme = {
            delimiter: 'foo'
        };
        it('sets a theme from an object', function(){
            logger.theme(theme);
            expect(logger.themeValue('delimiter', theme.delimiter));
        });
    });

});
