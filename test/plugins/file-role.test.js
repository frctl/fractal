/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const rolePluginFactory = require('./support/files').plugins.role;

const testUtils = require('./support/utils');

const testSignature = testUtils.testSignature;
const testPlugin = testUtils.testPlugin;
const testFactory = testUtils.testFactory;

describe(`'File role' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(rolePluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function () {
      testSignature('role');
    });

    it(`only accepts valid options values`, function () {
      for (const value of ['string', 78, []]) {
        const fr = () => rolePluginFactory(value);
        expect(fr).to.throw(TypeError, `[opts-invalid]`);
      }
      for (const value of [{}, undefined]) {
        const fr = () => rolePluginFactory(value);
        expect(fr).to.not.throw();
      }
      expect(() => rolePluginFactory()).to.not.throw();
    });

    describe(`each file 'role' value`, function () {
      for (const role of ['view', 'config']) {
        it(`gets added correctly: (${role})`, function (done) {
          const rolePlugin = rolePluginFactory({});
          const fileMocks = getRoleMocks(role);
          const fileExpected = getRoleExpected(role, role);
          testPlugin(rolePlugin, fileMocks, fileExpected, done);
        });
      }

      it(`gets added correctly: (readme)`, function (done) {
        const rolePlugin = rolePluginFactory({});
        const role = 'readme';
        const fileMocks = getRoleMocks(role);
        const fileExpected = getRoleExpected(role, 'resource');
        testPlugin(rolePlugin, fileMocks, fileExpected, done);
      });
    });

    describe(`each directory 'role' value`, function () {
      it(`gets added correctly: (component, collection)`, function (done) {
        const rolePlugin = rolePluginFactory({});
        const fileMocks = [{
          isDirectory: true,
          name: '@index',
          relative: 'components/@index'
        },
        {
          isDirectory: true,
          name: 'forms',
          relative: 'components/forms'
        },
        {
          isDirectory: true,
          name: 'subdirectory',
          relative: 'components/@index/subdirectory'
        }
        ];
        const fileExpected = [{
          isDirectory: true,
          name: '@index',
          relative: 'components/@index',
          scope: 'global',
          role: 'component'
        },
        {
          isDirectory: true,
          name: 'forms',
          relative: 'components/forms',
          scope: 'global',
          role: 'collection'
        },
        {
          isDirectory: true,
          name: 'subdirectory',
          relative: 'components/@index/subdirectory',
          scope: 'global',
          role: 'resource'
        }
        ];

        testPlugin(rolePlugin, fileMocks, fileExpected, done);
      });
    });
  });
});

function getRoleMocks(role) {
  return [{
    isFile: true,
    relative: `/components/input/${role}.njk`
  },
  {
    isFile: true,
    relative: `/components/input/input.${role}.njk`
  },
  {
    isFile: true,
    relative: `/components/input/input.true${role}.njk`
  },
  {
    isFile: true,
    relative: `/components/input/input.${role}true.njk`
  },
  {
    isFile: true,
    relative: `/components/input/input.njk`
  }
  ];
}

function getRoleExpected(role, altRole) {
  return [{
    isFile: true,
    relative: `/components/input/${role}.njk`,
    role: `${role}`,
    scope: `global`
  },
  {
    isFile: true,
    relative: `/components/input/input.${role}.njk`,
    role: `${altRole}`,
    scope: `global`
  },
  {
    isFile: true,
    relative: `/components/input/input.true${role}.njk`,
    role: `resource`,
    scope: `global`
  },
  {
    isFile: true,
    relative: `/components/input/input.${role}true.njk`,
    role: `resource`,
    scope: `global`
  },
  {
    isFile: true,
    relative: `/components/input/input.njk`,
    role: `resource`,
    scope: `global`
  }
  ];
}
