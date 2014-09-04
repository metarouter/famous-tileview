var gulp = require('gulp'),
    path = require('path');

var CURRENT_DIR = path.join.bind(path, process.cwd()),
    SRC_DIR     = CURRENT_DIR.bind(null, 'examples'),
    BUILD_DIR   = CURRENT_DIR.bind(null, 'build');

gulp.task('static', function () {
  var staticFiles = ['*.html', '*.css'].map(SRC_DIR.bind(null, '**'));
  var destination = BUILD_DIR();

  gulp.src(staticFile, { read: false }).pipe(gulp.dest(destination));
});

gulp.task('default', function () {

});
