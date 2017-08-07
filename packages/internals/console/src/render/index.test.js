// /* eslint no-unused-expressions: "off" */
//
const chalk = require('chalk');
const {expect} = require('../../../../../test/helpers');
const render = require('./index');

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

function renderWithChalk(str, style) {
  return style ? chalk['reset'](chalk[style](str)) : chalk['reset'](str);
}

describe('render()', () => {
  it('throws an error on invalid input', () => {
    for (const input of [null, undefined, {}, () => {}]) {
      expect(() => render(input)).to.throw(TypeError);
    }
  });

  it('returns a string', () => {
    expect(render(`<bold>foo</bold>`)).to.be.a('string');
  });

  it('renders style tags', () => {
    for (const tag of styleTags) {
      expect(render(`<${tag}>foo</${tag}>`)).to.equal(renderWithChalk('foo', tag));
    }
  });

  it('strips whitespace correctly inside inline tags', () => {
    const expected = renderWithChalk('foo');
    expect(render(`<span> foo </span>`)).to.equal(expected);
    expect(render(`<span>\nfoo\n</span>`)).to.equal(expected);
    expect(render(`<span> foo <span>bar</span></span>`)).to.equal(renderWithChalk('foo bar'));
    expect(render(`<span> foo <span> bar </span></span>`)).to.equal(renderWithChalk('foo bar'));
  });

  it('strips whitespace correctly inside block tags', () => {
    const expected = renderWithChalk('foo');
    expect(render(`<div> foo </div>`)).to.equal(expected);
    expect(render(`<div>\nfoo\n</div>`)).to.equal(expected);
  });

});



// const simpleString = 'this is <bold>some bold <red>red</red> text</bold>';
// const styleTags = [
//   'reset',
//   'bold',
//   'dim',
//   'italic',
//   'underline',
//   'inverse',
//   'hidden',
//   'strikethrough',
//   'black',
//   'red',
//   'green',
//   'yellow',
//   'blue',
//   'magenta',
//   'cyan',
//   'white',
//   'gray',
//   'redBright',
//   'greenBright',
//   'yellowBright',
//   'blueBright',
//   'magentaBright',
//   'cyanBright',
//   'whiteBright',
//   'bgBlack',
//   'bgRed',
//   'bgGreen',
//   'bgYellow',
//   'bgBlue',
//   'bgMagenta',
//   'bgCyan',
//   'bgWhite',
//   'bgBlackBright',
//   'bgRedBright',
//   'bgGreenBright',
//   'bgYellowBright',
//   'bgBlueBright',
//   'bgMagentaBright',
//   'bgCyanBright',
//   'bgWhiteBright'
// ];

// describe('render()', function () {
//   it('throws an error on invalid input', function () {
//     for (const input of [null, undefined, {}, () => {}]) {
//       expect(() => render(input)).to.throw(TypeError);
//     }
//   });
//
//   it('returns a string', function () {
//     const result = render(simpleString);
//     expect(result).to.be.a('string');
//   });
//
//   it('ignores unknown and unmatched tags', function () {
//     const result = render('<baz>foo</bar>');
//     expect(result).to.equal('foo');
//   });
//
//   it('supports all ANSI codes from the ansi-styles package', function () {
//     for (const name of styleTags) {
//       const result = render(`<${name}>foo</${name}>`);
//       expect(result).to.equal(`${styles[name].open}foo${styles[name].close}`);
//     }
//   });
//
//   it('replaces `br` tags with line breaks', function () {
//     const result = render('foo<br>bar<br><br><br>baz<br>');
//     expect(result).to.equal(`foo${EOL}bar${EOL}${EOL}${EOL}baz${EOL}`);
//   });
//
//   it('allows custom tags to be supplied as an option', function () {
//     const result = render('foo<bar>baz</bar>', {
//       tags: {
//         bar: {
//           open: '!open-bar!',
//           close: '!close-bar!'
//         }
//       }
//     });
//     expect(result).to.equal(`foo!open-bar!baz!close-bar!`);
//   });
// });
