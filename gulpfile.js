var gulp      = require('gulp'),
  sass        = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  imagemin    = require('gulp-imagemin'),
  concat      = require('gulp-concat'),
  plumber     = require('gulp-plumber'),
  uglify      = require('gulp-uglify'),
  rename      = require('gulp-rename'),
  uglifycss   = require('gulp-uglifycss'),
  sourcemaps  = require('gulp-sourcemaps'),
  autoprefix  = require('gulp-autoprefixer'),
  bourbon     = require('node-bourbon'),
  reload      = browserSync.reload;

var pathSRC = {
  sass        : "src/scss/**/*.scss",
  vendors     : ["node_modules/bootstrap/dist/css/bootstrap.min.css",
                 "node_modules/font-awesome/css/font-awesome.min.css"],
  bsmap       : "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
  imageMin    : "src/images/*.*",
  html        : "index.html",
  bourbon     : ["src/scss/components/*.scss", "src/scss/pages/*.scss"],
  myScripts   : "src/js/*.js",
  otherjs     : ["node_modules/jquery/dist/jquery.min.js",
                 "node_modules/tether/dist/js/tether.min.js",
                 "node_modules/bootstrap/dist/js/bootstrap.min.js"],
  fontAwesome : ["node_modules/font-awesome/fonts/fontawesome-webfont.eot",
                 "node_modules/font-awesome/fonts/fontawesome-webfont.svg",
                 "node_modules/font-awesome/fonts/fontawesome-webfont.ttf",
                 "node_modules/font-awesome/fonts/fontawesome-webfont.woff",
                 "node_modules/font-awesome/fonts/fontawesome-webfont.woff2",
                 "node_modules/font-awesome/fonts/FontAwesome.otf"]
};

var pathDEST = {
  styles      : "dist/assets/css",
  imageMin    : "dist/assets/images",
  destjs      : "dist/assets/js",
  html        : "dist/views",
  fontAwesome : "dist/assets/fonts"
}



//
// SASS TASK (CONCAT)
//
gulp.task('sass', function() {
  return gulp.src(pathSRC.sass)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({
      includePaths: pathSRC.bourbon
    }).on('error', sass.logError))
    .pipe(concat('mystyles.css'))
    .pipe(autoprefix())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(pathDEST.styles))
    .pipe(reload({
      stream: true
    }));
});



//
// CSS-MIN TASK (CONCAT AND MINIFY MY CSS)
//
gulp.task('css-min', function() {
  return gulp.src(pathSRC.sass)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('mystyles.css'))
    .pipe(autoprefix())
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(sourcemaps.write())
    .pipe(rename('mystyles.min.css'))
    .pipe(gulp.dest(pathDEST.styles));
});



//
// VENDORS TASK (CONCAT)
//
gulp.task('vendor', function() {
  return gulp.src(pathSRC.vendors)
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(pathDEST.styles));
});



//
// bootstrapMap TASK (just copy from node_modules to dist)
//
gulp.task('bootstrapMap', function(){
  return gulp.src(pathSRC.bsmap)
    .pipe(gulp.dest(pathDEST.styles))
});



//
// font-awesome TASK (copy also from node_modules to dist)
//
gulp.task('font-awesome', function(){
  gulp.src(pathSRC.fontAwesome)
  .pipe(gulp.dest(pathDEST.fontAwesome));
});



//
// BROWSER SYNC task
//
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});



//
// image-min task
//
gulp.task('image-min', function() {
  return gulp.src(pathSRC.imageMin)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(pathDEST.imageMin));
});



//
// html task
//
gulp.task('html', function() {
  return gulp.src(pathSRC.html)
    .pipe(plumber())
    .pipe(gulp.dest(pathDEST.html))
    .pipe(reload({
      stream: true
    }));
});



//
// other-js task (concat them all)
//
gulp.task('other-js', function() {
  return gulp.src(pathSRC.otherjs)
  .pipe(concat('otherjs.min.js'))
    .pipe(gulp.dest(pathDEST.destjs));
});



//
// my-scripts task
//
gulp.task('my-scripts', function() {
  return gulp.src(pathSRC.myScripts)
    .pipe(uglify())
    .pipe(rename('myscript.min.js'))
    .pipe(plumber())
    .pipe(gulp.dest(pathDEST.destjs))
    .pipe(reload({
      stream: true
    }));
});


//
// watch task
//
gulp.task('watch', function() {
  gulp.watch(pathSRC.sass, ['sass']);
  gulp.watch(pathSRC.sass, ['css-min'])
  gulp.watch(pathSRC.html, ['html']);
  gulp.watch(pathSRC.myScripts, ['my-scripts']);
});



//
// default task
//
gulp.task('default', ['sass', 'css-min', 'vendor', 'bootstrapMap', 'font-awesome', 'browser-sync', 'image-min', 'other-js', 'my-scripts', 'html', 'watch']);
