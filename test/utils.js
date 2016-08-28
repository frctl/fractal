'use strict';

const chai   = require('chai');
const expect = chai.expect;

const utils  = require('../src/core/utils');

describe('Utils', function(){

    describe('.mergeProp()', function(){

        it('Returns the upstream value if the property is undefined', function(){
            expect(utils.mergeProp(undefined, 'foo')).to.equal('foo');
        });

        it('Returns the property value if the upstream is undefined', function(){
            expect(utils.mergeProp('foo', undefined)).to.equal('foo');
        });

        it('Merges the contents of arrays', function(){
            expect(utils.mergeProp(['one', 'two'], ['one', 'three', 'four'])).to.include.members(['one', 'two', 'three', 'four']);
        });

        it('Applies default values from upstream objects', function(){
            expect(utils.mergeProp({one: 'one', two: 'two'}, {one: 'eins', three: 'drei'})).to.eql({one: 'one', two: 'two', three: 'drei'});
            expect(utils.mergeProp({one: 'one', nested: { three: 'three' }}, {two: 'zwei', nested: { three: 'drei', four: 'vier' }})).to.eql({one: 'one', two: 'zwei', nested: { three: 'three', four: 'vier' }});
        });

        it('Does not attempt to merge objects that are instances of classes', function(){
            let prop = new MyClass();
            let upstream = new MyOtherClass();
            let plain = {foo: 'bar'};
            expect(utils.mergeProp(prop, upstream)).to.equal(prop);
            expect(utils.mergeProp(plain, upstream)).to.equal(plain);
            expect(utils.mergeProp(prop, plain)).to.equal(prop);
        });
    });

});

class MyClass {

    constructor() {
        this.foo = 'bar';
    }

}

class MyOtherClass {

    constructor() {
        this.foo = 'baz';
    }

}
