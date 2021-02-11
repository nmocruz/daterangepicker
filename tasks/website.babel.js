import { src, task, series, dest, watch } from 'gulp';
import marked from 'marked';
import highlight from 'highlight.js';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import log from 'fancy-log';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: (code, lang) => {
    return highlight.highlightAuto(code, [lang]).value;
  }
});

function markdownFilter(code) {
  code = code
    .replace(/[\s\S]*(?=#+ Notable Features)/m, '')
    .replace(/#+ Copyright[\s\S]*/m, '');
  return marked(code);
}

task('images', () => {
  return src('website/images/*')
    .pipe(dest('dist/website/images'))
});

task(
  'html',
  series(['styles', 'scripts'], () => {
    return src('website/*.html')
      .pipe($.fileInclude({
        prefix: '@@',
        basepath: '@file',
        filters: {
          markdown: markdownFilter
        }
      })).on('error', log)
      .pipe(dest('.tmp'))
      .pipe(reload({stream: true}));
  })
);

task(
  'serve',
  series(['html', 'styles', 'scripts'], () => {
    browserSync({
      notify: false,
      port: 9000,
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
      },
      server: {
        baseDir: ['.tmp', 'website'],
        routes: {
          '/bower_components': 'node_modules',
          '/docs': '.tmp/docs.html',
          '/tests': '.tmp/tests.html',
          '/examples': '.tmp/examples.html'
        }
      }
    });

    watch([
      '{src,website}/scripts/**/*.coffee',
      'test/**/*.coffee',
      'src/templates/**/*.html',
      'website/**/*.html',
      '{docs,.}/*.md'
    ]).on('change', reload);

    watch('{src,website}/styles/**/*.scss', series(['styles']));
    watch('test/**/*.coffee', series(['scripts']));
    watch('{src,website}/scripts/**/*.coffee', series(['scripts']));
    watch('src/templates/**/*.html', series(['scripts']));
    watch('website/**/*.html', series(['html']));
    watch('{docs,.}/*.md', series(['html']));
  })
);

task(
  'build:website',
  series(['html', 'scripts', 'styles', 'images'],
  () => {
    const assets = $.useref.assets({searchPath: ['.tmp', 'website', '.']});

    return src('.tmp/*.html')
      .pipe(assets)
      .pipe($.if('*.js', $.uglify({preserveComments: 'license'})))
      .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe(dest('dist/website'))
      .pipe($.size({title: 'build:website', gzip: true}));
  })
);

task(
  'serve:website',
  series(['build:website'], () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['dist/website']
      }
    });
  })
);
