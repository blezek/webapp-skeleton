webapp-skeleton
===============

### Abstract

*Web application technologies and techniques are moving at an incredible pace.  This project seeks to recommend best-of-breed technologies at each level of the application stack, building a reusable prototype web application development repository.  The prototype web application shall run in node.js in a server/CLI mode, and be compilable for browser deployment.  Testing will be a central part of the project to ameliorate the interpreted nature of Javascript.*

# Deliverables

- github repository of a sample web app demonstrating current best practices and structure
- library functionality to run in node.js and/or browser
- Javascript style guide, including recommendations for application structure
- build process, possibly based on gulp, npm, and bowser
- embedded web server and livereload support
- sample test suite for local runs and travis-ci, possible packages are testling and mocha
- automated API documentation generation (optional, tools may not yet be robust)
- Sample project to include:
- library to extract MRML XML from a [MRB file](http://www.slicer.org/slicerWiki/index.php/Documentation/4.1/SlicerApplication/MainApplicationGUI#Medical_Reality_Bundle_.28.mrb.29_Note for details)
- display contents, print XML from node.js, convert to HTML in browser

# Foundational Components

### node
[node.js](http://nodejs.org/) is a Javascript execution engine built on Chrome's Javascript runtime.  node is a foundational portion of webapp development, providing many packages (bower, gulp, browserify, etc.) used to construct web applications.

### npm
[npm](https://www.npmjs.org/) is the node package manager and is responsible for installing versioned node packages, both locally or globally.

### bower
[bower](http://bower.io/) is a package manager for the web.  Vended packages can be placed in a file, ```bower.json```, to lock versions and managing dependancies.  

### gulp
[gulp](http://gulpjs.com/) is a streaming build system built upon [node](http://nodejs.org).  gulp permits writing tasks in a declaritive sense much like Make, and is much more flexible than [grunt](http://gruntjs.com/).

### Yeoman
(Yeoman)[http://yeoman.io/] is a build generator ecosystem.  Generator templates provide a modular architecture for building web apps.  Yeoman is interesting for getting started, however, the reliance on opinionated choices means learning is hampered.  After mastering the basics of webapp development, Yeoman should be helpful for productivity improvements.  Because of the bundling of grunt, Yeoman is less than ideal for our purposes.

### Bootstrap
[Bootstrap](http://getbootstrap.com/) will be used as a responsive web page scaffold.  It is well-documented and many templates exist.

### browserify

browserify is a compiler that enables Javascript code written for node to run in the browser.  Thus libraries written with node flavored require statements can be used inside webapps.  The [handbook](https://github.com/substack/browserify-handbook) gives a great overview browserify functionality in an easy-to-read, tutorial style handbook.

### BrowserSync

[BrowserSync](http://www.browsersync.io/) is a simple server that synchronizes browsers when files are written to a watched directory.  Getting started with gulp and BrowserSync and is made easy using the [gulp-starter](https://github.com/greypants/gulp-starter) example repo.

# Structure

## Project layout

### Directories
- `gulp` - gulp tasks are stored in this directory, one per file.  Each file is named after the task that it performs.  `gulpfile.js` uses [require-dir](https://github.com/troygoode/node-require-directory) to recursively load tasks.
- `src` - source code of the application.  Broken into different folders, including `main` and `test`.
  - `main` - application code
    - `html` - contains (drum roll please) HTML code
    - `images` - images used by the application
    - `javascript` - application source code
    - `css` - stylesheets CSS, SASS, etc.
  - `test` - test code
- `build` - build output

### Build
Build files go in the `build/html` directory.  HTML is stored in the root.
- `javascript` - output of browserify process
- `css` - output of stylesheet processing
- `images` - output if image processing (`gulp-imagemin`)



## Gulp build system

gulp builds the web app by pulling source code from the src directory, possibly processing and storing in the `build` directory.  HTML documents are stored in the root directory, images are stored in an images directory at the top level, javascript are compiled using browserify and stored in the javascript directory, and finally styles are compiled and stored in the css directory.  All references should be relative so the application becomes portable.

#### Tasks

- `default`
The default task builds the entire web app and starts up a BrowserSync server.

- `build`
The build task farms out to the `browserSync`, `browserify`, `images`, and `css` tasks to build the entire app.  This builds the browser code.  See `build-lib` to build the node library.

- `browserSync`
The browserSync task starts BowserSync

### assets

Assets include Javascript libraries, HTML frameworks, etc.  All assets should be controlled by `package.json` and mainly placed in the `devDependencies` section.  Initially, only `npm` will be used for downloading packages, but this may expand to bower, if necessary.

### browserify


### Continuous delivery

## Testing

### tape
[tape](https://www.npmjs.org/package/tape) is a simple testing library for npm and the browser.  It does not rely on magic imports like
mocha.

### testling
