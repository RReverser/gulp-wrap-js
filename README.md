# gulp-wrap-js
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Dependency Status][depstat-image]][depstat-url]

When using classic templating solutions (like Lo-Dash / Underscore templates / own regexps / etc.) for wrapping JavaScript code, you're manipulating code as strings under the hood, and so losing any inner structure and location information. Such approach is used in [gulp-wrap](https://github.com/adamayres/gulp-wrap), [gulp-wrap-amd](https://github.com/phated/gulp-wrap-amd), [gulp-wrap-umd](https://github.com/phated/gulp-wrap-umd) and that's why source maps are not currently supported in any of them.

In opposite, this plugin is based on AST templating [estemplate](https://github.com/RReverser/estemplate) library, and allows to wrap your JavaScript code into given template (UMD / AMD / whatever) with preserved locations for source maps generation.

Check out [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) for detailed instructions on working with source maps enabled plugins in Gulp.

## Usage

First, install `gulp-wrap-js` as a development dependency:

```shell
npm install --save-dev gulp-wrap-js
```

Then, add it to your `gulpfile.js`:

```javascript
var sourcemaps = require('gulp-sourcemaps');
var wrapJS = require("gulp-wrap-js");

gulp.src("./src/*.js")
    .pipe(sourcemaps.init())
        .pipe(wrapJS('define(function () {%= body %})'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
```

## API

### wrapJS(template, format)

#### template
Type: `String`  
**Required**

Template you wish to wrap your code with. Check out [estemplate docs](https://github.com/RReverser/estemplate#estemplatetmplstring-options-data) for all the possible substitution markers.

Note that in `gulp-wrap-js` you have only `body` array of statements passed to template as data.

#### format
Type: `Object`
Default: `escodegen.FORMAT_DEFAULTS`

[escodegen](https://github.com/Constellation/escodegen/wiki/API) output `format` options.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-wrap-js
[npm-image]: https://badge.fury.io/js/gulp-wrap-js.png

[travis-url]: http://travis-ci.org/RReverser/gulp-wrap-js
[travis-image]: https://secure.travis-ci.org/RReverser/gulp-wrap-js.png?branch=master

[depstat-url]: https://david-dm.org/RReverser/gulp-wrap-js
[depstat-image]: https://david-dm.org/RReverser/gulp-wrap-js.png
