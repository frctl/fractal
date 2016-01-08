var input   = require('commander');
var launch  = require('../src/cli/launch');

input
    .command('foo')
    .option('-f, --force', 'force installation')
    .action(function(cmd) {
        console.log('asdasd');
        //
    });

input.parse(process.argv);

console.log(input);

// launch(input, input);
