import { series, src, task } from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import requireDir from 'require-dir';
import del from 'del';

const $ = gulpLoadPlugins();

requireDir('./tasks');

task('clean', () => {
  return del(['.tmp', '.publish', 'dist'])
});

task(
  'travis-ci',
  series('build:website', function () {
    src('dist/website/tests.html')
    .pipe($.mochaPhantomjs());
  })
);

task('default', series('clean', 'build'));
