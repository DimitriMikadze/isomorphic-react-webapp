var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var path = require('path');
var webpack = require('gulp-webpack');

gulp.task('sass', function () {
    gulp.src('./src/client/sass/bundle.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/client/sass/**/*.scss', ['sass']);
});

gulp.task('scripts', function() {
    gulp.src('./src/client/client.js')
        .pipe(webpack({
            watch: true,
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        include: [
                            path.resolve(__dirname, "src/client"),
                            path.resolve(__dirname, "src/utils"),
                            path.resolve(__dirname, "src/shared")
                        ],
                        loader: 'babel',
                        query: {
                            presets: ['es2015', 'react']
                        }
                    }
                ]
            },
            output: {
                filename: 'bundle.js'
            }
        }))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('compress', function() {
    gulp.src('./dist/js/bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', ['scripts', 'sass:watch']);