import {src, dest, series, task} from 'gulp';
import fs from 'fs';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import log from 'fancy-log';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function banner() {
  var pkg = readJson('./package.json');
  var bower = readJson('./bower.json');
  return `
    /*!
     * ${bower.name}
     * version: ${pkg.version}
     * authors: ${bower.authors}
     * license: ${bower.license}
     * ${bower.homepage}
     */
  `.replace(/\n\s{0,4}/g, '\n').replace('\n', '');
}
exports.banner = banner;

task('styles', () => {
  return (
    src([
        'src/styles/*.scss',
        'website/styles/*.scss'
      ])
      .pipe($.plumber())
      .pipe($.sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
      }).on('error', log))
      .pipe($.autoprefixer())
      .pipe(dest('.tmp/styles'))
      .pipe(reload({stream: true}))
  )
});

task('scripts', () => {
  return (
    src([
      'src/scripts/*.coffee',
      'website/scripts/*.coffee'
    ])
    .pipe($.include()).on('error', log)
    .pipe($.plumber())
    .pipe($.coffee().on('error', log))
    .pipe(dest('.tmp/scripts'))
    .pipe(reload({stream: true}))
  )
});

task('build', series(['scripts', 'styles'], () => {
  return src(['.tmp/scripts/daterangepicker.js', '.tmp/styles/daterangepicker.css'])
    .pipe($.header(banner()))
    .pipe(dest('dist/'))
    .pipe($.size({title: 'build', gzip: true}))
  })
);

task(
  'build:min',
  series(['build'], () => {
    return src(['dist/daterangepicker.js', 'dist/daterangepicker.css'])
      .pipe($.if('*.js', $.babelMinify()))
      .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
      .pipe($.if('*.js', $.extReplace('.min.js')))
      .pipe($.if('*.css', $.extReplace('.min.css')))
      .pipe(dest('dist/'))
      .pipe($.size({title: 'build:min', gzip: true}));
  })
);
