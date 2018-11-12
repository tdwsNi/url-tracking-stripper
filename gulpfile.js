'use strict';

const gulp            = require('gulp');
const webpackStream   = require('webpack-stream');
const webpack         = require('webpack');
const webpackConfig   = require('./webpack.config.js');
const zip             = require('gulp-zip');
const clean           = require('gulp-clean');
const runSequence     = require('run-sequence');


const TARGET_DIR              = 'chrome';
const TARGET_UGLIFIED_DIR     = 'chrome_uglified';



// CLEAN
gulp.task('clean', function () {
  return gulp.src(`${TARGET_DIR}/`, {read: false})
    .pipe(clean());
});

// CLEAN UGLIFIED
gulp.task('clean-uglified', function () {
  return gulp.src(`${TARGET_UGLIFIED_DIR}/`, {read: false})
    .pipe(clean());
});


// IMAGES
gulp.task('images', function() {
  return gulp.src('./assets/images/**/*.*')
    .pipe(gulp.dest(`./${TARGET_DIR}/public/images/`));
});

// IMAGES FOR UGLIFIED
gulp.task('images-uglified', function() {
  return gulp.src('./assets/images/**/*.*')
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}/public/images/`));
});




// LIB
gulp.task('lib', function() {
  return gulp.src('./assets/lib/**/*.*')
    .pipe(gulp.dest(`./${TARGET_DIR}/public/lib/`));
});

// LIB FOR UGLIFIED
gulp.task('lib-uglified', function() {
  return gulp.src('./assets/lib/**/*.*')
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}/public/lib/`));
});





// HTML
gulp.task('html', function() {
  return gulp.src('./assets/**.html')
    .pipe(gulp.dest(`./${TARGET_DIR}`));
});

// HTML FOR UGLIFIED
gulp.task('html-uglified', function() {
  return gulp.src('./assets/*.html')
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}`));
});



// FAVICON
gulp.task('favicon', function() {
  return gulp.src('./assets/images/favicon/dev/**.*')
    .pipe(gulp.dest(`./${TARGET_DIR}/public/images/favicon/`));
});

// FAVICON FOR UGLIFIED
gulp.task('favicon-uglified', function() {
  return gulp.src('./assets/images/favicon/production/**.*')
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}/public/images/favicon/`));
});




// MANIFEST
gulp.task('manifest', function() {
  return gulp.src('./assets/manifest.json')
    .pipe(gulp.dest(`./${TARGET_DIR}`));
});

// MANIFEST FOR UGLIFIED
gulp.task('manifest-uglified', function() {
  return gulp.src('./assets/manifest.json')
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}`));
});


// MOVE FOR DEV
gulp.task('move', gulp.series('images', 'lib', 'html', 'favicon', 'manifest'));

// MOVE FOR UGLIFIED
gulp.task('move-uglified', gulp.series('images-uglified', 'lib-uglified', 'html-uglified', 'favicon-uglified', 'manifest-uglified'));


// WEBPACK
gulp.task('webpack', function() {
  // PACK NON-UGLIFIED
  return gulp.src('./assets')
    .pipe(webpackStream(webpackConfig.debug, webpack))
    .pipe(gulp.dest(`./${TARGET_DIR}/public/js`));
});


// WEBPACK FOR UGLIFIED
gulp.task('webpack-uglified', function() {
  // PACK PROD UGLIFIED
  return gulp.src('./assets')
    .pipe(webpackStream(webpackConfig.uglified, webpack))
    .pipe(gulp.dest(`./${TARGET_UGLIFIED_DIR}/public/js`));
});

// ZIP
gulp.task('zip', function() {
  return gulp.src(`./${TARGET_DIR}/**/*`)
    .pipe(zip('chrome_extension.zip'))
    .pipe(gulp.dest('./'));
});

// ZIP UP THE UGLIFIED VERSION
gulp.task('zip-uglified', function() {
  return gulp.src(`./${TARGET_UGLIFIED_DIR}/**/*`)
    .pipe(zip('chrome_extension-uglified.zip'))
    .pipe(gulp.dest('./'));
});


/*
* NON-UGLIFIED BUILD PROCESS
*
* $ gulp dev
*/
// BUILD AND WATCH NON-UGLIFIED
gulp.task('dev', function() {
  gulp.series('clean', 'move', 'webpack');

  gulp.watch('./assets/**/*', ['webpack']);
  gulp.watch('./assets/**.html', ['html']);
  gulp.watch('./assets/manifest.json', ['manifest']);

  console.log('Watching...');
});

// BUILD AND ZIP NON-UGLIFIED
gulp.task('build', gulp.series('clean', 'move', 'webpack', 'zip'));


/*
* UGLIFIED BUILD PROCESS
*
* $ gulp
*/
// BUILD AND ZIP UGLIFIED
gulp.task('default', gulp.series('clean-uglified', 'move-uglified', 'webpack-uglified', 'zip-uglified'));


/*
* SET ENVIRONMENT
*
*/

// gulp.task('production-env', function() {
//   return process.env.NODE_ENV = 'production';
// });


module.exports = gulp;
