const now = require('performance-now');

module.exports = function (opts = {}) {
  const start = now();

  function diff() {
    const end = now();
    return (end - start);
  }

  return {
    get diff() {
      return diff();
    },
    get seconds() {
      return (this.diff / 1000).toFixed(opts.decimals || 3);
    }
  };
};
