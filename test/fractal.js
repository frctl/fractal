'use strict';

const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const sinon           = require('sinon');
const expect          = chai.expect;

const fractal         = require('../src/fractal');
const Configurable    = require('../src/core/mixins/configurable');

chai.use(chaiAsPromised);

describe('fractal', function(){

    it('is configurable', function(){
        // console.log(fractal.fractal);
        // expect(fractal.fractal instanceof (Configurable(Object))).to.be.true;
    });

    describe('.cli', function(){
        it('is a command line interface handler');
    });

    describe('.web', function(){
        it('is a web interface handler');
    });

    describe('.components', function(){
        it('is a component source instance');
    });

    describe('.docs', function(){
        it('is a documentation source instance');
    });



});
