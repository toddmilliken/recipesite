const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const sasslint = require('gulp-sass-lint');
const bulkSass = require('gulp-sass-glob-import');
const autoprefixer = require('autoprefixer');
const plumberErrorHandler = require('./plumber-helpers').plumberErrorHandler;

/**
 * Wrapper function for the SCSS task that allows you to pass an instance
 * of a BrowserSync object. It should be the same instance created in your
 * gulpfile.js in order for CSS injection to work properly.
 *
 * @since  1.0.0
 *
 * @param  {Object}   browserSync Instance of BrowserSync created in gulpfile.js
 * @return {Function}             The function that processes SCSS.
 */
exports.init = (browserSync) => {
	/**
	 * Helper function to handle sass linting, vendor prefixes, sass compilation, and sourcemaps.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Array|String} 	src  Pattern to match
	 * @param  {String} 		dest Folder to output to
	 */
	return (src, dest) => {
		// Post CSS Processors
		const processors = [
			autoprefixer({
				browsers: [
					'last 4 versions',
					'ie >= 11',
					'iOS >= 8'
				]
			})
		];

		return gulp.src(src)
			.pipe(plumber(plumberErrorHandler))
			.pipe(sasslint({
				options : {
				    'merge-default-rules': false
				},
				rules : {
				    'border-zero': [
				        2, {
				            'convention': 'none'
				        }
				    ],
				    'brace-style': [
				        2, {
				            'style': '1tbs',
				            'allow-single-line': false
				        }
				    ],
				    'empty-args': [
				        2, {
				            'include': false
				        }
				    ],
				    'extends-before-declarations': true,
				    'extends-before-mixins': true,
				    'function-name-format': [
				        2, {
				            'allow-leading-underscore': true,
				            'convention': 'hyphenatedlowercase',
				            'convention-explanation': 'Because we need to have some kind of rule to follow and this feels right as of 06/01/2016'
				        }
				    ],
				    'hex-notation': [
				        2, {
				            'style': 'lowercase'
				        }
				    ],
				    'leading-zero': [
				        2, {
				            'include': false
				        }
				    ],
				    'mixins-before-declarations': [
				        2, {
				            exclude: [
								'xxs-up',
								'xxs-down',
								'xxs-only',
								'xs-up',
								'xs-down',
								'xs-only',
								'sm-up',
								'sm-down',
								'sm-only',
								'md-up',
								'md-down',
								'md-only',
								'lg-up',
								'lg-down',
								'lg-only',
								'mq',
								'jacket'
							]
				        }
				    ],
				    'nesting-depth': [
				        2, {
				            'max-depth': 4
				        }
				    ],
				    'no-duplicate-properties': 2,
				    'no-empty-rulesets': 2,
				    'no-ids': 2,
				    'no-invalid-hex': 2,
				    'no-misspelled-properties': 2,
				    'no-qualifying-elements': [
				        2, {
				            'allow-element-with-attribute': true
				        }
				    ],
				    'no-trailing-zero': 2,
				    'no-transition-all': 2,
				    'no-url-protocols': 2,
				    'one-declaration-per-line': 2,
				    'placeholder-in-extend': 2,
				    'quotes': [
				        2, {
				            'style': 'double'
				        }
				    ],
				    'single-line-per-selector': 2,
				    'space-after-colon': [
				        2, {
				            'include': true
				        }
				    ],
				    'space-around-operator': [
				        2, {
				            'include': true
				        }
				    ],
				    'space-before-bang': [
				        2, {
				            'include': true
				        }
				    ],
				    'space-before-brace': [
				        2, {
				            'include': true
				        }
				    ],
				    'space-before-colon': [
				        2, {
				            'include': false
				        }
				    ],
				    'variable-name-format': [
				        2, {
				            'allow-leading-underscore': false,
				            'convention': 'hyphenatedlowercase',
				            'convention-explanation': 'Variables are required to be hyphenated and lowercase to promote improved readability compared to other formats.'
				        }
				    ],
				    'zero-unit': [
				        2, {
				            'include': false
				        }
				    ]
				}
			}
		))
	    .pipe(sasslint.format())
	    .pipe(sasslint.failOnError())
		.pipe(bulkSass())
	    .pipe(sass({
			outputStyle: 'compressed'
	    }).on('error', sass.logError))
	    .pipe(postcss(processors))
	    .pipe(gulp.dest(dest))
		.pipe(browserSync.reload({
	    	stream: true
	    }));
	}
}
