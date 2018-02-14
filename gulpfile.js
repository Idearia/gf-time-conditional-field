/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
var project                 = 'volpetti'; // Project Name.
var projectURL              = 'https://' + project + '.local'; // Local project URL of your already running WordPress site. Could be something like local.dev or localhost:8888.
var productURL              = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Style related.
var styleSRC                = './src/sass/style.scss'; // Path to main .scss file.
var styleDestination        = './assets/css/'; // Path to place the compiled CSS file.
// Default set to root folder.

// JS Vendor related.
var jsVendorSRC             = './src/js/vendor/*.js'; // Path to JS vendor folder.
var jsVendorDestination     = './assets/js/'; // Path to place the compiled JS vendors file.
var jsVendorFile            = 'vendors'; // Compiled JS vendors file name.
// Default set to vendors i.e. vendors.js.

// JS Custom related.
var jsCustomSRC             = './src/js/custom/*.js'; // Path to JS custom scripts folder.
var jsCustomDestination     = './assets/js/'; // Path to place the compiled JS custom scripts file.
var jsCustomFile            = 'custom'; // Compiled JS custom file name.
// Default set to custom i.e. custom.js.

// Watch files paths.
var styleWatchFiles         = './src/sass/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
var vendorJSWatchFiles      = './src/js/vendor/*.js'; // Path to all vendor JS files.
var customJSWatchFiles      = './src/js/custom/*.js'; // Path to all custom JS files.
var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.



// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
	'last 2 version',
	'> 1%',
	'ie >= 9',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4',
	'bb >= 10'
  ];

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq          = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files

// Replace related plugin
var replace = require('gulp-replace');

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var sort         = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', function() {
  browserSync.init( {

	// For more options
	// @link http://www.browsersync.io/docs/options/

	// Project URL.
	proxy: projectURL,

	// `true` Automatically open the browser with BrowserSync live server.
	// `false` Stop the browser from automatically opening.
	open: true,

	// Inject CSS changes.
	// Commnet it to reload browser for every CSS change.
	injectChanges: true,

	// Use a specific port (instead of the one auto-detected by Browsersync).
	// port: 7000,
	https: true,
  } );
});


/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
 gulp.task('styles', function () {
	gulp.src( styleSRC )
	.pipe( sourcemaps.init() )
	.pipe( sass( {
	  errLogToConsole: true,
	  outputStyle: 'compact',
	  // outputStyle: 'compressed',
	  // outputStyle: 'nested',
	  // outputStyle: 'expanded',
	  precision: 10
	} ) )
	.on('error', console.error.bind(console))
	.pipe( sourcemaps.write( { includeContent: false } ) )
	.pipe( sourcemaps.init( { loadMaps: true } ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

	.pipe( sourcemaps.write ( '' ) )
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( styleDestination ) )

	.pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
	.pipe( mmq( { log: true } ) ) // Merge Media Queries only for .min.css version.

	.pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.

	.pipe( rename( { suffix: '.min' } ) )
	.pipe( minifycss( {
	  maxLineLen: 10
	}))
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( styleDestination ) )

	.pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
	.pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
	.pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
 });


 /**
  * Task: `vendorJS`.
  *
  * Concatenate and uglify vendor JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS vendor files
  *     2. Concatenates all the files and generates vendors.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates vendors.min.js
  */
 gulp.task( 'vendorsJs', function() {
  gulp.src( jsVendorSRC )
	.pipe( concat( jsVendorFile + '.js' ) )
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( jsVendorDestination ) )
	.pipe( rename( {
	  basename: jsVendorFile,
	  suffix: '.min'
	}))
	.pipe( uglify() )
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( jsVendorDestination ) )
	.pipe( notify( { message: 'TASK: "vendorsJs" Completed! 💯', onLast: true } ) );
 });


 /**
  * Task: `customJS`.
  *
  * Concatenate and uglify custom JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS custom files
  *     2. Concatenates all the files and generates custom.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates custom.min.js
  */
 gulp.task( 'customJS', function() {
	gulp.src( jsCustomSRC )
	.pipe( concat( jsCustomFile + '.js' ) )
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( jsCustomDestination ) )
	.pipe( rename( {
	  basename: jsCustomFile,
	  suffix: '.min'
	}))
	.pipe( uglify() )
	.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
	.pipe( gulp.dest( jsCustomDestination ) )
	.pipe( notify( { message: 'TASK: "customJs" Completed! 💯', onLast: true } ) );
 });



gulp.task('rename', function() {
	gulp.src(['**/*.php', '**/*.scss'])
	 .pipe(replace(default_template_text_domain, text_domain))
	 .pipe(gulp.dest('./'))
	 .pipe( notify( { message: 'TASK: "rename" Completed! 💯', onLast: true } ) )
 });

 /**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
 gulp.task( 'default', ['styles', 'vendorsJs', 'customJS'], function () {
  gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
  gulp.watch( styleWatchFiles, [ 'styles' ] ); // Reload on SCSS file changes.
  gulp.watch( vendorJSWatchFiles, [ 'vendorsJs', reload ] ); // Reload on vendorsJs file changes.
  gulp.watch( customJSWatchFiles, [ 'customJS', reload ] ); // Reload on customJS file changes.
 });
