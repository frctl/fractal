/* eslint no-unused-vars: off, unicorn/no-process-exit: off */

const _ = require('lodash');
const reqAll = require('req-all');
const cli = require('@frctl/console');
const yargonaut = require('yargonaut').style('cyan').errorsStyle('red.bold');

module.exports = function (fractal) {
  const yargs = require('yargs');
  const bundled = reqAll('./commands');
  const commands = [];

  yargs.usage(cli.format(`\n$0 <command> [...]`, 'yellow.bold'))

    .showHelpOnFail(true)
    .help('h').alias('h', 'help')
    .fail(function (msg, err, yargs) {
      if (err) {
        throw err;
      }
      cli.error(msg);
      cli.draw.br();
      cli.log(yargs.help());
      cli.draw.br();
      process.exit(1);
    })
    .version(fractal.VERSION);

  for (const command of _.values(bundled)) {
    yargs.command(command(fractal, yargs));
  }

  return {

    addCommand(...args) {
      yargs.command(...args);
      return this;
    },

    exec(...args) {
      if (args.length > 0) {
        return yargs.parse(...args);
      }
      return yargs.argv;
    }

  };
};

// class Commander {
//
//   constructor() {
//     commands.set(this, []);
//   }
//
//
//
//   addCommand(...args) {
//     commands.get(this).add(args);
//   }
//
//   exec(...args) {
//
//     const yargs = require('yargs/yargs')(process.argv.slice(2));
//
//     for (const command of commands.get(this)) {
//       yargs.command(...command);
//     }
//
//     if (args.length > 0) {
//       return yargs.parse(...args);
//     }
//
//     return yargs.argv;
//
//   }
//
// }
//
// mod

// //
// // const entities = ['components','files'];
// //
// // module.exports = function(fractal){
// //
// //   const commands = {
// //     components: [],
// //     files: [],
// //     global: []
// //   };
// //
// //   entities.forEach(key => commands[key] = require(`./${key}/cli`)(fractal).map(cmd => [cmd]));
// //
// //   return {
// //
// //     addCommand(...args) {
// //
// //       let commandStr;
// //       let isModule = false;
// //
// //       if (args.length === 1 && _.isPlainObject(args[0])) {
// //         commandStr = args[0].command;
// //         isModule = true;
// //       } else {
// //         commandStr = args[0];
// //       }
// //
// //       const matcher = /^(components|files)\s*(.*)$/;
// //
// //       if (matcher.test().commandStr) {
// //         const matches = commandStr.match(matcher);
// //         if (matches) {
// //           const [type, subCommand] = matches;
// //           if (isModule) {
// //             args[0].command = subCommand;
// //           } else {
// //             args[0] = subCommand;
// //           }
// //           commands[type].push(args);
// //         }
// //       } else {
// //          commands.global.push(args);
// //       }
// //
// //     },
// //
// //     execCommand(...args) {
// //       this.builder.parse(...args);
// //     },
// //
// //     get builder() {
// //       const yargs = require('yargs/yargs')(process.argv.slice(2));
// //
// //       entities.forEach(key => {
// //         yargs.command({
// //           command: `${key} <command>`,
// //           aliases: [key.slice(0,2)],
// //           description: `${key} commands`,
// //           handler: function(yargs) {
// //             for (const command of commands[key]) {
// //               yargs.command(...command);
// //             }
// //           }
// //         });
// //       });
// //
// //       for (const command of commands.global) {
// //         yargs.command(...command);
// //       }
// //
// //       return yargs;
// //     }
// //
// //   };
// //
// // };
