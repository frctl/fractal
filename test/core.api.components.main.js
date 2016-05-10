'use strict';

const _       = require('lodash');
const chai    = require('chai');
const expect  = chai.expect;

const ComponentSource = require('../src/core/api/components');
const app             = require('../src/fractal');

describe('ComponentSource', function(){

    let components;

    before(function(){
        components = new ComponentSource(app);
    });

    describe('.getProp()', function(){
        it('returns the default setting value', function(){
            expect(components.getProp('status')).to.equal(app.get('components.default.status'));
            expect(components.getProp('foo')).to.be.undefined;
        });
    });

    describe('.setProp()', function(){
        it('cannot set un-inhertiable properties', function(){
            components.setProp('foo', 'bar');
            expect(components.getProp('foo')).to.be.undefined;
        });
        it('can set inhertiable properties', function(){
            components.setProp('status', 'prototype');
            expect(components.getProp('status')).to.equal('prototype');
        });
    });

    describe('.getHeritable()', function(){
        it('returns the set of heritable properties', function(){
            expect(components.getHeritable('foo')).to.deep.equal(_.keys(app.get('components.default')));
        });
    });

    describe('mixins', function(){

        it('is an event emitter');
        it('is configurable');
        it('is a source');

        it('is a collection', function(){
            expect(components).to.respondTo('items');
            expect(components).to.have.property('size');
        });
    });


});
