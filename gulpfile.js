// --------------------------------
// Gulp Plugins
// --------------------------------

/**
 * Gulp - Duh
 */
const gulp = require('gulp');

/**
 * SVG
 */
const svgo 			= require('gulp-svgo');
const svgmin 		= require('gulp-svgmin');
const svgstore 		= require('gulp-svgstore');
const inlineSvg 	= require('gulp-inline-svg');

/**
 * Other
 */
const fs 			= require('fs');
const del 			= require('del');
const zip 			= require('gulp-zip');
const path 			= require('path');
const notify 		= require('gulp-notify');
const plumber 		= require('gulp-plumber');
const cheerio 		= require('gulp-cheerio');
const browserSync 	= require('browser-sync').create();

/**
 * Sass
 * @see gulp/process-scss.js
 */
const processSCSS = require('./gulp/process-scss').init(browserSync);

/**
 * Javascript
 * @see gulp/process-js.js
 */
const processJS = require('./gulp/process-js');

// --------------------------------
// Globals
// --------------------------------

/**
 * Let's us access the contents of package.json as an object.
 * @type {Object}
 */
const packagejson = JSON.parse(fs.readFileSync('./package.json'));

/**
 * The host you'd like to use while working locally.
 * @type {String}
 */
const host = "recipesite.local";
const protocol = 'http';

/**
 * Paths to files in /src directory.
 * @type {Object}
 */
const src = {
	root: 'src',
};

src.sass = `${src.root}/sass`;
src.js = `${src.root}/js`;
src.images = `${src.root}/images`;
src.icons = `${src.images}/icons`;
src.patternlab = `${src.root}/_patternlab`;

/**
 * Paths to files in /build directory.
 * @type {Object}
 */
const build = {
	root: 'build',
};

build.css = `${build.root}/css`;
build.js = `${build.root}/js`;
build.images = `${build.root}/images`;
build.icons = `${build.images}/icons`;

/**
 * Reusable file matching globs.
 * @type {Object}
 */
const globs = {
	src: {
		js: [
			`${src.js}/**/*.js`
		],
		sass: [
			`${src.sass}/**/*.scss`
		],
		svg: [
			`${src.images}/**/*.svg`,
			`!${src.images}/social-icons.svg`
		],
		icons: [
			`${src.icons}/**/*.svg`
		],
		other: [
			`${src.root}/**`,
		  	`!${src.sass}{,/**}`,
		  	`!${src.js}{,/**}`,
			`!${src.images}/**/*/svg`,
			`!${src.icons}{,/**}`,
			`!${src.patternlab}{,/**}`
		],
	},
	build: {
		js: [
			`${build.js}/**/*.js`
		],
		css: [
			`${build.css}/**/*.css`
		],
		svg: [
			`${build.images}/**/*.svg`
		],
		icons: [
			`${build.icons}/**/*.svg`
		],
		other: [
			`${build.root}/**`,
			`!${build.root}`,
		  	`!${build.css}/**`,
		  	`!${build.js}/**`,
			`!${build.images}/**/*.svg`,
			`!${build.icons}/**/*.svg`,
			`!${build.root}/maps/**`,
		],
	}
};

/**
 * Gulp Error Handling
 */
const plumberErrorHandler = {
	errorHandler: notify.onError({
		title: 'Gulp - Error',
		message: 'Error: <%= error.message %>'
	})
};

/**
 * Delete all files, except js, css, and svg, from build directory.
 */
gulp.task('clean', () => {
	return del(globs.build.other);
});

/**
 * Move Files into Build Folder
 */
gulp.task('copy', () => {
	console.log('## Move all files (except .scss, .js, and .svg) into the build directory ##');
	return gulp.src(globs.src.other)
		.pipe(gulp.dest(build.root));
});

/**
 * Compress Build Files into Zip
 * Dependent on the build task completing
 *
 * @link https://www.npmjs.com/package/gulp-zip
 */
gulp.task('zip', () => {
	console.log('## Pack up our files into a zip into the dist directory ##');
	return gulp.src(`${build.root}/**`)
    	.pipe(zip(`${packagejson.name}.zip`))
    	.pipe(gulp.dest('dist'));
});

gulp.task('dist', gulp.series('clean', 'copy', 'zip'));

/**
 * CSS
 *
 * @see gulp/process-scss.js
 */

gulp.task('css:clean', () => {
 	return del(globs.build.css);
});

gulp.task('css:process', () => {
	return processSCSS(globs.src.sass, build.css);
});

gulp.task('css', gulp.series('css:clean', 'css:process'));


/**
 * JavaScript
 *
 * @see gulp/process-js.js
 */
gulp.task('js:clean', () => {
	return del(globs.build.js);
});

gulp.task('js:process', (done) => {
	processJS.processDirectory(src.js, build.js);
	done();
});

gulp.task('js', gulp.series('js:clean', 'js:process'));

/**
 * SVG Tasks
 *
 * Takes all files from a directory ending in ".svg", and creates a dynamically generated
 * sass partial that converts all sources into optimized Data URIs. This sass partial is then
 * distributed into our theme's sass directory. It also includes mixins for using each
 * icon as a background-image.
 *
 * @ref: https://www.npmjs.com/package/gulp-svgo
 * @ref: https://www.npmjs.com/package/gulp-inline-svg
 */
gulp.task('svg:sass-partial', (done) => {
	const svgs = gulp.src(globs.src.svg);

	if(svgs) {
		return gulp.src(globs.src.svg)
	        .pipe(svgo())
	        .pipe(inlineSvg())
	        .pipe(gulp.dest(`${src.sass}/config/variables`));
	} else {
		done();
	}
});

//---
// SVG SPRITE TASK
//---
gulp.task('svg:sprite', (done) => {
	if(fs.existsSync(src.icons)) {
		return gulp.src(globs.src.icons, {base: src.icons})
			.pipe(cheerio({
				run: function($) {
					$('[stroke]').each(function() {
						$this = $(this);
						if ( $this.attr('stroke') === 'none' ) {

						} else {
							$this.attr('stroke', 'currentColor');
						}
					});
					$('[fill]').each(function() {
						$this = $(this);
						if ( $this.attr('fill') === 'none' ) {

						} else {
							$this.attr('fill', 'currentColor');
						}
					});
				},
				parserOptions: { xmlMode: true }
			}))
			.pipe(svgmin(function(file) {
				const prefix = path.basename(file.relative, path.extname(file.relative));
				return {
					plugins: [{
						cleanupIDs: {
							prefix: prefix + '-',
							minify: false,
							remove: false
						}
			        }]
				};
			}))
			.pipe(svgstore({
				copyAttrs: true
			}))
			.pipe(gulp.dest(build.icons));
	} else {
		done();
	}
});

gulp.task('svg:clean', () => {
	return del(globs.build.svg);
});

gulp.task('svg', gulp.series('svg:clean', 'svg:sass-partial', 'svg:sprite'));

// --------------------------------
// Server Tasks
// --------------------------------

gulp.task('serve', (done) => {
	browserSync.init({
		proxy: {
		    target: `${protocol}://${host}`,
		}
	},
	() => {
		console.log('SITE WATCHING FOR CHANGES');
		done();
	});
});

// --------------------------------
// Watch Tasks
// --------------------------------

gulp.task('watch', (done) => {
	// General Watcher
	gulp.watch(globs.src.other, gulp.series('dist'));

	// Sass Watcher
	gulp.watch(globs.src.sass, gulp.series('css', 'zip'));

	// JavaScript Watcher
	gulp.watch(globs.src.js, gulp.series('js', 'zip'));

	// SVG Watcher
	// Not running the 'zip' task because this task triggers the 'css' task, which runs the 'zip' task afterwards.
	gulp.watch(globs.src.svg, gulp.series('svg'));

	done();
});


// --------------------------------
// Default Task
// --------------------------------

gulp.task('default', gulp.series(
	'css',
	'js',
	'svg',
	'dist',
	'serve',
	'watch',
	(done) => {
		done();
    }
));
