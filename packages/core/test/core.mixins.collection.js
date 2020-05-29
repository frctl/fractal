'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const mix = require('../src/mixins/mix');
const Collection = mix(require('../src/mixins/collection'));
const Stream = require('../src/array-stream');

const items = [
    {
        type: 'component',
        id: 1,
    },
    {
        type: 'component',
        id: 2,
    },
];

describe('Collection', function () {
    describe('new instance', function () {
        it('returns a Collection instance', function () {
            const collection = new Collection();
            expect(collection).to.be.instanceof(Collection);
        });
    });

    describe('.size', function () {
        it('returns zero for an empty collection', function () {
            const collection = new Collection();
            expect(collection.size).to.equal(0);
        });
        it('returns the number of items for an non-empty collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.size).to.equal(items.length);
        });
    });

    describe('.items()', function () {
        it('returns an array', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.items()).to.be.an('array');
        });
        it('...with the expected length', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.items().length).to.equal(items.length);
        });
    });

    describe('.setItems()', function () {
        it('sets empty array when called without params', function () {
            const collection = new Collection();

            collection.setItems(items);
            expect(collection.size).to.equal(2);
            collection.setItems();
            expect(collection.size).to.equal(0);
        });
        it('replaces any existing items', function () {
            const collection = new Collection();
            collection.setItems([{ id: 3 }]);
            expect(collection.size).to.equal(1);
            collection.setItems(items);
            const collectionItems = collection.items();
            expect(collection.size).to.equal(2);
            expect(collectionItems[0].id).to.equal(1);
            expect(collectionItems[1].id).to.equal(2);
        });
        it('is chainable', function () {
            const collection = new Collection();
            const ret = collection.setItems(items);
            expect(ret).to.equal(collection);
        });
    });

    describe('.pushItem()', function () {
        it('adds an item to collection', function () {
            const collection = new Collection();
            collection.pushItem(items[0]);
            expect(collection.size).to.equal(1);
            expect(collection.items()[0].id).to.equal(1);
        });
        it('is chainable', function () {
            const collection = new Collection();
            const ret = collection.pushItem(items[0]);
            expect(ret).to.equal(collection);
        });
    });

    describe('.removeItem()', function () {
        it('removes an item from collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.size).to.equal(2);
            collection.removeItem(items[0]);
            expect(collection.size).to.equal(1);
            expect(collection.items()[0].id).to.equal(2);
        });
        it('is chainable', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.removeItem(items[0]);
            expect(ret).to.equal(collection);
        });
    });

    describe('.toJSON()', function () {
        it('returns a plain object', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON()).to.be.an('object');
            expect(collection.toJSON()).to.not.be.instanceof(Collection);
        });
        it("...with a 'isCollection' property", function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON().isCollection).to.be.true;
        });
        it('...with an items array', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON().items).to.be.an('array');
        });
        it('calls toJSON() on items if they have a toJSON method', function () {
            const collection = new Collection();
            const collectionItem = {
                type: 'component',
                id: 3,
                toJSON: function () {},
            };
            collection.setItems([...items, collectionItem]);
            sinon.spy(collectionItem, 'toJSON');
            collection.toJSON();
            expect(collectionItem.toJSON.called).to.be.true;
        });
    });

    describe('.toStream()', function () {
        it('returns a Stream instance', function () {
            const collection = new Collection();
            expect(collection.toStream()).to.be.instanceOf(Stream);
        });
    });

    describe('.each()', function () {
        it('runs specified function n times', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            collection.each(callback);
            expect(callback.callCount).to.equal(2);
            expect(callback.getCall(0).calledWith(items[0])).to.be.true;
            expect(callback.getCall(1).calledWith(items[1])).to.be.true;
        });
        it('is chainable', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            const ret = collection.each(callback);
            expect(ret).to.equal(collection);
        });
    });

    describe('.forEach()', function () {
        it('runs specified function n times', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            collection.forEach(callback);
            expect(callback.callCount).to.equal(2);
            expect(callback.getCall(0).calledWith(items[0])).to.be.true;
            expect(callback.getCall(1).calledWith(items[1])).to.be.true;
        });
        it('is chainable', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            const ret = collection.forEach(callback);

            expect(ret).to.equal(collection);
        });
    });

    describe('.map()', function () {
        it('runs specified function n times', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            collection.map(callback);
            expect(callback.callCount).to.equal(2);
            expect(callback.getCall(0).calledWith(items[0])).to.be.true;
            expect(callback.getCall(1).calledWith(items[1])).to.be.true;
        });
        it('returns a new collection', function () {
            const collection = new Collection();
            const callback = sinon.fake();
            collection.setItems(items);
            const ret = collection.map(callback);
            expect(ret).to.not.equal(collection);
        });
    });

    describe('.first()', function () {
        it('returns the first item in the collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.first()).to.equal(items[0]);
        });
        it('returns undefined if collection is empty', function () {
            const collection = new Collection();
            expect(collection.first()).to.equal(undefined);
        });
    });

    describe('.last()', function () {
        it('returns the last item in the collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.last()).to.equal(items[items.length - 1]);
        });
        it('returns undefined if collection is empty', function () {
            const collection = new Collection();
            expect(collection.last()).to.equal(undefined);
        });
    });

    describe('.eq()', function () {
        it('returns the item at the specified position in the collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.eq(0)).to.equal(items[0]);
            expect(collection.eq(1)).to.equal(items[1]);
        });
        it('returns the item at the specified position from the end if the position is negative', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.eq(-1)).to.equal(items[1]);
            expect(collection.eq(-2)).to.equal(items[0]);
        });
        it('returns undefined if collection is empty', function () {
            const collection = new Collection();
            expect(collection.eq(0)).to.equal(undefined);
        });
        it('returns undefined if the position is out of bounds', function () {
            const collection = new Collection();
            expect(collection.eq(9)).to.equal(undefined);
        });
    });

    describe('.collections()', function () {
        it('returns a new collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            const newCollection = collection.collections();
            expect(newCollection).to.not.equal(collection);
        });
        it("...containing only items with a type of 'collection'", function () {
            const collection = new Collection();
            collection.setItems([
                ...items,
                {
                    id: 3,
                    isCollection: true,
                },
            ]);
            const newCollection = collection.collections();
            expect(newCollection.size).to.equal(1);
            expect(newCollection.eq(0).isCollection).to.be.true;
        });
    });

    describe('.orderBy()', function () {
        it('sorts items by specified key', function () {
            const collection = new Collection();
            collection.setItems([items[1], items[0]]);
            const ret = collection.orderBy('id');
            expect(ret.first()).to.equal(items[0]);
        });
        it('sorts items by specified key', function () {
            const collection = new Collection();
            collection.setItems([items[1], items[0]]);
            const ret = collection.orderBy('id');
            expect(ret.first()).to.equal(items[0]);
        });
        it('sorts items by specified key descending', function () {
            const collection = new Collection();
            collection.setItems([items[0], items[1]]);
            const ret = collection.orderBy('id', 'desc');
            expect(ret.first()).to.equal(items[1]);
        });
        it('sorts items by specified key descending when argument is object', function () {
            const collection = new Collection();
            collection.setItems([items[0], items[1]]);
            const ret = collection.orderBy({ id: 'desc' });
            expect(ret.first()).to.equal(items[1]);
        });
        it('returns a new collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.orderBy('id');
            expect(ret).to.not.equal(collection);
        });
    });

    describe('.find()', function () {
        it('returns undefined if collection has no items', function () {
            const collection = new Collection();
            expect(collection.find(items[0])).to.equal(undefined);
        });
        it('returns undefined if called without arguments', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find()).to.equal(undefined);
        });
        it('returns undefined if item is not in collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find({ id: 3 })).to.equal(undefined);
        });
        it('returns item if found in collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find(items[0])).to.equal(items[0]);
        });
        it('returns item if found in subcollection', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const item = { id: 3 };
            collection.setItems(items);
            subCollection.setItems([item]);
            collection.pushItem(subCollection);
            expect(collection.find(item)).to.equal(item);
        });
        it('returns undefined if item not found in subcollection', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const item = { id: 3 };
            subCollection.setItems(items);
            collection.pushItem(subCollection);
            expect(collection.find(item)).to.equal(undefined);
        });
        it('returns item when searched by handle', function () {
            const collection = new Collection();
            const itemWithHandle = {
                type: 'component',
                id: 3,
                handle: 'component',
            };
            collection.setItems([itemWithHandle]);
            expect(collection.find('@component')).to.equal(itemWithHandle);
        });
        it('returns item when searched by key and value', function () {
            const collection = new Collection();
            const itemWithHandle = {
                type: 'component',
                id: 3,
                handle: 'component',
            };
            collection.setItems([itemWithHandle]);
            expect(collection.find('id', 3)).to.equal(itemWithHandle);
        });
    });

    describe('.findCollection()', function () {
        const collectionItem = new Collection();
        collectionItem.setItems([items[0]]);
        const collectionItemTwo = new Collection();
        collectionItemTwo.setItems([items[1]]);

        it('returns undefined if collection has no items', function () {
            const collection = new Collection();
            expect(collection.findCollection(collectionItem)).to.equal(undefined);
        });
        it('returns undefined if called without arguments', function () {
            const collection = new Collection();
            collection.setItems([collectionItem]);
            expect(collection.findCollection()).to.equal(undefined);
        });
        it('returns undefined if collection is not found in collection', function () {
            const collection = new Collection();
            collection.setItems([...items, collectionItemTwo]);
            expect(collection.findCollection(collectionItem)).to.equal(undefined);
        });
        it('returns collection if found in collection', function () {
            const collection = new Collection();
            collection.setItems([collectionItem, collectionItemTwo]);
            expect(collection.findCollection(collectionItem)).to.equal(collectionItem);
        });
        it('returns item if found in subcollection', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const subSubCollection = new Collection();
            const item = { id: 3 };
            collection.setItems(items);
            subSubCollection.setItems(items);
            subCollection.setItems([item, subSubCollection]);
            collection.pushItem(subCollection);
            expect(collection.findCollection(subSubCollection)).to.equal(subSubCollection);
        });
    });

    describe('.flatten()', function () {
        it('returns items from subcollection', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.flatten();
            expect(ret.size).to.equal(3);
            expect(ret.find(subItem)).to.equal(subItem);
        });
        it('does not include any collections', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.flatten();
            expect(ret.find(subCollection)).to.equal(undefined);
            expect(ret.filter({ isCollection: true }).size).to.equal(0);
        });
        it('returns new collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.flatten();
            expect(ret).to.not.equal(collection);
        });
    });

    describe('.flattenDeep()', function () {
        it('calls .flatten() on items if they have a flatten method', function () {
            const collection = new Collection();
            const collectionItem = {
                id: 3,
                flatten: function () {
                    return this;
                },
                toArray: function () {},
            };
            collection.setItems([...items, collectionItem]);
            sinon.spy(collectionItem, 'flatten');
            collection.flattenDeep();
            expect(collectionItem.flatten.called).to.be.true;
        });
        it('returns new collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.flattenDeep();
            expect(ret).to.not.equal(collection);
        });
    });

    describe('.filter()', function () {
        it('filters items with a key and value', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.filter('id', 1);
            expect(ret.size).to.equal(1);
        });
        it('filters items with a function', function () {
            const collection = new Collection();
            collection.setItems(items);
            const callback = sinon.fake(function (item) {
                return item.isCollection;
            });
            const ret = collection.filter(callback);
            expect(ret.size).to.equal(0);
            expect(callback.called).to.be.true;
        });
        it('filters items from a subcollection', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3, type: 'component' };
            subCollection.setItems([subItem, { id: 4 }]);
            collection.setItems([...items, subCollection]);
            const ret = collection.filter('type', 'component');
            expect(ret.size).to.equal(3);
            expect(ret.last().size).to.equal(1);
        });
        it('does not keep subcollection if filtered subcollection is empty', function () {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.filter('type', 'component');
            expect(ret.size).to.equal(2);
        });
        it('returns new collection', function () {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.filter();
            expect(ret).to.not.equal(collection);
        });
    });

    it('is iterable', function () {
        const collection = new Collection();
        collection.setItems(items);
        expect(collection[Symbol.iterator]).to.be.a('function');
    });
});
