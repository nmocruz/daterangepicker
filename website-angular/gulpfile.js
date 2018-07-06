var gulp = require('gulp');
var ngGraph = require('gulp-angular-architecture-graph');
var print = require('gulp-print').default;

gulp.task('print', (done) => {
    gulp.src('../dist/out-tsc/src/**/*.js')
        .pipe(print());
    done();
});

gulp.task('default', function(done) {
    gulp.src('../dist/out-tsc/src/**/*.js')
        .pipe(ngGraph({
            dest: 'architecture'
        }));
    done();
});
