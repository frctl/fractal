'use strict';

const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const sinon           = require('sinon');
const expect          = chai.expect;

const Collection      = require('../src/collection.js');

chai.use(chaiAsPromised);

describe('collection', function(){

    let collection, emptyCollection;
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

    beforeEach(function() {
        collection      = new Collection(items)
        emptyCollection = new Collection([]);
    });

    describe('new instance', function(){
        it('returns a Collection instance', function(){
            expect(collection).to.be.instanceof(Collection);
        });
        it('has a type property with a value of \'collection\'', function(){
            expect(collection.type).to.equal('collection');
        });
    });

    describe('.size', function(){
        it('returns zero for an empty collection', function(){
            expect(emptyCollection.size).to.equal(0);
        });
        it('returns the number of items for an non-empty collection', function(){
            expect(collection.size).to.equal(items.length);
        });
    });

    describe('.source', function(){
        it('is null if no source is set', function(){
            expect(collection.source).to.equal(null);
        });
    });

    describe('.setProp()', function(){
        const ret = collection.setProp('baz', 'biz');
        it('sets a property', function(){
            expect(collection.getProp('foo')).to.equal('bar');
        });
        it('is chainable', function(){
            expect(ret).to.equal(collection);
        });
    });

    describe('.setProps()', function(){
        it('sets multiple properties', function(){
            emptyCollection.setProps({'foo':'bar','baz':'biz'});
            expect(emptyCollection.getProp('foo')).to.equal('bar');
            expect(emptyCollection.getProp('baz')).to.equal('biz');
        });
        it('is chainable', function(){
            const ret = emptyCollection.setProps({'foo':'bar','baz':'biz'});
            expect(ret).to.equal(emptyCollection);
        });
    });

    describe('.items()', function(){
        it('returns an array', function(){
            expect(collection.items()).to.be.an('array');
        });
        it('...with the expected length', function(){
            expect(collection.items().length).to.equal(items.length);
        });
    });

    describe('.setItems()', function(){
        const collection = new Collection([{id: 3}]);
        collection.setItems(items);
        it('replaces any existing items', function(){
            const collectionItems = collection.items();
            expect(collection.size).to.equal(2);
            expect(collectionItems[0].id).to.equal(1);
            expect(collectionItems[1].id).to.equal(2);
        });
        it('is chainable', function(){
            expect(ret).to.equal(collection);
        });
    });

    describe('.toJSON()', function(){
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

        it('calls toJSON() on items if they have a toJSON method');
    });

    describe('.first()', function(){
        it('returns the first item in the collection');
        it('returns undefined if collection is empty');
    });

    describe('.last()', function(){
        it('returns the last item in the collection');
        it('returns undefined if collection is empty');
    });

    describe('.eq()', function(){
        it('returns the item at the specified position in the collection');
        it('returns undefined if collection is empty');
        it('returns undefined if the position is out of bounds');
    });

    describe('.entities()', function(){
        it('returns a new collection');
        it('...containing only non-collection type items');
    });

    describe('.collections()', function(){
        it('returns a new collection');
        it('...containing only items with a type of \'collection\'');
    });

    describe('.orderBy()', function(){
        it('returns a new collection');
        
    });

});
