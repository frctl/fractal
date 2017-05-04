/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const Surveyor = require('@frctl/surveyor').Surveyor;
const expect = require('@frctl/utils/test').expect;
const Fractal = require('../src/fractal');

describe('Fractal', function () {
  describe('constructor()', function () {
    it(`inherits from Surveyor`, function () {
      expect(new Fractal({})).to.be.instanceof(Surveyor);
    });
  });

  describe('.addCommand()', function () {
    it(`checks the command is valid`);
  });

  // describe('.parse()', function () {
  //   it('calls the callback with collections when successful ', function (done) {
  //     const fractal = new Fractal(validConfig);
  //     fractal.parse((err, state) => {
  //       expect(err).to.equal(null);
  //       expect(state).to.be.an('object');
  //       // expect(state.components).to.be.instanceOf(Collection);
  //       // expect(state.files).to.be.instanceOf(Collection);
  //       done();
  //     });
  //   });
  //
  //   it('calls the callback with an error argument when parsing fails', function (done) {
  //     const fractal = new Fractal({
  //       src: '/doesnt/exist'
  //     });
  //     fractal.parse(err => {
  //       expect(err).to.be.instanceof(Error);
  //       done();
  //     });
  //   });
  //
  //   it('emits a `parse.start` event when starting', function (done) {
  //     const fractal = new Fractal();
  //     const startSpy = sinon.spy();
  //     fractal.on('parse.start', startSpy);
  //     fractal.parse(() => {
  //       expect(startSpy.called).to.be.true;
  //       done();
  //     });
  //   });
  //
  //   it('emits a `parse.start` event when starting', function (done) {
  //     const fractal = new Fractal();
  //     fractal.on('parse.complete', function () {
  //       expect(true).to.be.true;
  //     });
  //     fractal.parse(done);
  //   });
  //
  // });
});
