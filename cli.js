#! /usr/bin/env node

var program = require('commander');
var hue = require('./index.js');

var defaults = require('./defaults.js');

program
  .version('0.0.1')
  .option('-u, --user [value]', 'Hue User Name', defaults.user)
  .option('-i, --ip [value]', 'IP address of hue hub', defaults.ip)
  .option('-l, --light <n>', 'Light number (1, 2, etc.)', defaults.light)
  .option('-c, --color [value]', 'Any valid CSS color (\'red\', #00ff33, etc.)', defaults.color)
  .option('-o, --off', 'Turn off light specified by --light')
  .parse(process.argv);

var light = new hue.light(program.user, program.ip, program.light);

if (program.off) {
  light.off();
} else {
  light.on(program.color);
}
