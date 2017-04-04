const output = require('./ui');
const stopwatch = require('./timer');

const startup = stopwatch();

module.exports = function (opts, callback, fractal, env) {
  opts = Object.assign({
    options: {},
    global: false,
    parse: true,
    watch: false
  }, opts || {});

  const ui = output();

  return function (argv) {
    callback = callback.bind(ui);

    if (argv.debug) {
      process.env.DEBUG = true;
    }

    ui.br().debug(`Startup: ${startup.seconds}s`);

    const data = {
      env: env,
      args: argv
    };
    let messages = [];
    const onComplete = () => {
      listMessages();
      ui.debug(`Task complete: ${startup.seconds}s`).br();
    };

    function listMessages() {
      messages.forEach(msg => ui.message(msg.message, msg.data, msg.level));
      messages = [];
    }

    fractal.on('log.*', (message, data, level) => messages.push({message, data, level}));

    /*
     * if it's a global command or if initial parsing is disabled
     * then we can just run the handler without any more preamble
     */
    if (opts.parse === false) {
      callback(data, onComplete, ui);
      return;
    }

    function run(done) {
      const timer = stopwatch();
      done = done || onComplete;
      fractal.parse((err, components, files) => {
        if (err) {
          ui.error(err);
          return;
        }
        listMessages();
        ui.status(`Component parsing complete ${ui.utils.format(`[${timer.seconds}s]`, 'dim')}`, 'success');
        data.components = components;
        data.files = files;
        return callback(data, done, ui);
      });
    }

    /*
     * Parse the component library and then call the
     *  wrapped handler with the result.
     */
    if (opts.parse) {
      ui.status('Parsing components...');
      run();
    } else {
      return callback(data, onComplete, ui);
    }

    if (data.args.watch) {
      ui.status('Watching filesystem for changes...');
      fractal.watch(() => {
        run(() => {
          onComplete();
          ui.status('Watching filesystem for changes...');
        });
      });
    }
  };
};
