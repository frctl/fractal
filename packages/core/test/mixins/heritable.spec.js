const mix = require('../../src/mixins/mix');
const Heritable = mix(require('../../src/mixins/heritable'));

describe('Heritable', () => {
    describe('.setHeritable()', () => {
        it('sets heritable if passed an array', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview']);
            expect(heritable.getHeritable()).toEqual(['preview']);
        });

        it('sets heritable from parent if passed a Heritable instance', () => {
            const parent = new Heritable();
            const child = new Heritable();
            parent.setHeritable(['preview']);
            child.setHeritable(parent);
            expect(child.getHeritable()).toEqual(['preview']);
        });

        describe('defines accessor descriptors', () => {
            it('setter', () => {
                const heritable = new Heritable();
                heritable.setHeritable(['preview']);
                heritable.preview = 'value';
                expect(heritable.getProp('preview')).toEqual('value');
            });

            it('getter', () => {
                const heritable = new Heritable();
                heritable.setHeritable(['preview']);
                heritable.setProp('preview', 'value');
                expect(heritable.preview).toEqual('value');
            });
        });

        it('is chainable', () => {
            const heritable = new Heritable();
            const ret = heritable.setHeritable(['preview']);
            expect(ret).toBe(heritable);
        });
    });

    describe('.getHeritable()', () => {
        it('returns empty array if no heritable has been set', () => {
            const heritable = new Heritable();
            expect(heritable.getHeritable()).toEqual([]);
        });

        it('returns heritable prop names', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview']);
            expect(heritable.getHeritable()).toEqual(['preview']);
        });
    });

    describe('.setProp()', () => {
        it('sets prop to value', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview']);
            heritable.setProp('preview', 'value');
            expect(heritable.getProp('preview')).toEqual('value');
        });

        it('does not set prop to value if prop is not heritable', () => {
            const heritable = new Heritable();
            heritable.setProp('preview', 'value');
            expect(heritable.getProp('preview')).toEqual(undefined);
        });

        it('is chainable', () => {
            const heritable = new Heritable();
            const ret = heritable.setProp('preview', 'value');
            expect(ret).toBe(heritable);
        });
    });

    describe('.getProp()', () => {
        it('returns prop value', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview']);
            heritable.setProp('preview', 'value');
            expect(heritable.getProp('preview')).toEqual('value');
        });

        it('returns merged prop value from parent if parent exists', () => {
            const parent = new Heritable();
            const child = new Heritable();
            parent.setHeritable(['preview']);
            child.setHeritable(parent);
            parent.setProp('preview', 'value');
            expect(child.getProp('preview')).toEqual('value');
        });
    });

    describe('.setProps()', () => {
        it('sets multiple prop values', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview', 'collated']);
            heritable.setProps({
                preview: 'value',
                collated: 'value2',
            });
            expect(heritable.getProp('preview')).toEqual('value');
            expect(heritable.getProp('collated')).toEqual('value2');
        });
    });

    describe('.getProps()', () => {
        it('returns all props', () => {
            const heritable = new Heritable();
            heritable.setHeritable(['preview']);
            heritable.setProp('preview', 'value');
            expect(heritable.getProps()).toEqual({ preview: 'value' });
        });

        it('returns empty object if no props have been set', () => {
            const heritable = new Heritable();
            expect(heritable.getProps()).toEqual({});
        });
    });

    it('is mixed in', () => {
        const heritable = new Heritable();
        expect(heritable.hasMixedIn('Heritable')).toBe(true);
    });
});
