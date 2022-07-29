const mix = require('../../../src/core/mixins/mix');
const Emitter = mix(require('../../../src/core/mixins/emitter'));

describe('Emitter', () => {
    let emitter;

    beforeEach(() => {
        emitter = new Emitter();
    });

    it('is an event emitter', () => {
        expect(typeof emitter.on).toBe('function');
        expect(typeof emitter.emit).toBe('function');
    });

    it('is mixed in', () => {
        expect(emitter.hasMixedIn('Emitter')).toBe(true);
    });
});
