const mix = require('../../src/mixins/mix');
const Collection = mix(require('../../src/mixins/collection'));
const Stream = require('../../src/array-stream');

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

describe('Collection', () => {
    describe('new instance', () => {
        it('returns a Collection instance', () => {
            const collection = new Collection();
            expect(collection).toBeInstanceOf(Collection);
        });
    });

    describe('.initCollection', () => {
        it('sets root property to what is provided via config', () => {
            const collection = new Collection();
            collection.initCollection({ root: true });
            expect(collection.isRoot).toBeTrue();
        });

        it('sets root property to false by default', () => {
            const collection = new Collection();
            collection.initCollection({});
            expect(collection.isRoot).toBeFalse();
        });
    });

    describe('.size', () => {
        it('returns zero for an empty collection', () => {
            const collection = new Collection();
            expect(collection.size).toEqual(0);
        });
        it('returns the number of items for an non-empty collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.size).toEqual(items.length);
        });
    });

    describe('.items()', () => {
        it('returns an array', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.items()).toBeArray();
        });
        it('...with the expected length', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.items().length).toEqual(items.length);
        });
    });

    describe('.setItems()', () => {
        it('sets empty array when called without params', () => {
            const collection = new Collection();

            collection.setItems(items);
            expect(collection.size).toEqual(2);
            collection.setItems();
            expect(collection.size).toEqual(0);
        });
        it('replaces any existing items', () => {
            const collection = new Collection();
            collection.setItems([{ id: 3 }]);
            expect(collection.size).toEqual(1);
            collection.setItems(items);
            const collectionItems = collection.items();
            expect(collection.size).toEqual(2);
            expect(collectionItems[0].id).toEqual(1);
            expect(collectionItems[1].id).toEqual(2);
        });
        it('is chainable', () => {
            const collection = new Collection();
            const ret = collection.setItems(items);
            expect(ret).toEqual(collection);
        });
    });

    describe('.pushItem()', () => {
        it('adds an item to collection', () => {
            const collection = new Collection();
            collection.pushItem(items[0]);
            expect(collection.size).toEqual(1);
            expect(collection.items()[0].id).toEqual(1);
        });
        it('is chainable', () => {
            const collection = new Collection();
            const ret = collection.pushItem(items[0]);
            expect(ret).toEqual(collection);
        });
    });

    describe('.removeItem()', () => {
        it('removes an item from collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.size).toEqual(2);
            collection.removeItem(items[0]);
            expect(collection.size).toEqual(1);
            expect(collection.items()[0].id).toEqual(2);
        });
        it('is chainable', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.removeItem(items[0]);
            expect(ret).toEqual(collection);
        });
    });

    describe('.toJSON()', () => {
        it('returns a plain object', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON()).toBeObject();
            expect(collection.toJSON()).not.toBeInstanceOf(Collection);
        });
        it("...with a 'isCollection' property", () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON().isCollection).toBeTrue();
        });
        it('...with an items array', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.toJSON().items).toBeArray();
        });
        it('calls toJSON() on items if they have a toJSON method', () => {
            const collection = new Collection();
            const toJSON = jest.fn();
            const collectionItem = {
                type: 'component',
                id: 3,
                toJSON: toJSON,
            };
            collection.setItems([...items, collectionItem]);
            collection.toJSON();
            expect(toJSON).toHaveBeenCalled();
        });
    });

    describe('.toStream()', () => {
        it('returns a Stream instance', () => {
            const collection = new Collection();
            expect(collection.toStream()).toBeInstanceOf(Stream);
        });
    });

    describe('.each()', () => {
        it('runs specified function n times', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            collection.each(callback);
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenNthCalledWith(1, items[0], 0, items);
            expect(callback).toHaveBeenNthCalledWith(2, items[1], 1, items);
        });
        it('is chainable', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            const ret = collection.each(callback);
            expect(ret).toEqual(collection);
        });
    });

    describe('.forEach()', () => {
        it('runs specified function n times', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            collection.forEach(callback);
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenNthCalledWith(1, items[0], 0, items);
            expect(callback).toHaveBeenNthCalledWith(2, items[1], 1, items);
        });
        it('is chainable', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            const ret = collection.forEach(callback);

            expect(ret).toEqual(collection);
        });
    });

    describe('.map()', () => {
        it('runs specified function n times', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            collection.map(callback);
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenNthCalledWith(1, items[0], 0, items);
            expect(callback).toHaveBeenNthCalledWith(2, items[1], 1, items);
        });
        it('returns a new collection', () => {
            const collection = new Collection();
            const callback = jest.fn();
            collection.setItems(items);
            const ret = collection.map(callback);
            expect(ret).not.toBe(collection);
        });
    });

    describe('.first()', () => {
        it('returns the first item in the collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.first()).toEqual(items[0]);
        });
        it('returns undefined if collection is empty', () => {
            const collection = new Collection();
            expect(collection.first()).toEqual(undefined);
        });
    });

    describe('.last()', () => {
        it('returns the last item in the collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.last()).toEqual(items[items.length - 1]);
        });
        it('returns undefined if collection is empty', () => {
            const collection = new Collection();
            expect(collection.last()).toEqual(undefined);
        });
    });

    describe('.eq()', () => {
        it('returns the item at the specified position in the collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.eq(0)).toEqual(items[0]);
            expect(collection.eq(1)).toEqual(items[1]);
        });
        it('returns the item at the specified position from the end if the position is negative', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.eq(-1)).toEqual(items[1]);
            expect(collection.eq(-2)).toEqual(items[0]);
        });
        it('returns undefined if collection is empty', () => {
            const collection = new Collection();
            expect(collection.eq(0)).toEqual(undefined);
        });
        it('returns undefined if the position is out of bounds', () => {
            const collection = new Collection();
            expect(collection.eq(9)).toEqual(undefined);
        });
    });

    describe('.collections()', () => {
        it('returns a new collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            const newCollection = collection.collections();
            expect(newCollection).not.toBe(collection);
        });
        it("...containing only items with a type of 'collection'", () => {
            const collection = new Collection();
            collection.setItems([
                ...items,
                {
                    id: 3,
                    isCollection: true,
                },
            ]);
            const newCollection = collection.collections();
            expect(newCollection.size).toEqual(1);
            expect(newCollection.eq(0).isCollection).toBeTrue();
        });
    });

    describe('.rootCollections()', () => {
        it('returns a new collection containing all root collections', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subSubCollection = new Collection();
            const item = { id: 3 };
            collection.initCollection({});
            collection.setItems(items);
            subSubCollection.initCollection({ root: true });
            subSubCollection.setItems(items);
            subCollection.initCollection({ root: true });
            subCollection.setItems([item, subSubCollection]);
            collection.pushItem(subCollection);
            const newCollection = collection.rootCollections();
            expect(newCollection).not.toBe(collection);
            expect(newCollection.size).toEqual(2);
            expect(newCollection.eq(0).isRoot).toBeTrue();
            expect(newCollection.eq(1).isRoot).toBeTrue();
        });
    });

    describe('.orderBy()', () => {
        it('sorts items by specified key', () => {
            const collection = new Collection();
            collection.setItems([items[1], items[0]]);
            const ret = collection.orderBy('id');
            expect(ret.first()).toEqual(items[0]);
        });
        it('sorts items by specified key', () => {
            const collection = new Collection();
            collection.setItems([items[1], items[0]]);
            const ret = collection.orderBy('id');
            expect(ret.first()).toEqual(items[0]);
        });
        it('sorts items by specified key descending', () => {
            const collection = new Collection();
            collection.setItems([items[0], items[1]]);
            const ret = collection.orderBy('id', 'desc');
            expect(ret.first()).toEqual(items[1]);
        });
        it('sorts items by specified key descending when argument is object', () => {
            const collection = new Collection();
            collection.setItems([items[0], items[1]]);
            const ret = collection.orderBy({ id: 'desc' });
            expect(ret.first()).toEqual(items[1]);
        });
        it('returns a new collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.orderBy('id');
            expect(ret).not.toBe(collection);
        });
    });

    describe('.find()', () => {
        it('returns undefined if collection has no items', () => {
            const collection = new Collection();
            expect(collection.find(items[0])).toEqual(undefined);
        });
        it('returns undefined if called without arguments', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find()).toEqual(undefined);
        });
        it('returns undefined if item is not in collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find({ id: 3 })).toEqual(undefined);
        });
        it('returns item if found in collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            expect(collection.find(items[0])).toEqual(items[0]);
        });
        it('returns item if found in subcollection', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const item = { id: 3 };
            collection.setItems(items);
            subCollection.setItems([item]);
            collection.pushItem(subCollection);
            expect(collection.find(item)).toEqual(item);
        });
        it('returns undefined if item not found in subcollection', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const item = { id: 3 };
            subCollection.setItems(items);
            collection.pushItem(subCollection);
            expect(collection.find(item)).toEqual(undefined);
        });
        it('returns item when searched by handle', () => {
            const collection = new Collection();
            const itemWithHandle = {
                type: 'component',
                id: 3,
                handle: 'component',
            };
            collection.setItems([itemWithHandle]);
            expect(collection.find('@component')).toEqual(itemWithHandle);
        });
        it('returns item when searched by key and value', () => {
            const collection = new Collection();
            const itemWithHandle = {
                type: 'component',
                id: 3,
                handle: 'component',
            };
            collection.setItems([itemWithHandle]);
            expect(collection.find('id', 3)).toEqual(itemWithHandle);
        });
    });

    describe('.findCollection()', () => {
        const collectionItem = new Collection();
        collectionItem.setItems([items[0]]);
        const collectionItemTwo = new Collection();
        collectionItemTwo.setItems([items[1]]);

        it('returns undefined if collection has no items', () => {
            const collection = new Collection();
            expect(collection.findCollection(collectionItem)).toEqual(undefined);
        });
        it('returns undefined if called without arguments', () => {
            const collection = new Collection();
            collection.setItems([collectionItem]);
            expect(collection.findCollection()).toEqual(undefined);
        });
        it('returns undefined if collection is not found in collection', () => {
            const collection = new Collection();
            collection.setItems([...items, collectionItemTwo]);
            expect(collection.findCollection(collectionItem)).toEqual(undefined);
        });
        it('returns collection if found in collection', () => {
            const collection = new Collection();
            collection.setItems([collectionItem, collectionItemTwo]);
            expect(collection.findCollection(collectionItem)).toEqual(collectionItem);
        });
        it('returns item if found in subcollection', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subSubCollection = new Collection();
            const item = { id: 3 };
            collection.setItems(items);
            subSubCollection.setItems(items);
            subCollection.setItems([item, subSubCollection]);
            collection.pushItem(subCollection);
            expect(collection.findCollection(subSubCollection)).toEqual(subSubCollection);
        });
    });

    describe('.flatten()', () => {
        it('returns items from subcollection', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.flatten();
            expect(ret.size).toEqual(3);
            expect(ret.find(subItem)).toEqual(subItem);
        });
        it('does not include any collections', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.flatten();
            expect(ret.find(subCollection)).toEqual(undefined);
            expect(ret.filter({ isCollection: true }).size).toEqual(0);
        });
        it('returns collections from subcollections', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.flatten('collections');
            expect(ret.size).toEqual(1);
            expect(ret.eq(0)).toEqual(subCollection);
        });
        it('returns new collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.flatten();
            expect(ret).not.toBe(collection);
        });
    });

    describe('.flattenDeep()', () => {
        it('calls .flatten() on items if they have a flatten method', () => {
            const collection = new Collection();
            const flatten = jest.fn(() => collectionItem);
            const collectionItem = {
                id: 3,
                flatten: flatten,
                toArray: () => {},
            };
            collection.setItems([...items, collectionItem]);
            collection.flattenDeep();
            expect(flatten).toHaveBeenCalled();
        });
        it('returns new collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.flattenDeep();
            expect(ret).not.toBe(collection);
        });
    });

    describe('.filter()', () => {
        it('filters items with a key and value', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.filter('id', 1);
            expect(ret.size).toEqual(1);
        });
        it('filters items with a function', () => {
            const collection = new Collection();
            collection.setItems(items);
            const callback = jest.fn((item) => {
                return item.isCollection;
            });
            const ret = collection.filter(callback);
            expect(ret.size).toEqual(0);
            expect(callback).toHaveBeenCalled();
        });
        it('filters items from a subcollection', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3, type: 'component' };
            subCollection.setItems([subItem, { id: 4 }]);
            collection.setItems([...items, subCollection]);
            const ret = collection.filter('type', 'component');
            expect(ret.size).toEqual(3);
            expect(ret.last().size).toEqual(1);
        });
        it('does not keep subcollection if filtered subcollection is empty', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3 };
            subCollection.setItems([subItem]);
            collection.setItems([...items, subCollection]);
            const ret = collection.filter('type', 'component');
            expect(ret.size).toEqual(2);
        });
        it('returns new collection', () => {
            const collection = new Collection();
            collection.setItems(items);
            const ret = collection.filter();
            expect(ret).not.toBe(collection);
        });
    });

    describe('.filterAll()', () => {
        it('keeps collections if they match filter', () => {
            const collection = new Collection();
            const subCollection = new Collection();
            const subItem = { id: 3, type: 'component' };
            subCollection.initCollection({ root: true });
            subCollection.setItems([subItem, { id: 4 }]);
            collection.setItems([...items, subCollection]);
            const ret = collection.filterAll('isRoot', true);
            expect(ret.size).toEqual(1);
            expect(ret.last().size).toEqual(2);
        });
    });

    it('is iterable', () => {
        const collection = new Collection();
        collection.setItems(items);
        expect(collection[Symbol.iterator]).toBeFunction();
    });

    it('is mixed in', () => {
        const collection = new Collection();
        expect(collection.hasMixedIn('Collection')).toBe(true);
    });
});
