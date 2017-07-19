/*jslint node:true*/

'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
const {phpMinify} = require('@cedx/gulp-php-minify');

gulp.task('workflow', function () {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
    
        .pipe(gulp.dest('./dist/css/'));
    return;
});

gulp.task('default', function () {
	gulp.watch('./src/sass/**/*.scss', ['workflow']);
    return;
});

gulp.task('minify', ['minify-portfolio', 'minify-blog', 'minify-html-in-php', 'minify-php'], function () {
    return gulp.src('./*.html')
	.pipe(replace('dist/css', 'css'))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-portfolio', function () {
    return gulp.src('portfolio/*.html')
	.pipe(replace('dist/css', 'css'))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('dist/portfolio'));
});

gulp.task('minify-blog', function () {
    return gulp.src('blog/*.html')
	.pipe(replace('dist/css', 'css'))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('dist/blog'));
});

gulp.task('minify-html-in-php', function () {
    return gulp.src('./*php')
	.pipe(replace('dist/css', 'css'))
	.pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-php', () => gulp.src('./*.php', {read: false})
  .pipe(phpMinify())
  .pipe(gulp.dest('dist'))
);

gulp.task('compress', ['compress-logo','compress-portfolio','compress-research','compress-tools']);

gulp.task('compress-logo', () =>
	gulp.src('images/logo/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/logo'))
);

gulp.task('compress-portfolio', () =>
	gulp.src('images/portfolio/toss180/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/portfolio/toss180'))
);

gulp.task('compress-research', () =>
	gulp.src('images/research/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/research'))
);

gulp.task('compress-tools', () =>
	gulp.src('images/tools/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/tools'))
);

gulp.task('publish', ['workflow','compress','minify']);
