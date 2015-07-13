/*global describe, it*/
'use strict';

var fs = require('fs'),
	gulp = require('gulp'),
	should = require('should'),
	assert = require('stream-assert'),
	sourcemaps = require('gulp-sourcemaps');

require('mocha');

delete require.cache[require.resolve('../')];

var gutil = require('gulp-util'),
	wrapJS = require('../');

describe('gulp-wrap-js', function () {
	var expectedFile = new gutil.File({
		path: 'test/expected/index.js',
		cwd: 'test/',
		base: 'test/expected',
		contents: fs.readFileSync('test/expected/index.js')
	});

	it('should produce expected file and source map', function (done) {
		gulp.src('test/fixtures/index.js')
		.pipe(sourcemaps.init())
		.pipe(wrapJS('// template comment\ndefine("%= file.relative %", function () {%= body %});'))
		.pipe(assert.first(function (file) {
			file.contents.toString().should.eql(expectedFile.contents.toString().trim());
			file.sourceMap.sources.should.eql([file.relative]);
			file.sourceMap.file.should.eql(expectedFile.relative);
			file.sourceMap.names.should.not.be.empty;
		}))
		.pipe(assert.end(done));
	});
});
