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
        it('sets a theme');
    });

});
