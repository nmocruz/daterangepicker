import {src, dest, series, task} from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
require('./build.babel');

const $ = gulpLoadPlugins();

function bump(type) {
  return src('./package.json')
    .pipe($.bump({type: type}))
    .pipe(dest('./'));
}

// task('bump:major', series([bump('major'), 'build:min'], () => {}));

task(
  'bump:minor',
  series([
    () => {
      return src('./package.json')
      .pipe($.bump({type: 'minor'}))
      .pipe(dest('./'))
    },
    'build:min']
  )
);

// task('bump:patch', series([bump('patch'), 'build:min']));
