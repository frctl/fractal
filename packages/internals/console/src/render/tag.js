const {capitalize} = require('lodash');

const _config = new WeakMap();

class Tag {

  constructor(name, config) {
    this.name = name;
    _config.set(this, config);
  }

  get display() {
    return this.config.display || 'inline';
  }

  get preformatted() {
    return this.config.preformatted;
  }

  open(stack) {
    const config = this.config;
    let open = config.open || '';

    if (config.color) {
      open += `{${config.color} `;
    }

    if (config.bgColor) {
      open += `{bg${capitalize(config.bgColor)} `;
    }

    if (config.style) {
      open += `{${config.style} `;
    }

    if (config.bullet) {
      open += `${config.bullet} `;
    }

    return open;
  }

  close() {
    let close = this.config.close || '';
    for (const prop of ['color', 'style', 'bgColor']) {
      if (this.config[prop]) {
        close += `}`;
      }
    }
    return close;
  }

  get config() {
    return _config.get(this);
  }

}

module.exports = Tag;
