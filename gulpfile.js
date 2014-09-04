var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    glob       = require('glob'),
    path       = require('path'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    async      = require('async'),
    source     = require('vinyl-source-stream');

var CURRENT_DIR = path.join.bind(path, process.cwd()),
    SRC_DIR     = CURRENT_DIR.bind(null, 'examples'),
    BUILD_DIR   = CURRENT_DIR.bind(null, 'build');

gulp.task('static', function () {
  var staticFiles = ['*.html', '*.css'].map(function (file) {
    return SRC_DIR('**', file);
  });
  var destination = BUILD_DIR();

  gulp.src(staticFiles).pipe(gulp.dest(destination));
});

function buildApp (bw, appFileName, destination, done) {
  bw.bundle()
    .pipe(source(appFileName))
    .pipe(gulp.dest(destination))
    .on('end', done);
}

gulp.task('scripts', function (done) {
  var appFileName = 'app.js';
  glob(SRC_DIR('**', appFileName), function (err, files) {
    if (err) {
      return gutil.log(err);
    }

    async.each(files, function (file, done) {
      var b = browserify(file, watchify.args),
          w = watchify(b);

      var fileDir = path.dirname(file),
          baseDir = fileDir.replace(SRC_DIR(), ''), // fileDir - SRC_DIR
          destination = BUILD_DIR.apply(null, baseDir.split(path.sep)),
          build = buildApp.bind(null, w, appFileName, destination);

      build(done);
      w.on('update', build.bind(null, Function.prototype));
    }, done);
  });
});

gulp.task('default', function () {

});
