'use strict';

const chai    = require('chai');
const expect  = chai.expect;

const fractal = require('../src/fractal');
const Source  = require('../src/core/source');

describe('Source', function(){

    let source;

    beforeEach(function(){
        source = new Source('foo', fractal);
    });

    describe('.label', function(){
        it('has a label generated from it\'s name', function(){
            expect(source.label).to.equal('Foo');
        });
    });

    describe('.title', function(){
        it('has a title the same as it\'s label', function(){
            expect(source.title).to.equal('Foo');
        });
    });

    // it('has properties', function(){
    //     expect(source).to.respondTo('getProp');
    // });

});
