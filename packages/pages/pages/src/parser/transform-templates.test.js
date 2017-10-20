const {FileCollection} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const {makePages} = require('../../test/helpers');
const transform = require('./transform-templates');

describe('Templates transform', function () {
  describe('.transform()', function () {
    it('returns a FileCollection instance', () => {
      const props = transform();
      expect(props.transform(new FileCollection(), {}, makePages())).to.be.instanceOf(FileCollection);
    });
  });
});
