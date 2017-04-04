const ora = require('ora');

module.exports = function () {
  return function (msg, status) {
    if (this._spinner) {
      if (!status) {
        this._spinner.text = msg;
      }
      if (!msg) {
        this._spinner.stop();
        this._spinner = null;
      }
    } else if (msg) {
      this._spinner = ora(msg).start();
    }

    if (status === 'success') {
      this._spinner.succeed(msg);
      this._spinner = null;
    } else if (status === 'error') {
      this._spinner.fail(msg);
      this._spinner = null;
    }

    return this;
  };
};
