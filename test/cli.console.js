'use strict';

const chai   = require('chai');
const expect = chai.expect;

const Console  = require('../src/cli/console');

describe('Console', function(){

    let logger;

    before(function(){
        logger = new Console({
            log: function(){}
        });
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
