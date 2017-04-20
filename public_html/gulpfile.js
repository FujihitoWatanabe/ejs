//gulpfile.js

/*-------------------- インストールコマンド --------------------- */
//グローバル
    // npm i -g gulp
//以下はプロジェクトフォルダで入力
    // npm i -D gulp
    // npm i -D gulp-autoprefixer
    // npm i -D gulp-minify-css
    // npm i -D gulp-uglify
    // npm i -D gulp gulp-sass gulp-postcss postcss-cssnext
    // npm i -D browser-sync
    // npm i -D gulp-ejs
    // npm i -D gulp-rename
    // npm i -D gulp-minify-ejs
/*-------------------- /インストールコマンド -------------------- */

/*-------------------- plug-in -------------------------------- */
var gulp = require("gulp");
//var autoprefixer = require("gulp-autoprefixer");
var minifycss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var sass = require('gulp-sass');
var postcss = require("gulp-postcss");
var cssnext = require("postcss-cssnext");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var ejs = require("gulp-ejs");
var minifyejs = require("gulp-minify-ejs")
var rename = require("gulp-rename");
/*-------------------- plug-in --------------------------------- */

/*-------------------- タスク ---------------------------------- */
//ベンダープレフィックス
/*
gulp.task("autoprefixer", function () {
    return gulp.src("*.css")
    .pipe(autoprefixer({
        //IEは9以上、Androidは4以上、iOS Safariは8以上
        //その他は最新2バージョンで必要なベンダープレフィックスを付与する
        browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
        cascade: false
}))
.pipe(gulp.dest("dest/css/"));
});
*/

//scssをコンパイル(圧縮、ベンダープレフィックス)
var paths = {
    "scss": "src/scss/", //作業するscssのフォルダ
    "css": "dest/css/"  //コンパイルして保存するcssのフォルダ
}
gulp.task('scss', function() {
  var processors = [
     //cssnext()
     cssnext({browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"]}) //ブラウザ/os バージョン
 ];
  return gulp.src(paths.scss + "**/*.scss")
    .pipe(postcss(processors))
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(gulp.dest(paths.css))
});

//CSS圧縮
/*
gulp.task("minify-css", function() {
    return gulp.src("*.css")
    .pipe(minifycss())
    .pipe(gulp.dest("dest/css/"))
});
*/

//JS圧縮
gulp.task("uglify", function() {
    return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dest/js/"))
});

//EJS(テンプレートエンジン)
gulp.task("ejs", function() {
    gulp.src(
       ["src/ejs/*.ejs","src/ejs/**/*.ejs",'!' + "src/ejs/**/_*.ejs"] //参照するディレクトリ、参照を除外するファイル(テンプレート)
    )
    .pipe(minifyejs())　//圧縮
    .pipe(rename({extname: ".html"})) //拡張子をhtmlに
    .pipe(gulp.dest("dest/")) //出力先
});

/*-------------------- /タスク ------------------------------- */

/*-------------------- リアルタイム監視------------------------ */
gulp.task("watch", function() {
    //gulp.watch(".*css", ["minify-css"]);
    //gulp.watch(".*css", ["autoprefixer"]);
    gulp.watch("src/scss/*.scss", ["scss"]);
    gulp.watch("src/js/*.js", ["uglify"]);
    gulp.watch("src/ejs/*.ejs", ["ejs"]);
    gulp.watch("src/ejs/**/*.ejs", ["ejs"]);
    browserSync.init({
        files: ["src/scss/","src/js/","src/ejs/"],
        proxy: "http://localhost/~ejs-dev",
        //open: "external"
    });
});
/*-------------------- /リアルタイム監視 ---------------------- */