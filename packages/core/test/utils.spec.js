const mockArgv = require('mock-argv');
const mock = require('mock-fs');

const utils = require('../src/utils');

describe('Utils', () => {
    describe('.lang()', () => {
        it('returns correct info for scss', () => {
            const lang = utils.lang('file.scss');
            expect(lang.name).toEqual('SCSS');
            expect(lang.mode).toEqual('scss');
            expect(lang.scope).toEqual('source.scss');
        });

        it('returns correct info for nunjucks variants', () => {
            const expected = {
                name: 'HTML+Django',
                mode: 'django',
                scope: 'text.html.django',
                color: null,
            };
            expect(utils.lang('file.nunjucks')).toEqual(expected);
            expect(utils.lang('file.nunjs')).toEqual(expected);
            expect(utils.lang('file.nunj')).toEqual(expected);
            expect(utils.lang('file.nj')).toEqual(expected);
            expect(utils.lang('file.jinja2')).toEqual(expected);
            expect(utils.lang('file.j2')).toEqual(expected);
        });

        it('returns default value for unknown file type', () => {
            const expected = {
                name: '.THIS_IS_NOT_A_FILE',
                mode: 'plaintext',
                scope: null,
                color: null,
            };
            expect(utils.lang('file.this_is_not_a_file')).toEqual(expected);
        });
    });

    describe('.titlize()', () => {
        it('returns titlized string', () => {
            expect(utils.titlize('not-a-title')).toEqual('Not A Title');
        });
    });

    describe('.slugify()', () => {
        it('returns slugified string', () => {
            expect(utils.slugify('Not A Slug')).toEqual('not-a-slug');
        });

        it('replaces special characters', () => {
            expect(utils.slugify('slug-šäöüõ-slug')).toEqual('slug-saouo-slug');
        });
    });

    describe('.escapeForRegexp()', () => {
        it('returns escaped string', () => {
            expect(utils.escapeForRegexp('$handle')).toEqual('\\$handle');
        });
    });

    describe('.parseArgv()', () => {
        it('returns correct data for command with arguments and options', async () => {
            const expected = {
                args: ['bar'],
                command: 'foo',
                opts: {
                    option: 'value',
                },
            };
            await mockArgv(['foo', 'bar', '--option', 'value'], () => {
                expect(utils.parseArgv()).toEqual(expected);
            });
        });

        it('returns correct data without command', async () => {
            const expected = {
                args: [],
                command: null,
                opts: {},
            };
            await mockArgv([], () => {
                expect(utils.parseArgv()).toEqual(expected);
            });
        });
    });

    describe('.stringify()', () => {
        it('returns stringified object', () => {
            const object = {
                buffer: Buffer.from('buffer'),
                func: function () {},
                plainObject: {},
            };
            const expected = `{
    "buffer": "<Buffer>",
    "func": "<Function>",
    "plainObject": "{}"
}`;
            expect(utils.stringify(object)).toEqual(expected);
        });

        it('allows custom indent', () => {
            const object = {
                buffer: Buffer.from('buffer'),
                func: () => {},
                plainObject: {},
            };
            const expected = `{
  "buffer": "<Buffer>",
  "func": "<Function>",
  "plainObject": "{}"
}`;
            expect(utils.stringify(object, 2)).toEqual(expected);
        });
    });

    describe('.fileExistsSync()', () => {
        it('returns true if file is accessible', () => {
            mock({
                'path/to/accessible/file': 'can access',
            });

            expect(utils.fileExistsSync('path/to/accessible/file')).toBe(true);

            mock.restore();
        });
    });

    describe('.md5()', () => {
        it('returns same hash for same string', () => {
            const first = utils.md5('string');
            const second = utils.md5('string');
            expect(first).toEqual('b45cffe084dd3d20d928bee85e7b0f21');
            expect(first).toEqual(second);
        });
    });

    describe('.mergeProp()', () => {
        it('Returns the upstream value if the property is undefined', () => {
            expect(utils.mergeProp(undefined, 'foo')).toEqual('foo');
        });

        it('Returns the property value if the upstream is undefined', () => {
            expect(utils.mergeProp('foo', undefined)).toEqual('foo');
        });

        it('Merges the contents of arrays', () => {
            expect(utils.mergeProp(['one', 'two'], ['one', 'three', 'four'])).toEqual(
                expect.arrayContaining(['one', 'two', 'three', 'four'])
            );
        });

        it('Applies default values from upstream objects', () => {
            expect(utils.mergeProp({ one: 'one', two: 'two' }, { one: 'eins', three: 'drei' })).toEqual({
                one: 'one',
                two: 'two',
                three: 'drei',
            });
            expect(
                utils.mergeProp(
                    { one: 'one', nested: { three: 'three' } },
                    { two: 'zwei', nested: { three: 'drei', four: 'vier' } }
                )
            ).toEqual({ one: 'one', two: 'zwei', nested: { three: 'three', four: 'vier' } });
        });

        it('Does not attempt to merge objects that are instances of classes', () => {
            let prop = new MyClass();
            let upstream = new MyOtherClass();
            let plain = { foo: 'bar' };
            expect(utils.mergeProp(prop, upstream)).toEqual(prop);
            expect(utils.mergeProp(plain, upstream)).toEqual(plain);
            expect(utils.mergeProp(prop, plain)).toEqual(prop);
        });
    });

    describe('.defaultsDeep()', () => {
        it('Does not modify source objects', () => {
            let target = {};
            let defaults = { foo: 'bar' };
            let result = utils.defaultsDeep(target, defaults);

            expect(result).not.toBe(defaults);
            expect(result).not.toEqual(target);
            expect(target).toEqual({});
            expect(defaults).toEqual({ foo: 'bar' });
            expect(target).toEqual(target);
            expect(defaults).toEqual(defaults);
        });

        it('Recursively merges plain objects', () => {
            let target = {
                top: 'from target',
                item: {
                    nested: {
                        one: 'from target',
                        two: ['from', 'target'],
                        three: undefined,
                        four: {
                            five: 5,
                        },
                    },
                },
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
                            six: 6,
                        },
                    },
                },
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
                            six: 6,
                        },
                    },
                },
            };
            expect(utils.defaultsDeep(target, defaults)).toEqual(expected);
        });

        it('Does not merge non-plain-object values', () => {
            let target = { item: new MyClass() };
            let defaults = { item: new MyOtherClass() };
            let plain = { item: { foo: 'plain' } };
            expect(utils.defaultsDeep(target, defaults)).toEqual(target);
            expect(utils.defaultsDeep(plain, defaults)).toEqual(plain);
            expect(utils.defaultsDeep(target, plain)).toEqual(target);
        });

        it('Does not merge array values', () => {
            let target = { items: ['one', 'two'] };
            let defaults = { items: ['one', 'three', 'four'] };
            expect(utils.defaultsDeep(target, defaults).items).toEqual(target.items);
        });

        it('Returns the default value if the target property is undefined', () => {
            let target = { anotherItem: 'foo', nullItem: null, undefinedItem: undefined };
            let defaults = { item: ['one', 'three', 'four'], nullItem: 'not null', undefinedItem: 'not undefined' };
            let result = utils.mergeProp(target, defaults);
            expect(result).toHaveProperty('anotherItem');
            expect(result).toHaveProperty('item');
            expect(result.nullItem).toBeNull();
            expect(result.undefinedItem).toEqual('not undefined');
        });
    });

    describe('.relUrlPath()', () => {
        const opts = {
            ext: '.html',
        };

        it('returns correct relative path for same directory', () => {
            expect(utils.relUrlPath('/path/to/a', '/path/to/b', opts)).toEqual('a.html');
        });

        it('returns correct relative path for parent directory', () => {
            expect(utils.relUrlPath('/path/to/a', '/path/b', opts)).toEqual('to/a.html');
        });

        it('returns toPath if it is full url', () => {
            expect(utils.relUrlPath('https://fractal.build', '/path/b', opts)).toEqual('https://fractal.build');
        });

        it('returns toPath with extension if it is already a relative path', () => {
            expect(utils.relUrlPath('./path/to/a', '/path/b', opts)).toEqual('./path/to/a.html');
        });

        it('returns toPath without extension if it is already a relative path but no ext in opts', () => {
            expect(utils.relUrlPath('./path/to/a', '/path/b', {})).toEqual('./path/to/a');
        });

        it('returns correct path to root', () => {
            expect(utils.relUrlPath('/', '/path/b', {})).toEqual('../..');
        });

        it('returns correct path to root with extension', () => {
            expect(utils.relUrlPath('/', '/path/b', opts)).toEqual('../index.html');
        });

        it('returns correct path to file with extension', () => {
            expect(utils.relUrlPath('/path/to/image.png', '/path/b', opts)).toEqual('to/image.png');
        });

        it('returns correct relative path to file with extension', () => {
            expect(utils.relUrlPath('../to/image.png', '/path/b', opts)).toEqual('../to/image.png');
        });

        // for static builds
        const opts2 = {
            ext: '.html',
            relativeToCurrentFolder: true,
        };
        const opts3 = {
            relativeToCurrentFolder: true,
        };
        it('returns correct relative path from current directory for same directory', () => {
            expect(utils.relUrlPath('/path/to/a', '/path/to/b', opts2)).toEqual('./a.html');
        });

        it('returns correct relative path from the current directory for parent directory', () => {
            expect(utils.relUrlPath('/path/to/a', '/path/b', opts2)).toEqual('./to/a.html');
        });

        it('returns toPath if it is full url even if `relativeToCurrentFolder` is true', () => {
            expect(utils.relUrlPath('https://fractal.build', '/path/b', opts2)).toEqual('https://fractal.build');
        });

        it('returns toPath with extension if it is already a path from current directory', () => {
            expect(utils.relUrlPath('./path/to/a', '/path/b', opts2)).toEqual('./path/to/a.html');
        });

        it('returns toPath without extension if it is already a relative path from current directory', () => {
            expect(utils.relUrlPath('./path/to/a', '/path/b', opts3)).toEqual('./path/to/a');
        });

        it('returns correct path to root from current directory', () => {
            expect(utils.relUrlPath('/', '/path/b', opts3)).toEqual('../..');
        });

        it('returns correct path to root with extension from current directory', () => {
            expect(utils.relUrlPath('/', '/path/b', opts2)).toEqual('../index.html');
        });

        it('returns self with extension if it is already a path from self', () => {
            expect(utils.relUrlPath('/path/to/a', '/path/to/a', opts2)).toEqual('./a.html');
        });

        it('returns correct path to file with extension from current directory', () => {
            expect(utils.relUrlPath('/path/to/image.png', '/path/b', opts2)).toEqual('./to/image.png');
        });

        it('returns correct relative path to file with extension from current directory', () => {
            expect(utils.relUrlPath('../to/image.png', '/path/b', opts2)).toEqual('../to/image.png');
        });
    });
});

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
