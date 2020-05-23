'use strict';

const chai      = require('chai');
const expect    = chai.expect;

const mix       = require('../src/core/mixins/mix');
const Heritable = mix(require('../src/core/mixins/heritable'));

describe('Heritable', function(){

    let heritable;

    before(function(){
        heritable = new Heritable;
    });

});
