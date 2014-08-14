'use strict';

var gulp          = require('gulp');
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');
var connect       = require('gulp-connect');
var autoprefixer  = require('gulp-autoprefixer');
var ngAutobootstrap = require('gulp-ng-autobootstrap');
var less          = require('gulp-less');

var buildDir      = 'builds/development';
var srcDir        = 'src';

gulp.task('serve', function() {
	return connect.server({
		root: [buildDir],
		port: 8888,
		livereload: false
	});
});

gulp.task('js', ['ng-autobootstrap'], function() {
	return browserify('./src/js/main')
		.bundle({ debug: true })
		.pipe(source('main.js'))
		.pipe(gulp.dest(buildDir + '/js'));
});

gulp.task('ng-autobootstrap', function() {
	return gulp
		.src('src/js/**/*.js')
		.pipe(ngAutobootstrap({
			moduleTypes: {
				factory: {
					casing: 'camelCase'
				}
			}
		}))
		.pipe(gulp.dest('src/js'));
});

gulp.task('css', function() {
	return gulp
		.src(srcDir + '/less/main.less')
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulp.dest(buildDir + '/css'));
});

gulp.task('files', function() {
	return gulp
		.src(srcDir + '/files/**/*')
		.pipe(gulp.dest(buildDir));
});

gulp.task('build', ['js', 'files', 'css']);

gulp.task('default', ['serve', 'build'], function() {
	gulp.watch(srcDir + '/js/**/*.js', ['js']);
	gulp.watch(srcDir + '/less/**/*', ['css']);
	gulp.watch(srcDir + '/files/**/*', ['files']);
});