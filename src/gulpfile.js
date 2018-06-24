/**
 * gulpfile任务清单：
 *   1. build   执行编译、压缩、上传并删除public文件夹
 *   2. watch   执行编译并监听文件变化
 *   3. default 执行编译
 */

'use strict'
const path = require('path')
const appName = path.resolve(__dirname, '../').split('/').pop()                         // 项目的名称
const publicPath = '../public'                                                          // 静态资源输出目录
const viewPath = '../views'                                                             // 模版文件输出目录

const jsFiles = ['./js/*.js']                                                           // js文件
const cssFiles = ['./css/*.scss', './css/*.css']                                        // css文件
const htmlFiles = ['./tpl/*.hbs', './tpl/*.html']                                       // html文件
const imgFiles = ['./img/*.png', './img/*.jpg', './img/*.gif']                          // img文件
const watchPath = jsFiles.concat(cssFiles.concat(htmlFiles))                            // 监听文件变化的路径

const jsOutput = `${publicPath}/js`                                                     // js输出目录
const cssOutput = `${publicPath}/css`                                                   // css输出目录
const htmlOutput = viewPath                                                             // html输出目录
const imgOutput = `${publicPath}/img`                                                   // img输出目录
const revOutput = './rev'                                                               // 本地资源与CDN资源路径的映射

const imgInCss = '../img'                                                               // img在css中的路径
const imgInJs = `/${appName}/img`                                                       // img在js中的路径
const imgInHtml = `/${appName}/img`                                                     // img在html中的路径
const jsInHtml = `/${appName}/js`                                                       // js在html中的路径
const cssInHtml = `/${appName}/css`                                                     // css在html中的路径

const jsOutFiles = [`${jsOutput}/*.js`]                                                 // js输出文件
const cssOutFiles = [`${cssOutput}/*.scss`, `${cssOutput}/*.css`]                       // css输出文件
const htmlOutFiles = [`${htmlOutput}/*.hbs`, `${htmlOutput}/*.html`]                    // html输出文件
const imgOutFiles = [`${imgOutput}/*.png`, `${imgOutput}/*.jpg`, `${imgOutput}/*.gif`]  // img输出文件

var gulp = require('gulp')
var sass = require('gulp-sass')
var clean = require('gulp-clean')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var cssmin = require('gulp-cssmin')
var flatten = require('gulp-flatten')
var htmlmin = require('gulp-htmlmin')
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var runSequence = require('gulp-sequence')
var autoprefixer = require('gulp-autoprefixer')

// 上传七牛sdn
//var qn = require('gulp-qn')
// MD5戳
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
// var qntoken = require('../../../libs/qn')
// var qiniu = {
//   accessKey: qntoken.accessKey,
//   secretKey: qntoken.secretKey,
//   bucket: qntoken.bucket,
//   domain: qntoken.cdnBase
// }

gulp.task('js', () =>
  gulp.src(jsFiles)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(flatten())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(jsOutput))
)

gulp.task('css', () =>
  gulp.src(cssFiles)
  .pipe(autoprefixer({
    browsers: ['last 40 versions'],
    cascade: false
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(flatten())
  .pipe(concat(`${appName}.css`))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(cssOutput))
)

gulp.task('img', () =>
  gulp.src(imgFiles)
  .pipe(gulp.dest(imgOutput))
)

gulp.task('tpl', () =>
  gulp.src(htmlFiles)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest(htmlOutput))
)

gulp.task('pub-js', () =>
  gulp.src(jsOutFiles)
  .pipe(rev())
  .pipe(uglify())
  .pipe(gulp.dest(jsOutput))
  // .pipe(qn({qiniu: qiniu, prefix: 'web/static/' + appName}))
  // .pipe(rev.manifest())
  // .pipe(rename('js.json'))
  // .pipe(gulp.dest(revOutput))
)

gulp.task('pub-css', () =>
  gulp.src(cssOutFiles)
  .pipe(rev())
  .pipe(cssmin())
  .pipe(gulp.dest(cssOutput))
  // .pipe(qn({qiniu: qiniu, prefix: 'web/static/' + appName}))
  // .pipe(rev.manifest())
  // .pipe(rename('css.json'))
  // .pipe(gulp.dest(revOutput))
)

gulp.task('pub-img', () =>
  gulp.src(imgOutFiles)
  .pipe(rev())
  .pipe(imagemin())
  .pipe(gulp.dest(imgOutput))
  // .pipe(qn({qiniu: qiniu, prefix: 'web/static/' + appName}))
  // .pipe(rev.manifest())
  // .pipe(rename('img.json'))
  // .pipe(gulp.dest(revOutput))
)

gulp.task('replace-js', () =>
  gulp.src([`${revOutput}/img.json`].concat(jsOutFiles))
  .pipe(revCollector({
    dirReplacements: {
      [imgInJs]: ''
    }
  }))
  .pipe(gulp.dest(jsOutput))
)

gulp.task('replace-css', () =>
  gulp.src([`${revOutput}/img.json`].concat(cssOutFiles))
  .pipe(revCollector({
    dirReplacements: {
      [imgInCss]: ''
    }
  }))
  .pipe(gulp.dest(cssOutput))
)

gulp.task('replace-tpl', () =>
  gulp.src([`${revOutput}/*.json`].concat(htmlOutFiles))
  .pipe(revCollector({
    dirReplacements: {
      [jsInHtml]: '',
      [cssInHtml]: '',
      [imgInHtml]: ''
    }
  }))
  .pipe(gulp.dest(htmlOutput))
)

gulp.task('clean', () =>
  gulp.src(publicPath)
  .pipe(clean({
    force: true
  }))
)

gulp.task('default', cb => {
  runSequence('js', 'css', 'tpl', 'img')(cb)
})

gulp.task('watch', () => {
  gulp.watch(watchPath, ['default'])
})

gulp.task('publish', cb => {
  runSequence('pub-img', 'replace-js', 'replace-css', 'pub-js', 'pub-css', 'replace-tpl')(cb)
})

gulp.task('build', cb => {
  runSequence('default', 'pub-img', 'replace-js', 'replace-css', 'pub-js', 'pub-css', 'replace-tpl', 'clean')(cb)
})
