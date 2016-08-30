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

    describe('.defaultsDeep()', function(){

        it('Does not modify source objects', function(){

            let target = {};
            let defaults = {foo:'bar'};
            let result = utils.defaultsDeep(target, defaults);

            expect(result).to.not.equal(defaults);
            expect(result).to.not.equal(target);
            expect(target).to.eql({});
            expect(defaults).to.eql({foo:'bar'});
            expect(target).to.equal(target);
            expect(defaults).to.equal(defaults);

        });

        it('Recursively merges plain objects', function(){
            let target = {
                top: 'from target',
                item: {
                    nested: {
                        one: 'from target',
                        two: ['from', 'target'],
                        three: undefined,
                        four: {
                            five: 5
                        }
                    }
                }
            };
            let defaults = {
                item: {
                    def: 'from default',
                    nested: {
                        one: 'from default',
                        two: ['from', 'default'],
                        three: ['set', 'from', 'default'],
                        four: {
                            five: 9,
                            six: 6
                        }
                    }
                }
            };
            let expected = {
                top: 'from target',
                item: {
                    def: 'from default',
                    nested: {
                        one: 'from target',
                        two: ['from', 'target'],
                        three: ['set', 'from', 'default'],
                        four: {
                            five: 5,
                            six: 6
                        }
                    }
                }
            };
            expect(utils.defaultsDeep(target, defaults)).to.eql(expected);
        });

        it('Does not merge non-plain-object values', function(){
            let target = { item: new MyClass() };
            let defaults = { item: new MyOtherClass() };
            let plain = { item: { foo: 'plain'} };
            expect(utils.defaultsDeep(target, defaults)).to.eql(target);
            expect(utils.defaultsDeep(plain, defaults)).to.eql(plain);
            expect(utils.defaultsDeep(target, plain)).to.eql(target);
        });

        it('Does not merge array values', function(){
            let target = { items: ['one', 'two']};
            let defaults = { items: ['one', 'three', 'four'] };
            expect(utils.defaultsDeep(target, defaults).items).to.equal(target.items);
        });

        it('Returns the default value if the target property is undefined', function(){
            let target = { anotherItem: 'foo', nullItem: null, undefinedItem: undefined };
            let defaults = { item: ['one', 'three', 'four'], nullItem: 'not null', undefinedItem: 'not undefined' };
            let result = utils.mergeProp(target, defaults);
            expect(result).to.have.property('anotherItem');
            expect(result).to.have.property('item');
            expect(result.nullItem).to.be.null;
            expect(result.undefinedItem).to.equal('not undefined');
        });


    });

});

class MyClass {

    constructor() {
        this.foo = 'MyClass';
    }

}

class MyOtherClass {

    constructor() {
        this.foo = 'MyOtherClass';
    }

}
