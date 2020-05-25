'use strict';

const chai = require('chai');
const expect = chai.expect;

const mix = require('../src/mixins/mix');
const Emitter = mix(require('../src/mixins/emitter'));

describe('Emitter', function () {
    let emitter;

    before(function () {
        emitter = new Emitter();
    });

    it('is an event emitter', function () {
        expect(emitter).to.respondTo('on');
        expect(emitter).to.respondTo('emit');
    });
});
