/* eslint no-unused-expressions : "off", handle-callback-err: "off", max-nested-callbacks: "off" */

const _ = require('lodash');
const expect = require('@frctl/utils/test').expect;
const validate = require('../src/validate');

function exclude(...exclude) {
  return _.values(_.pickBy({
    array: [],
    function: () => {},
    string: 'this is a string',
    number: 123,
    null: null
  }, (val, key) => !exclude.includes(key)));
}

const validators = {
  adapter: {
    valid: [
      {
        name: 'test',
        match: '.doo',
        render() {}
      }
    ],
    invalid: [
      {
        attempt: ['foo', {}, {name: 'valid'}, {render() {}}],
        expect: '[adapter-invalid]'
      }
    ],
    invalidProps: {
      name: {
        values: exclude('string'),
        expect: '[adapter-name-invalid]'
      },
      match: {
        values: exclude('string'),
        expect: '[adapter-match-invalid]'
      },
      render: {
        values: exclude('function'),
        expect: '[adapter-render-invalid]'
      }
    }
  },
  plugin: {
    valid: [
      function () {}
    ],
    invalid: [
      {
        attempt: ['foo', {}, 123],
        expect: '[plugin-invalid]'
      }
    ]
  },
  extension: {
    valid: [
      function () {}
    ],
    invalid: [
      {
        attempt: ['foo', {}, 123],
        expect: '[extension-invalid]'
      }
    ]
  },
  method: {
    valid: [
      {
        name: 'test',
        handler() {}
      }
    ],
    invalid: [
      {
        attempt: ['foo', {}, {name: 'valid'}, {handler() {}}],
        expect: '[method-invalid]'
      }
    ],
    invalidProps: {
      name: {
        values: exclude('string'),
        expect: '[method-name-invalid]'
      },
      handler: {
        values: exclude('function'),
        expect: '[method-handler-invalid]'
      }
    }
  },
  command: {
    valid: [
      {
        command: 'test',
        description: 'a description',
        handler() {}
      }
    ],
    invalid: [
      {
        attempt: ['foo', {}, {name: 'valid'}, {handler() {}}],
        expect: '[command-invalid]'
      }
    ],
    invalidProps: {
      command: {
        values: exclude('string'),
        expect: '[command-command-invalid]'
      },
      description: {
        values: exclude('string'),
        expect: '[command-description-invalid]'
      },
      handler: {
        values: exclude('function'),
        expect: '[command-handler-invalid]'
      }
    }
  }

};

describe('validate', function () {
  _.forEach(validators, (validator, type) => {
    describe(`.${type}()`, function () {
      it(`validates ${type}s`, function () {
        for (const test of validator.valid) {
          expect(() => validate[type](test)).to.not.throw();
        }
        const valid = validator.valid[0];
        _.forEach(validator.invalidProps || {}, (test, prop) => {
          for (const value of test.values) {
            const attempt = Object.assign({}, valid, {[prop]: value});
            expect(() => validate[type](attempt)).to.throw(TypeError, test.expect);
          }
        });
        for (const test of validator.invalid) {
          let attempts = [].concat(test.attempt);
          for (const attempt of attempts) {
            expect(() => validate[type](attempt)).to.throw(TypeError, test.expect);
          }
        }
      });
    });
  });
});
