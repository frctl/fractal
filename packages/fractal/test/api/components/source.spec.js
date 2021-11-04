const _ = require('lodash');

const ComponentSource = require('../../../src/api/components');
const app = require('../../../src/fractal')();

describe('ComponentSource', () => {
    let components;

    beforeEach(() => {
        components = new ComponentSource(app);
    });

    describe('.getProp()', () => {
        it('returns the default setting value', () => {
            expect(components.getProp('status')).toEqual(app.get('components.default.status'));
            expect(components.getProp('foo')).toBe(undefined);
        });
    });

    describe('.setProp()', () => {
        it('cannot set un-inhertiable properties', () => {
            components.setProp('foo', 'bar');
            expect(components.getProp('foo')).toBe(undefined);
        });
        it('can set inhertiable properties', () => {
            components.setProp('status', 'prototype');
            expect(components.getProp('status')).toEqual('prototype');
        });
    });

    describe('.getHeritable()', () => {
        it('returns the set of heritable properties', () => {
            expect(components.getHeritable('foo')).toEqual(_.keys(app.get('components.default')));
        });
    });
});
