const figures = require('figures');

const tags = {

  pre: {
    display: 'block',
    preformatted: true
  },

  br: {
    display: 'inline',
    open: '%BR%',
    strip: {
      after: true,
      true: true
    }
  },

  p: {
    display: 'block'
  },

  div: {
    display: 'block'
  },

  ul: {
    display: 'block'
  },

  ol: {
    display: 'block'
  },

  li: {
    display: 'block',
    bullet: '*'
  },

  span: {
    display: 'inline'
  },

  em: {
    display: 'inline',
    style: 'italic'
  },

  strong: {
    display: 'inline',
    style: 'bold'
  },

  success: {
    display: 'block',
    bullet: figures.tick
  }

};

const styles = [
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

styles.forEach(name => {
  tags[name] = {
    display: 'inline',
    open: `{${name} `,
    close: '}',
    strip: {
      after: false,
      true: false
    }
  };
});

module.exports = {tags};
