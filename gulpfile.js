const { src, dest, watch, parallel, series } = require('gulp'); // Сборочка 
const sass = require('gulp-sass'); // Препроцессор CSS
const pug = require('gulp-pug'); // Препроцессор для HTML
const concat = require('gulp-concat'); // Обьединение в один файл
const browserSync = require('browser-sync').create(); // Автоматическое обновление браузера
const uglify = require('gulp-uglify-es').default; // Минификация js
const autoprefixer = require('gulp-autoprefixer'); // Префиксы CSS для старых браузеров
const imagemin = require('gulp-imagemin'); // Минификация картинок
const rimraf = require('rimraf'); // Очистка сборки

const DIST_DIR = 'dist';
const SRC_DIR = 'src';

function server() {
  browserSync.init({
    server: DIST_DIR
  });

  build();
  watching();
};

function html() {
  return src(`${SRC_DIR}/pages/**/*pug`)
    .pipe(pug(
      {
        pretty: true,
        basedir: SRC_DIR
      }
    ))
    .pipe(dest(DIST_DIR))
    .pipe(browserSync.stream())
};

function style() {
  return src(`${SRC_DIR}/styles/style.scss`)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 version']
    }))
    .pipe(dest(`${DIST_DIR}/css`))
    .pipe(browserSync.stream())
};

function script() {
  return src(`${SRC_DIR}/**/*.js`)
    .pipe(concat('main.min.js'))
    .pipe(dest(`${DIST_DIR}/js`))
    .pipe(browserSync.stream())
};

function image() {
  return src(`${SRC_DIR}/accets/img/**/*`)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(`${DIST_DIR}/img`))
    .pipe(browserSync.stream())
};

function fonts() {
  return src(`${SRC_DIR}/accets/fonts/**/*`)
    .pipe(dest(`${DIST_DIR}/fonts`))
    .pipe(browserSync.stream())
};

function cleanup(cb) {
  rimraf.sync(DIST_DIR);
  cb();
};

const build = series([
  cleanup,
  parallel([html, style, script, fonts, image])
]);

function watching() {
  watch(`${SRC_DIR}/**/*.scss`, style);
  watch(`${SRC_DIR}/**/*.pug`, html);
  watch(`${SRC_DIR}/**/*.js`, script);
  watch(`${SRC_DIR}/**/*`, image);
  watch(`${SRC_DIR}/**/*`, fonts);
};

exports.default = server;