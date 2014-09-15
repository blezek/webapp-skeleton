/*
gulpfile.js
===========
Rather than manage one giant configuration file responsible
for creating multiple tasks, each task has been broken out into
its own file in gulp/tasks. Any files in that directory get
automatically required below.
To add a new task, simply add a new task file that directory.
gulp/tasks/default.js specifies the default set of tasks to run
when you run `gulp`.

Helpfully copied from https://github.com/greypants/gulp-starter/blob/master/gulpfile.js.
*/

/*
Command line arguments can be passed using this snippit:
https://github.com/gulpjs/gulp/blob/master/docs/recipes/pass-arguments-from-cli.md
*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
