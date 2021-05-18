const Source = require('../../src/entities/source');
const fractal = require('../__mocks__/fractal');

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

describe('EntitySource', () => {
    let source;

    beforeEach(() => {
        source = new Source('foo', fractal);
    });

    describe('.entities()', () => {
        it('returns new Source with no collections', () => {
            source.setItems([
                ...items,
                {
                    id: 3,
                    isCollection: true,
                },
            ]);
            expect(source.entities()).toBeInstanceOf(Source);
            expect(source.entities()).not.toEqual(source);
            expect(source.entities().items()).toEqual(items);
        });
    });

    describe('.engine()', () => {
        it('requires engine if passed string', () => {
            const mockEngine = {
                load: jest.fn(),
            };
            jest.mock(
                'mock_engine_module',
                () => ({
                    register: () => mockEngine,
                }),
                { virtual: true }
            );
            expect(source.engine('mock_engine_module')).toBe(mockEngine);
        });

        it('creates engine if passed function', () => {
            const mockEngine = jest.fn(() => {
                return {
                    register: jest.fn(() => ({
                        load: jest.fn(),
                    })),
                };
            });
            source.engine(mockEngine);
            expect(mockEngine).toHaveBeenCalledTimes(1);
        });

        it('throws if engine factory does not have a register method', () => {
            const mockEngine = jest.fn(() => {
                return {
                    not_register: jest.fn(),
                };
            });
            expect(() => {
                source.engine(mockEngine);
            }).toThrow("Template engine adaptor factory functions must return an object with a 'register' method.");
        });

        it('triggers engine load', () => {
            const mockLoad = jest.fn();
            const mockFactory = {
                register: () => ({
                    load: mockLoad,
                }),
            };
            source.engine(mockFactory);
            expect(mockLoad).toHaveBeenCalledTimes(1);
        });

        it('returns engine', () => {
            const mockEngine = {
                load: jest.fn(),
            };
            const mockFactory = {
                register: () => mockEngine,
            };
            expect(source.engine(mockFactory)).toBe(mockEngine);
        });

        it('returns engine if called second time without arguments', () => {
            const mockEngine = {
                load: jest.fn(),
            };
            const mockFactory = {
                register: () => mockEngine,
            };
            source.engine(mockFactory);
            expect(source.engine()).toBe(mockEngine);
        });

        it('returns default engine if called wihout arguments', () => {
            expect(source.engine()).toEqual({
                foo: 'bar',
                load: expect.any(Function),
            });
        });
    });

    describe('.statusInfo()', () => {
        it('returns null if passed handle is null', () => {
            expect(source.statusInfo(null)).toBe(null);
        });

        it('returns default status if handle is undefined', () => {
            expect(source.statusInfo()).toBe('wip');
        });

        it('returns default status if handle is unknown', () => {
            expect(source.statusInfo('does_not_exist')).toBe('wip');
        });

        it('returns status if handle is known', () => {
            expect(source.statusInfo('ready')).toBe('ready');
        });
    });

    describe('.toJSON()', () => {
        it('returns a plain object', () => {
            source.setItems(items);
            const json = source.toJSON();
            expect(json).toBeObject();
            expect(json).not.toBeInstanceOf(Source);
            // full path differs in every environment, so better to exclude from snapshot
            json.fullPath = '';
            expect(json).toMatchSnapshot();
        });
        it('calls toJSON() on items if they have a toJSON method', () => {
            const toJSON = jest.fn();
            const collectionItem = {
                type: 'component',
                id: 3,
                toJSON: toJSON,
            };
            source.setItems([...items, collectionItem]);
            source.toJSON();
            expect(toJSON).toHaveBeenCalled();
        });
    });

    it('is an source', () => {
        expect(source.hasMixedIn('Source')).toBe(true);
    });
    it('is heritable', () => {
        expect(source.hasMixedIn('Heritable')).toBe(true);
    });
});
