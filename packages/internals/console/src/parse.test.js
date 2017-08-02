/* eslint no-unused-expressions: "off" */

const {EOL} = require('os');
const styles = require('ansi-styles');
const {expect} = require('../../../../test/helpers');
const parse = require('./parse');

const simpleString = 'this is <bold>some bold <red>red</red> text</bold>';
const styleTags = [
  'reset',
  'bold',
  'dim',
  'italic',
  'underline',
  'inverse',
  'hidden',
  'strikethrough',
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgBlackBright',
  'bgRedBright',
  'bgGreenBright',
  'bgYellowBright',
  'bgBlueBright',
  'bgMagentaBright',
  'bgCyanBright',
  'bgWhiteBright'
];

describe('parse()', function () {
  it('throws an error on invalid input', function () {
    for (const input of [null, undefined, {}, () => {}]) {
      expect(() => parse(input)).to.throw(TypeError);
    }
  });

  it('returns a string', function () {
    const result = parse(simpleString);
    expect(result).to.be.a('string');
  });

  it('ignores unknown and unmatched tags', function () {
    const result = parse('<baz>foo</bar>');
    expect(result).to.equal('foo');
  });

  it('supports all ANSI codes from the ansi-styles package', function () {
    for (const name of styleTags) {
      const result = parse(`<${name}>foo</${name}>`);
      expect(result).to.equal(`${styles[name].open}foo${styles[name].close}`);
    }
  });

  it('replaces `br` tags with line breaks', function () {
    const result = parse('foo<br>bar<br><br><br>baz<br>');
    expect(result).to.equal(`foo${EOL}bar${EOL}${EOL}${EOL}baz${EOL}`);
  });

  it('allows custom tags to be supplied as an option', function () {
    const result = parse('foo<bar>baz</bar>', {
      tags: {
        bar: {
          open: '!open-bar!',
          close: '!close-bar!'
        }
      }
    });
    expect(result).to.equal(`foo!open-bar!baz!close-bar!`);
  });
});
