const {expect} = require('../../../../test/helpers');
const utils = require('./utils');
const render = require('./render');

describe('console utils', function () {
  describe('.countLeadingEmptyLines()', function () {
    it('counts the number of blank lines at the start of a string', function () {
      expect(utils.countLeadingEmptyLines(`\n\n\nfoo\n\nbar\n`)).to.equal(3);
      expect(utils.countLeadingEmptyLines(`foo\n\nbar\n`)).to.equal(0);
      expect(utils.countLeadingEmptyLines(`\n\n`)).to.equal(2);
    });
  });

  describe('.parseError()', function () {
    it('returns an object with message and stack properties', function () {
      const result = utils.parseError(new Error('foobar'));
      expect(result).to.have.property('message');
      expect(result).to.have.property('stack');
      expect(result.message).to.be.a('string');
      expect(result.stack).to.be.a('string');
    });
    it('has a null stack property if the input is not an Error instance', function () {
      const result = utils.parseError('foobar');
      expect(result.message).to.equal('foobar');
      expect(result.stack).to.equal(null);
    });
  });

  describe('.prefix()', function () {
    it('adds a prefix to the start of a string', function () {
      expect(utils.prefix('abcdefg', '123 ')).to.equal('123 abcdefg');
    });
    it('prefixes the first non-empty line and indents the other lines to match', function () {
      expect(utils.prefix('\n\nabcde\nfg\nhi', '!')).to.equal('\n\n!abcde\n fg\n hi');
    });
  });

  describe('.indent()', function () {
    it('indents a string by the correct number of spaces', function () {
      expect(utils.indent('abc', 1)).to.equal(' abc');
      expect(utils.indent(' abc', 2)).to.equal('   abc');
      expect(utils.indent('abc', 2)).to.equal('  abc');
    });
  });

  describe('.format()', function () {
    it('runs the input through the string renderer', function () {
      const input = '<red>foo</red>';
      expect(utils.format(input)).to.equal(render(input));
    });
    it('adds a prefix if supplied as an option', function () {
      const input = 'foo';
      const opts = {
        prefix: '<green>foo</green>'
      };
      expect(utils.format(input, opts)).to.equal(render(opts.prefix) + input);
    });
    it('strips unnessary indentation and first & last new lines', function () {
      const input = `
      foo
          bar
      `;
      expect(utils.format(input)).to.equal('foo\n    bar');
    });
  });
});
