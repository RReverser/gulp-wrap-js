var through = require('through2'),
	gutil = require('gulp-util'),
	esprima = require('esprima'),
	estemplate = require('estemplate'),
	escodegen = require('escodegen'),
	applySourceMap = require('vinyl-sourcemaps-apply'),
	path = require('path');

module.exports = function (tmpl, format) {
	'use strict';

	if (!tmpl) {
		throw new gutil.PluginError('gulp-wrap-js', 'No template supplied');
	}

	tmpl = estemplate.compile(tmpl, { attachComment:true });
	format = format || escodegen.FORMAT_DEFAULTS;

	return through.obj(function (file, enc, callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
		if (file.isNull()) {
			callback(null, file);
		}

		if (file.isStream()) {
			callback(new gutil.PluginError('gulp-wrap-js', 'Stream content is not supported'));
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {
			try {
				var ast = esprima.parse(file.contents, {
					loc: true,
					source: file.relative,
					range: true,
					tokens: true,
					comment: true
				});
				escodegen.attachComments(ast, ast.comments, ast.tokens);
				ast = tmpl(ast);
				var result = escodegen.generate(ast, {
					comment: true,
					format: format,
					sourceMap: true,
					sourceMapWithCode: true,
					file: file.relative
				});
				file.contents = new Buffer(result.code);
				if (file.sourceMap) {
					applySourceMap(file, JSON.parse(result.map.toString()));
				}
				callback(null, file);
			} catch(e) {
				// Relative to gulpfile.js filepath with forward slashes
				file = gutil.colors.magenta(path.relative('.', file.path).split(path.sep).join('/'));
				callback(new gutil.PluginError('gulp-wrap-js', file + ' ' + e.message))
			}
		}
	});
};
