const mix = require('../../src/mixins/mix');
const Configurable = mix(require('../../src/mixins/configurable'));

describe('Configurable', () => {
    let config;

    beforeEach(() => {
        config = new Configurable();
    });

    describe('.set()', () => {
        it('sets a config value', () => {
            config.set('foo', 'bar');
            expect(config.get('foo')).toEqual('bar');
        });

        it('is chainable', () => {
            const ret = config.set('foo', 'bar');
            expect(ret).toBe(config);
        });
    });

    describe('.get()', () => {
        it('gets a config value', () => {
            config.set('bar', 'foo');
            expect(config.get('bar')).toEqual('foo');
        });
        it('returns undefined if not set', () => {
            expect(config.get('xyxyxyx')).toEqual(undefined);
        });

        it('returns entire config if key not provided', () => {
            config.set('bar', 'foo');
            expect(config.get()).toEqual({ bar: 'foo' });
        });
    });

    describe('.config()', () => {
        it('returns config with no parameters', () => {
            config.set('bar', 'foo');
            expect(config.config()).toEqual({ bar: 'foo' });
        });
        it('sets config when object is passed in', () => {
            config.config({ bar: 'foo' });
            expect(config.config()).toEqual({ bar: 'foo' });
        });
        it('resets config when null is passed in', () => {
            config.set('bar', 'foo');
            config.config(null);
            expect(config.config()).toEqual({});
        });
    });

    it('is mixed in', () => {
        expect(config.hasMixedIn('Configurable')).toBe(true);
    });
});
