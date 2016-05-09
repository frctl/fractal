'use strict';

const chai    = require('chai');
const expect  = chai.expect;

const ComponentSource = require('../src/core/api/components');
const fractal         = require('../src/fractal');

describe('ComponentSource', function(){

    let components;

    before(function(){
        components = new ComponentSource(fractal);
    });

    it('is an event emitter');

    it('is configurable');

});
