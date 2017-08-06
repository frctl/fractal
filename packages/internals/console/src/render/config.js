const figures = require('figures');

const tags = {

  pre: {
    display: 'block',
    preformatted: true
  },

  br: {
    display: 'inline',
    open: '%BR%'
  },

  div: {
    display: 'block'
  },

  ul: {
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

  message: {
    display: 'block'
  },

  success: {
    display: 'block',
    bullet: figures.tick,
    color: 'green'
  },

  warning: {
    display: 'block',
    bullet: figures.warning,
    color: 'yellow'
  },

  error: {
    display: 'block',
    bullet: figures.cross,
    color: 'red'
  },

  details: {
    display: 'block',
    color: 'dim',
    preformatted: true
  },

  section: {
    display: 'block',
    open: '%BR%',
    close: '%BR%'
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
    close: '}'
  };
});

module.exports = {tags};
