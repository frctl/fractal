/* eslint no-unused-expressions: "off" */

// const path = require('path');
const {expect} = require('../../../../test/helpers');
const Collection = require('../src/collections/collection');

const EntityCollection = require('../src/collections/entity-collection');
const Entity = require('../src/entities/entity');

const FileCollection = require('../src/collections/file-collection');
const File = require('../src/entities/file');

const ComponentCollection = require('../src/collections/component-collection');
const Component = require('../src/entities/component');

const VariantCollection = require('../src/collections/variant-collection');
const Variant = require('../src/entities/variant');

const makeCollection = input => new Collection(input);
const makeComponentCollection = input => new ComponentCollection(input);
const makeVariantCollection = input => new VariantCollection(input);
const makeFileCollection = input => new FileCollection(input);
const makeEntityCollection = input => new EntityCollection(input);

const validFileDefs = [{
  path: '/component/a'
}, {
  path: '/component/b'
}, {
  path: '/component/c'
}];
const validEntityDefs = validFileDefs;
const validVariantDefs = [{
  name: 'variant-1',
  component: 'parent-component'
}, {
  name: 'variant-2',
  component: 'parent-component'
}, {
  name: 'variant-3',
  component: 'parent-component'
}];

const validComponentDefs = validFileDefs.map(entity => ({
  src: new File(entity)
}));

const componentMap = i => new Component(i);
const fileMap = i => new File(i);
const entityMap = i => new Entity(i);
const variantMap = i => new Variant(i);
const objectMap = i => Object.assign({}, i);

describe('Collection Mapping', function () {
  describe(`ComponentCollection`, function () {
    it(`syncronously converts to a ComponentCollection when map returns a Component`, function () {
      testAtoACollection(makeComponentCollection(validComponentDefs), componentMap, ComponentCollection, ComponentCollection);
    });
    it(`syncronously converts to a FileCollection when map returns a File`, function () {
      testCtoCCollection(makeComponentCollection(validComponentDefs), i => i.getSrc(), ComponentCollection, FileCollection);
    });
    it(`syncronously converts to a EntityCollection when map returns an Entity`, function () {
      testCtoACollection(makeComponentCollection(validComponentDefs), i => new Entity({
        src: i.getSrc()
      }), ComponentCollection, EntityCollection);
    });
    it(`syncronously converts to a VariantCollection when map returns a Variant`, function () {
      testCtoCCollection(makeComponentCollection(validComponentDefs), i => new Variant({
        name: i.getSrc().stem,
        component: 'parent-component'
      }), ComponentCollection, VariantCollection);
    });
    it(`syncronously converts to a Collection when map returns an Object`, function () {
      testCtoACollection(makeComponentCollection(validComponentDefs), objectMap, ComponentCollection, Collection);
    });
    it(`syncronously returns a ComponentCollection if an empty ComponentCollection is supplied`, function () {
      testAtoACollection(makeComponentCollection([]), objectMap, ComponentCollection, ComponentCollection);
    });

    it(`asyncronously converts to a ComponentCollection when mapAsync returns a Component`, async function () {
      await asyncTestAtoACollection(makeComponentCollection(validComponentDefs), componentMap, ComponentCollection, ComponentCollection);
    });
    it(`asyncronously converts to a FileCollection when mapAsync returns a File`, async function () {
      await asyncTestCtoCCollection(makeComponentCollection(validComponentDefs), async i => await Promise.resolve(i.getSrc()), ComponentCollection, FileCollection);
    });
    it(`asyncronously converts to a EntityCollection when mapAsync returns an Entity`, async function () {
      await asyncTestCtoACollection(makeComponentCollection(validComponentDefs), async i => await Promise.resolve(new Entity({
        src: i.getSrc()
      })), ComponentCollection, EntityCollection);
    });
    it(`asyncronously converts to a VariantCollection when mapAsync returns a Variant`, async function () {
      await asyncTestCtoCCollection(makeComponentCollection(validComponentDefs), async i => await Promise.resolve(new Variant({
        name: i.getSrc().stem,
        component: 'parent-component'
      })), ComponentCollection, VariantCollection);
    });
    it(`asyncronously converts to a Collection when mapAsync returns an Object`, async function () {
      await asyncTestCtoACollection(makeComponentCollection(validComponentDefs), objectMap, ComponentCollection, Collection);
    });
    it(`asyncronously returns a ComponentCollection if an empty ComponentCollection is supplied`, async function () {
      await asyncTestAtoACollection(makeComponentCollection([]), async i => await Promise.resolve(new Variant({
        name: i.getSrc().stem,
        component: 'parent-component'
      })), ComponentCollection, ComponentCollection);
    });
  });

  describe(`FileCollection`, function () {
    it(`syncronously converts to a ComponentCollection when map returns a Component`, function () {
      testCtoCCollection(makeFileCollection(validFileDefs), i => new Component({
        src: i
      }), FileCollection, ComponentCollection);
    });
    it(`syncronously converts to a FileCollection when map returns a File`, function () {
      testAtoACollection(makeFileCollection(validFileDefs), fileMap, FileCollection, FileCollection);
    });
    it(`syncronously converts to a EntityCollection when map returns an Entity`, function () {
      testCtoACollection(makeFileCollection(validFileDefs), i => new Entity({
        src: i.stem
      }), FileCollection, EntityCollection);
    });
    it(`syncronously converts to a VariantCollection when map returns a Variant`, function () {
      testCtoCCollection(makeFileCollection(validFileDefs), i => new Variant({
        name: i.stem,
        component: 'parent-component'
      }), FileCollection, VariantCollection);
    });
    it(`syncronously converts to a Collection when map returns an Object`, function () {
      testCtoACollection(makeFileCollection(validFileDefs), objectMap, FileCollection, Collection);
    });
    it(`syncronously returns a FileCollection if an empty FileCollection is supplied`, function () {
      testAtoACollection(makeFileCollection([]), objectMap, FileCollection, Collection);
    });

    it(`asyncronously converts to a ComponentCollection when mapAsync returns a Component`, async function () {
      await asyncTestCtoCCollection(makeFileCollection(validFileDefs), async i => await new Component({
        src: i
      }), FileCollection, ComponentCollection);
    });
    it(`asyncronously converts to a FileCollection when mapAsync returns a File`, async function () {
      await asyncTestAtoACollection(makeFileCollection(validFileDefs), fileMap, FileCollection, FileCollection);
    });
    it(`asyncronously converts to a EntityCollection when mapAsync returns an Entity`, async function () {
      await asyncTestCtoACollection(makeFileCollection(validFileDefs), async i => await Promise.resolve(new Entity({
        src: i.stem
      })), FileCollection, EntityCollection);
    });
    it(`asyncronously converts to a VariantCollection when mapAsync returns a Variant`, async function () {
      await asyncTestCtoCCollection(makeFileCollection(validFileDefs), async i => await Promise.resolve(new Variant({
        name: i.stem,
        component: 'parent-component'
      })), FileCollection, VariantCollection);
    });
    it(`asyncronously converts to a Collection when mapAsync returns an Object`, async function () {
      await asyncTestCtoACollection(makeFileCollection(validFileDefs), objectMap, FileCollection, Collection);
    });
    it(`asyncronously returns a FileCollection if an empty FileCollection is supplied`, async function () {
      await asyncTestAtoACollection(makeFileCollection([]), async i => await Promise.resolve(new Variant({
        name: i.stem,
        component: 'parent-component'
      })), FileCollection, FileCollection);
    });
  });

  describe(`EntityCollection`, function () {
    it(`syncronously converts to a ComponentCollection when map returns a Component`, function () {
      testAtoCCollection(makeEntityCollection(validEntityDefs), i => new Component({
        src: new File(i)
      }), EntityCollection, ComponentCollection);
    });
    it(`syncronously converts to a FileCollection when map returns a File`, function () {
      testAtoCCollection(makeEntityCollection(validEntityDefs), fileMap, EntityCollection, FileCollection);
    });
    it(`syncronously converts to a EntityCollection when map returns an Entity`, function () {
      testAtoACollection(makeEntityCollection(validEntityDefs), entityMap, EntityCollection, EntityCollection);
    });
    it(`syncronously converts to a VariantCollection when map returns a Variant`, function () {
      testAtoCCollection(makeEntityCollection(validEntityDefs), i => new Variant({
        name: i.path,
        component: 'parent-component'
      }), EntityCollection, VariantCollection);
    });
    it(`syncronously converts to a Collection when map returns an Object`, function () {
      testCtoACollection(makeEntityCollection(validEntityDefs), objectMap, EntityCollection, Collection);
    });
    it(`syncronously returns an EntityCollection when an empty EntityCollection is provided`, function () {
      testAtoACollection(makeEntityCollection([]), objectMap, EntityCollection, EntityCollection);
    });

    it(`asyncronously converts to a ComponentCollection when mapAsync returns a Component`, async function () {
      await asyncTestAtoCCollection(makeEntityCollection(validEntityDefs), async i => await Promise.resolve(new Component({
        src: new File(i)
      })), EntityCollection, ComponentCollection);
    });
    it(`asyncronously converts to a FileCollection when mapAsync returns a File`, async function () {
      await asyncTestAtoCCollection(makeEntityCollection(validEntityDefs), fileMap, EntityCollection, FileCollection);
    });
    it(`asyncronously converts to a EntityCollection when mapAsync returns an Entity`, async function () {
      await asyncTestAtoACollection(makeEntityCollection(validEntityDefs), entityMap, EntityCollection, EntityCollection);
    });
    it(`asyncronously converts to a VariantCollection when mapAsync returns a Variant`, async function () {
      await asyncTestAtoCCollection(makeEntityCollection(validEntityDefs), async i => await Promise.resolve(new Variant({
        name: i.path,
        component: 'parent-component'
      })), EntityCollection, VariantCollection);
    });
    it(`asyncronously converts to a Collection when mapAsync returns an Object`, async function () {
      await asyncTestCtoACollection(makeEntityCollection(validEntityDefs), objectMap, EntityCollection, Collection);
    });
    it(`asyncronously returns an EntityCollection when an empty EntityCollection is provided`, async function () {
      await asyncTestAtoACollection(makeEntityCollection([]), async i => await Promise.resolve(new Component({
        src: new File(i)
      })), EntityCollection, EntityCollection);
    });
  });

  describe(`VariantCollection`, function () {
    it(`syncronously converts to a ComponentCollection when map returns a Component`, function () {
      testCtoCCollection(makeVariantCollection(validVariantDefs), i => new Component({src: new File({path: i.name})}), VariantCollection, ComponentCollection);
    });
    it(`syncronously converts to a FileCollection when map returns a File`, function () {
      testCtoCCollection(makeVariantCollection(validVariantDefs), i => new File({path: i.name}), VariantCollection, FileCollection);
    });
    it(`syncronously converts to a EntityCollection when map returns an Entity`, function () {
      testCtoACollection(makeVariantCollection(validVariantDefs), i => new Entity({
        src: i.name
      }), VariantCollection, EntityCollection);
    });
    it(`syncronously converts to a VariantCollection when map returns a Variant`, function () {
      testAtoACollection(makeVariantCollection(validVariantDefs), variantMap, VariantCollection, VariantCollection);
    });
    it(`syncronously converts to a Collection when map returns an Object`, function () {
      testCtoACollection(makeVariantCollection(validVariantDefs), objectMap, VariantCollection, Collection);
    });
    it(`asyncronously returns a VariantCollection when an empty VariantCollection is provided`, function () {
      testAtoACollection(makeVariantCollection([]), objectMap, VariantCollection, VariantCollection);
    });

    it(`asyncronously converts to a ComponentCollection when mapAsync returns a Component`, async function () {
      await asyncTestCtoCCollection(makeVariantCollection(validVariantDefs), async i => await Promise.resolve(new Component({src: new File({path: i.name})})), VariantCollection, ComponentCollection);
    });
    it(`asyncronously converts to a FileCollection when mapAsync returns a File`, async function () {
      await asyncTestCtoCCollection(makeVariantCollection(validVariantDefs), async i => await Promise.resolve(new File({path: i.name})), VariantCollection, FileCollection);
    });
    it(`asyncronously converts to a EntityCollection when mapAsync returns an Entity`, async function () {
      await asyncTestCtoACollection(makeVariantCollection(validVariantDefs), async i => await Promise.resolve(new Entity({
        src: i.name
      })), VariantCollection, EntityCollection);
    });
    it(`asyncronously converts to a VariantCollection when mapAsync returns a Variant`, async function () {
      await asyncTestAtoACollection(makeVariantCollection(validVariantDefs), variantMap, VariantCollection, VariantCollection);
    });
    it(`asyncronously converts to a Collection when mapAsync returns an Object`, async function () {
      await asyncTestCtoACollection(makeVariantCollection(validVariantDefs), objectMap, VariantCollection, Collection);
    });
    it(`asyncronously returns a VariantCollection when an empty VariantCollection is provided`, async function () {
      await asyncTestAtoACollection(makeVariantCollection([]), async i => await Promise.resolve(new Component({src: new File({path: i.name})})), VariantCollection, VariantCollection);
    });
  });

  describe(`Collection`, function () {
    it(`syncronously converts to a ComponentCollection when map returns a Component`, function () {
      testAtoCCollection(makeCollection(validComponentDefs), componentMap, Collection, ComponentCollection);
    });
    it(`syncronously converts to a FileCollection when map returns a File`, function () {
      testAtoCCollection(makeCollection(validFileDefs), fileMap, Collection, FileCollection);
    });
    it(`syncronously converts to a EntityCollection when map returns an Entity`, function () {
      testAtoCCollection(makeCollection(validEntityDefs), entityMap, Collection, EntityCollection);
    });
    it(`syncronously converts to a VariantCollection when map returns a Variant`, function () {
      testAtoCCollection(makeCollection(validVariantDefs), variantMap, Collection, VariantCollection);
    });
    it(`syncronously converts to a Collection when map returns an Object`, function () {
      testAtoACollection(makeCollection(validComponentDefs), objectMap, Collection, Collection);
    });
    it(`syncronously returns a Collection when an empty Collection is supplied`, function () {
      testAtoACollection(makeCollection([]), objectMap, Collection, Collection);
    });

    it(`asyncronously converts to a ComponentCollection when mapAsync returns a Component`, async function () {
      await asyncTestAtoCCollection(makeCollection(validComponentDefs), componentMap, Collection, ComponentCollection);
    });
    it(`asyncronously converts to a FileCollection when mapAsync returns a File`, async function () {
      await asyncTestAtoCCollection(makeCollection(validFileDefs), fileMap, Collection, FileCollection);
    });
    it(`asyncronously converts to a EntityCollection when mapAsync returns an Entity`, async function () {
      await asyncTestAtoCCollection(makeCollection(validEntityDefs), entityMap, Collection, EntityCollection);
    });
    it(`asyncronously converts to a VariantCollection when mapAsync returns a Variant`, async function () {
      await asyncTestAtoCCollection(makeCollection(validVariantDefs), variantMap, Collection, VariantCollection);
    });
    it(`asyncronously converts to a Collection when mapAsync returns an Object`, async function () {
      await asyncTestAtoACollection(makeCollection(validComponentDefs), async i => await Promise.resolve(Object.assign({}, i)), Collection, Collection);
    });
    it(`asyncronously returns a Collection when an empty Collection is supplied`, async function () {
      await asyncTestAtoACollection(makeCollection(validComponentDefs), async i => await Promise.resolve(Object.assign({}, i)), Collection, Collection);
    });
  });
});

function testAtoACollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(true);
  let newCollection = collection.map(map);
  expect(newCollection instanceof Original).to.equal(true);
  expect(newCollection instanceof Final).to.equal(true);
}

function testAtoCCollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(false);
  let newCollection = collection.map(map);
  expect(newCollection instanceof Original).to.equal(true);
  expect(newCollection instanceof Final).to.equal(true);
}

function testCtoACollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(true);
  let newCollection = collection.map(map);
  expect(newCollection instanceof Original).to.equal(false);
  expect(newCollection instanceof Final).to.equal(true);
}

function testCtoCCollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(false);
  let newCollection = collection.map(map);
  expect(newCollection instanceof Original).to.equal(false);
  expect(newCollection instanceof Final).to.equal(true);
}

async function asyncTestAtoACollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(true);
  let newCollection = await collection.mapAsync(map);
  expect(newCollection instanceof Original).to.equal(true);
  expect(newCollection instanceof Final).to.equal(true);
}

async function asyncTestAtoCCollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(false);
  let newCollection = await collection.mapAsync(map);
  expect(newCollection instanceof Original).to.equal(true);
  expect(newCollection instanceof Final).to.equal(true);
}

async function asyncTestCtoACollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(true);
  let newCollection = await collection.mapAsync(map);
  expect(newCollection instanceof Original).to.equal(false);
  expect(newCollection instanceof Final).to.equal(true);
}

async function asyncTestCtoCCollection(collection, map, Original, Final) {
  expect(collection instanceof Original).to.equal(true);
  expect(collection instanceof Final).to.equal(false);
  let newCollection = await collection.mapAsync(map);
  expect(newCollection instanceof Original).to.equal(false);
  expect(newCollection instanceof Final).to.equal(true);
}
