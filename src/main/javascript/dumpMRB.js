var mrb = require ( './mrb' );
var fs = require('fs');

console.log ( 'starting');
var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log ( "these were my arguments: ", program.args );



// read a zip file
fs.readFile(program.args[0], function(err, data) {
  if (err) throw err;
  mrb.readMRB(data);
});
