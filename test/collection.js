'use strict';

const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const sinon           = require('sinon');
const expect          = chai.expect;

const Collection      = require('../src/collection.js');

chai.use(chaiAsPromised);

describe('collection', function(){

    const items = [
        {
            type: "component",
            id: 1
        },
        {
            type: "component",
            id: 2
        }
    ];

    describe('new instance', function(){
        const collection = new Collection(items);
        it('has a type property with a value of \'collection\'', function(){
            expect(collection.type).to.equal('collection');
        });
    });

    describe('.size', function(){
        const collection      = new Collection(items)
        const emptyCollection = new Collection([]);
        it('returns zero for an empty collection', function(){
            expect(emptyCollection.size).to.equal(0);
        });
        it('returns the number of items for an non-empty collection', function(){
            expect(collection.size).to.equal(items.length);
        });
    });

    describe('.source', function(){
        const collection = new Collection([])
        it('is null if no source is set', function(){
            expect(collection.source).to.equal(null);
        });
    });

    describe('.setProp()', function(){
        const collection = new Collection([]);
        it('sets a property', function(){
            collection.setProp('foo', 'bar');
            expect(collection.getProp('foo')).to.equal('bar');
        });
        it('is chainable', function(){
            const ret = collection.setProp('baz', 'biz');
            expect(ret).to.equal(collection);
        });
    });

    describe('.setProps()', function(){
        const collection = new Collection([]);
        it('sets multiple properties', function(){
            collection.setProps({'foo':'bar','baz':'biz'});
            expect(collection.getProp('foo')).to.equal('bar');
            expect(collection.getProp('baz')).to.equal('biz');
        });
        it('is chainable', function(){
            const ret = collection.setProps({'foo':'bar','baz':'biz'});
            expect(ret).to.equal(collection);
        });
    });

    describe('.items()', function(){
        const collection = new Collection(items);
        it('returns an array', function(){
            expect(collection.items()).to.be.an('array');
        });
        it('...with the expected length', function(){
            expect(collection.items().length).to.equal(items.length);
        });
    });

    describe('.setItems()', function(){
        const collection = new Collection([{id: 3}]);
        it('replaces any existing items', function(){
            collection.setItems(items);
            const collectionItems = collection.items();
            expect(collection.size).to.equal(2);
            expect(collectionItems[0].id).to.equal(1);
            expect(collectionItems[1].id).to.equal(2);
        });
        it('is chainable', function(){
            const ret = collection.setItems(items);
            expect(ret).to.equal(collection);
        });
    });

    describe('.toJSON()', function(){
        const collection = new Collection(items);
        it('returns a plain object', function(){
            expect(collection.toJSON()).to.be.an('object');
            expect(collection.toJSON()).to.not.be.instanceof(Collection);
        });
        it('...with a \'type\' property set to \'collection\'', function(){
            expect(collection.toJSON().type).to.equal('collection');
        });
        it('...with an items array', function(){
            expect(collection.toJSON().items).to.be.an('array');
        });

        it('calls toJSON() on items if they have at toJSON method');
    });

});
