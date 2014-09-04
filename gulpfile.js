var gulp = require('gulp'),
    path = require('path');

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

gulp.task('default', function () {

});
