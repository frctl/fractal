'use strict';

const chai       = require('chai');
const sinon      = require('sinon');
const expect     = chai.expect;

const mix        = require('../src/core/mixins/mix');
const Collection = mix(require('../src/core/mixins/collection'));

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

describe('Collection', function(){

    let collection, emptyCollection;

    beforeEach(function() {
        collection      = (new Collection).setItems(items);
        emptyCollection = new Collection;
    });

    describe('new instance', function(){
        it('returns a Collection instance', function(){
            expect(collection).to.be.instanceof(Collection);
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

    describe('.items()', function(){
        it('returns an array', function(){
            expect(collection.items()).to.be.an('array');
        });
        it('...with the expected length', function(){
            expect(collection.items().length).to.equal(items.length);
        });
    });

    describe('.setItems()', function(){
        const collection = new Collection();
        collection.setItems([{id: 3}]);
        const ret = collection.setItems(items);
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
        it('...with a \'isCollection\' property', function(){
            expect(collection.toJSON().isCollection).to.be.true;
        });
        it('...with an items array', function(){
            expect(collection.toJSON().items).to.be.an('array');
        });

        it('calls toJSON() on items if they have a toJSON method', function() {
          const collectionItem = {
            type: "component",
            id: 3,
            toJSON: function() {}
          }

          sinon.spy(collectionItem, 'toJSON');

          collection.pushItem(collectionItem);
          collection.toJSON();
          expect(collectionItem.toJSON.called).to.be.true;
          collection.removeItem(collectionItem);
        });
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


    it('is iterable', function(){
        expect(collection[Symbol.iterator]).to.be.a('function');
    });

});
