var through = require('through2'),
	gutil = require('gulp-util'),
	esprima = require('esprima'),
	estemplate = require('estemplate'),
	escodegen = require('escodegen'),
	applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function (tmpl, format) {
	'use strict';

	if (!tmpl) {
		throw new gutil.PluginError('gulp-wrap-js', 'No template supplied');
	}

	tmpl = estemplate.compile(tmpl);
	format = format || escodegen.FORMAT_DEFAULTS;

	return through.obj(function (file, enc, callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-wrap-js', 'Stream content is not supported'));
			return callback();
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {
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
			this.push(file);
		}

		return callback();
	});
};
