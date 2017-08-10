/* eslint no-unused-expressions: "off" */

const path = require('path');
const {expect, sinon} = require('../../../../test/helpers');
const utils = require('../.');

/*
 * Support
 */

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

function timeoutPromiseFromObj(obj) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(obj);
    }, 200);
  });
}
/*
 * Objects
 */
describe('Utils', function () {
  describe('.defaultsDeep()', function () {
    it('Does not modify source objects', function () {
      let target = {};
      let defaults = {
        foo: 'bar'
      };
      let result = utils.defaultsDeep(target, defaults);

      expect(result).to.not.equal(defaults);
      expect(result).to.not.equal(target);
      expect(target).to.eql({});
      expect(defaults).to.eql({
        foo: 'bar'
      });
      expect(target).to.equal(target);
      expect(defaults).to.equal(defaults);
    });

    it('Recursively merges plain objects', function () {
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

    it('Does not merge non-plain-object values', function () {
      let target = {
        item: (new MyClass())
      };
      let defaults = {
        item: new MyOtherClass()
      };
      let plain = {
        item: {
          foo: 'plain'
        }
      };
      expect(utils.defaultsDeep(target, defaults)).to.eql(target);
      expect(utils.defaultsDeep(plain, defaults)).to.eql(plain);
      expect(utils.defaultsDeep(target, plain)).to.eql(target);
    });

    it('Does not merge array values', function () {
      let target = {
        items: ['one', 'two']
      };
      let defaults = {
        items: ['one', 'three', 'four']
      };
      expect(utils.defaultsDeep(target, defaults).items).to.eql(target.items);
    });

    it('accepts a customizer as the last argument to customize the merging behaviour', function () {
      let target = {
        items: ['one', 'two']
      };
      let defaults = {
        items: ['three', 'four']
      };
      function customizer(objValue, srcValue) {
        if (Array.isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      }
      expect(utils.defaultsDeep(target, defaults, customizer).items).to.have.same.members(['one', 'two', 'three', 'four']);
    });

    it('Returns the default value if the target property is undefined', function () {
      let target = {
        anotherItem: 'foo',
        nullItem: null,
        undefinedItem: undefined
      };
      let defaults = {
        item: ['one', 'three', 'four'],
        nullItem: 'not null',
        undefinedItem: 'not undefined'
      };
      let result = utils.defaultsDeep(target, defaults);
      expect(result).to.have.property('anotherItem');
      expect(result).to.have.property('item');
      expect(result.nullItem).to.be.null;
      expect(result.undefinedItem).to.equal('not undefined');
    });
  });

  describe('.toJSON()', function () {
    it('Does not convert non-JSONifiable arguments', function () {
      expect(utils.toJSON('SOMETHING to JSONify')).to.equal('SOMETHING to JSONify');
      expect(utils.toJSON(2)).to.equal(2);
      expect(utils.toJSON({foo: 'bar'})).to.eql({foo: 'bar'});
    });
    it(`Converts an object with a 'toJSON' method to its JSON representation`, function () {
      let a = {foo: 'bar', toJSON: function () {
        return 'bar';
      }};
      expect(utils.toJSON(a)).to.equal('bar');
    });
  });

  describe('.resolveDeep()', function () {
    it('Throws an error if invalid arguments provided', async function () {
      let e;
      try {
        await utils.resolveDeep('asd');
      } catch (err) {
        e = err;
      }
      expect(e.toString()).to.match(/Error/);
    });

    it('Resolves promises that return objects', async function () {
      var x = await utils.resolveDeep(timeoutPromiseFromObj({
        title: 'Hello World!'
      }));
      expect(x).to.eql({
        title: 'Hello World!'
      });
    });
    it('Resolves nested promises that return objects', async function () {
      var x = await utils.resolveDeep(timeoutPromiseFromObj({
        promise: timeoutPromiseFromObj({
          title: 'Hello World!'
        })
      }));
      expect(x).to.eql({
        promise: {
          title: 'Hello World!'
        }
      });
    });
    it('Resolves nested objects', async function () {
      var x = await utils.resolveDeep({
        title: 'Hello World!',
        other: {
          nested: 'value'
        }
      });
      expect(x).to.eql({
        title: 'Hello World!',
        other: {
          nested: 'value'
        }
      });
    });
    it('Resolves nested objects with promises', async function () {
      var x = await utils.resolveDeep({
        title: 'Hello World!',
        promise: {
          nested: timeoutPromiseFromObj({data: 'value'})
        }
      });
      expect(x).to.eql({
        title: 'Hello World!',
        promise: {
          nested: {data: 'value'}
        }
      });
    });
    it('Resolves nested objects with nested promises', async function () {
      var x = await utils.resolveDeep({
        title: 'Hello World!',
        promise: {
          nested: timeoutPromiseFromObj({data: 'value', deep: {deeper: timeoutPromiseFromObj({deepest: true})}})
        }
      });
      expect(x).to.eql({
        title: 'Hello World!',
        promise: {
          nested: {data: 'value', deep: {
            deeper: {
              deepest: true
            }
          }}
        }
      });
    });
    it('Resolves functions that return an object (single level only)', async function () {
      var x = await utils.resolveDeep(function (value) {
        return {data: value};
      }, 'value!');

      expect(x).to.eql({data: 'value!'});
    });
  });
  /*
   * Strings
   */

  describe('.slugify()', function () {
    it('Slugifys and lowercases a string', function () {
      expect(utils.slugify('SOMETHING to Slugify')).to.equal('something-to-slugify');
    });

    it('Accepts an optional seperator', function () {
      expect(utils.slugify('SOMETHING to Slugify', '_')).to.equal('something_to_slugify');
    });
  });

  describe('.titlize()', function () {
    it('Converts a string to title case', function () {
      expect(utils.titlize('this is a STRING')).to.equal('This Is a STRING');
    });

    it('Replaces dashes and underscores with spaces', function () {
      expect(utils.titlize('this-is-a-string')).to.equal('This Is a String');
    });
  });

  describe('.normalizeName()', function () {
    it('Removes leading non-alphanumeric characters from string', function () {
      expect(utils.normalizeName('_string')).to.equal('string');
      expect(utils.normalizeName('_01_string')).to.equal('string');
      expect(utils.normalizeName('01_string')).to.equal('string');
      expect(utils.normalizeName('__01_02_string')).to.equal('string');
      expect(utils.normalizeName('_01-string')).to.equal('string');
      expect(utils.normalizeName('01string')).to.equal('string');
    });

    it('Converts a string to kebab case', function () {
      expect(utils.normalizeName('thisIsAString')).to.equal('this-is-a-string');
      expect(utils.normalizeName('this.Is.A.String')).to.equal('this-is-a-string');
      expect(utils.normalizeName('this.is.a.string')).to.equal('this-is-a-string');
    });
  });

  describe('.uniqueName()', function () {
    it('Checks that an array of existing values is provided', function () {
      expect(function () {
        utils.uniqueName('name');
      }).to.throw(TypeError, '[no-used-array]');
    });
    it('Returns original name and adds it to used array, if unique', function () {
      let name = 'name03';
      let used = ['name00', 'name01', 'name02'];
      let uniqueName = utils.uniqueName(name, used);
      expect(uniqueName).to.equal(name);
      expect(used).to.eql(['name00', 'name01', 'name02', 'name03']);
    });
    it('Returns modified unique name and adds it to used array, if not unique', function () {
      let name = 'name02';
      let used = ['name00', 'name01', 'name02'];
      let uniqueName = utils.uniqueName(name, used);
      expect(uniqueName).to.equal('name02-1');
      let uniqueName2 = utils.uniqueName(name, used);
      expect(uniqueName2).to.equal('name02-2');
      expect(used).to.eql(['name00', 'name01', 'name02', 'name02-1', 'name02-2']);
    });
  });

  describe('.hash()', function () {
    it('Hashes a string', function () {
      expect(utils.hash('foo')).to.be.a.string;
      expect(utils.hash('foo').length).to.equal(32);
      expect(utils.hash('foo')).to.equal(utils.hash('foo'));
      expect(utils.hash('foo')).to.not.equal(utils.hash('bar'));
    });
    it('Hashes an object', function () {
      let ob = {foo: 'bar'};
      let ob2 = {foo: 'foo'};
      expect(utils.hash(ob)).to.be.a.string;
      expect(utils.hash(ob).length).to.equal(32);
      expect(utils.hash(ob)).to.equal(utils.hash(ob));
      expect(utils.hash(ob)).to.not.equal(utils.hash(ob2));
    });
  });

  describe('.matches()', function () {
    it('Matches path(s) against pattern(s)', function () {
      expect(utils.matches('foo', 'foo')).to.equal(true);
      expect(utils.matches(['foo'], ['foo'])).to.equal(true);
      expect(utils.matches(['foo'], ['bar'])).to.equal(false);
    });
  });

  describe('.splitLines()', function () {
    it('Splits a string into an array of lines', function () {
      expect(utils.splitLines('foo')).to.eql(['foo']);
      expect(utils.splitLines('foo\nbar')).to.eql(['foo', 'bar']);
      expect(utils.splitLines('foo\r\nbar')).to.eql(['foo', 'bar']);
    });
  });

/*
 * Paths
 */

  const pathWithEndSlash = path.join('this', 'is', 'a', 'path', '/');
  const pathWithoutEndSlash = path.join('this', 'is', 'a', 'path');

  describe('.addTrailingSeparator()', function () {
    it('Appends a trailing path separator to the end of a string if it doesn\'t already have one', function () {
      expect(utils.addTrailingSeparator(pathWithoutEndSlash)).to.equal(pathWithEndSlash);
      expect(utils.addTrailingSeparator(pathWithEndSlash)).to.equal(pathWithEndSlash);
    });
  });

  describe('.removeTrailingSeparator()', function () {
    it('Removes a trailing path separator from the end of a string', function () {
      expect(utils.removeTrailingSeparator(pathWithoutEndSlash)).to.equal(pathWithoutEndSlash);
      expect(utils.removeTrailingSeparator(pathWithEndSlash)).to.equal(pathWithoutEndSlash);
    });
  });

  describe('.endsInSeparator()', function () {
    it('Test if a string ends in a path separator', function () {
      expect(utils.endsInSeparator(pathWithoutEndSlash)).to.be.false;
      expect(utils.endsInSeparator(pathWithEndSlash)).to.be.true;
    });
  });

  describe('.normalizeExt()', function () {
    it('Correctly format extension to be prefixed with a dot', function () {
      expect(utils.normalizeExt('js')).to.equal('.js');
      expect(utils.normalizeExt('.js')).to.equal('.js');
    });
  });

  describe('.normalizePath()', function () {
    it('Throws an error if non-string input is received', function () {
      expect(function () {
        utils.normalizePath(['one']);
      }).to.throw(TypeError, '[paths-invalid]');
    });
    it('Normalises supplied absolute paths', function () {
      expect(utils.normalizePath('/path/level')).to.equal('/path/level');
      expect(utils.normalizePath('/path/level/')).to.equal('/path/level');
      expect(utils.normalizePath('/path/level/', 'ignored/as/absolute')).to.equal('/path/level');
    });
    it('Normalises supplied relative paths', function () {
      expect(utils.normalizePath('../path/level/')).to.equal(path.normalize(path.join(process.cwd(), '../path/level')));
      expect(utils.normalizePath('../path/level/', 'cwd/of/project')).to.equal('cwd/of/path/level');
    });
  });

  describe('.normalizePaths()', function () {
    it(`Applies 'normalizePath' to each path in an array`, function () {
      var spy = sinon.spy(utils, 'normalizePath');
      utils.normalizePaths(['path/one', 'path/two', 'path/three']);
      expect(spy.callCount).to.equal(3);
    });
  });

  /*
   * Other
   */

  describe('.toArray()', function () {
    it('Converts non-array values to an array', function () {
      expect(utils.toArray('foo')).to.eql(['foo']);
    });

    it('Leaves existing arrays untouched', function () {
      expect(utils.toArray(['foo', 'bar'])).to.eql(['foo', 'bar']);
    });

    it('Returns an empty array if null or undefined passed', function () {
      expect(utils.toArray()).to.eql([]);
    });
  });

  describe('.promisify()', function () {
    it('Converts a function to a Promise', function () {
      function callback(data, cb) {
        cb(null, data);
      }
      var pf = utils.promisify(callback);
      expect(pf('value')).to.respondTo('then');
    });
  });
});
