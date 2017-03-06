/* eslint-disable no-unused-expressions,import/no-dynamic-require */
const path = require('path');
const expect = require('@frctl/utils/test').expect;

const pluginList = ['adapter', 'name', 'role']
  .map(name => ({
    name: name,
    plugin: require(path.join('../../src/files/plugins', name))
  }));
const plugins = pluginList.reduce((memo, {
  name,
  plugin
}) => Object.assign(memo, {
  [name]: plugin
}), {});

describe('File Plugins', function () {
  describe('constructor', function () {
    pluginList.forEach(function ({
      name,
      plugin
    }) {
      it(`'${name}' factory returns a function`, function () {
        expect(plugin).to.be.a('function');
      });
    });
  });

  describe(`'name' plugin'`, function () {
    it(`has expected signature`, function () {
      testSignature('name');
    });
    it(`adds expected 'file.name' values`, function (done) {
      const namePlugin = plugins.name();
      const nameMocks = [{
        stem: 'file-one'
      },
      {
        stem: '_file-two'
      },
      {
        stem: '_01-file-three.view'
      },
      {
        stem: '01-file-three.view.longer'
      }
      ];
      const nameExpected = [{
        stem: 'file-one',
        name: 'file-one'
      },
      {
        stem: '_file-two',
        name: 'file-two'
      },
      {
        stem: '_01-file-three.view',
        name: 'file-three.view'
      },
      {
        stem: '01-file-three.view.longer',
        name: 'file-three.view.longer'
      }
      ];
      testPlugin(namePlugin, nameMocks, nameExpected, done);
    });
  });

  describe(`'role' plugin`, function () {
    it(`has expected signature`, function () {
      testSignature('role');
    });

    it(`only accepts valid options values`, function () {
      for (const value of ['string', 78, []]) {
        const fr = () => plugins.role(value);
        expect(fr).to.throw(TypeError);
      }
      for (const value of [{}, undefined]) {
        const fr = () => plugins.role(value);
        expect(fr).to.not.throw();
      }
      expect(() => plugins.role()).to.not.throw();
    });

    describe(`each file 'role' value`, function () {
      for (const role of ['view', 'config']) {
        it(`gets added correctly: (${role})`, function (done) {
          const rolePlugin = plugins.role({});
          const roleMocks = getRoleMocks(role);
          const roleExpected = getRoleExpected(role);
          testPlugin(rolePlugin, roleMocks, roleExpected, done);
        });
      }

      it(`gets added correctly: (readme)`, function (done) {
        const rolePlugin = plugins.role({});
        const role = 'readme';
        const roleMocks = getRoleMocks(`${role}`);
        const roleExpected = [{
          isFile: true,
          relative: `/components/input/${role}.njk`,
          role: `${role}`,
          scope: `global`
        },
        {
          isFile: true,
          relative: `/components/input/input.${role}.njk`,
          role: `resource`,
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
        testPlugin(rolePlugin, roleMocks, roleExpected, done);
      });
    });

    describe(`each directory 'role' value`, function () {
      it(`gets added correctly: (component, collection)`, function (done) {
        const rolePlugin = plugins.role({});
        const roleMocks = [{
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
        const roleExpected = [{
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

        testPlugin(rolePlugin, roleMocks, roleExpected, done);
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

function getRoleExpected(role) {
  return [{
    isFile: true,
    relative: `/components/input/${role}.njk`,
    role: `${role}`,
    scope: `global`
  },
  {
    isFile: true,
    relative: `/components/input/input.${role}.njk`,
    role: `${role}`,
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

function testSignature(pluginKey) {
  const plugin = plugins[pluginKey]();
  expect(plugin.length).to.equal(2);
}

function testPlugin(plugin, input, expected, done) {
  plugin(input, function () {
    expect(input).to.deep.equal(expected);
    done();
  });
}
