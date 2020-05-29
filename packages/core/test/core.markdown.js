'use strict';

const chai = require('chai');
const expect = chai.expect;

const md = require('../src/markdown');

describe('Markdown renderer', function () {
    it('does not directly mutate the supplied configuration object', function () {
        const config = {};
        md('**foo**', config);
        expect(config).eql({});
    });
});
