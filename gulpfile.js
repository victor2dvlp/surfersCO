var gulp 			= require('gulp'),
	scss 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify			= require('gulp-uglifyjs'),
	cssnano			= require('gulp-cssnano'),
	rename			= require('gulp-rename'),
	del				= require('del'),
	imagemin		= require('gulp-imagemin'),
	pngquant		= require('imagemin-pngquant'),
	cache 			= require('gulp-cache'),
	autoprefixer	= require('gulp-autoprefixer');

gulp.task('css-libs', ['scss'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});
gulp.task('scss', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(scss())
		.pipe( autoprefixer( ['last 15 versions', '>1%', 'ie 8', 'ie 7'], 
		{cascade: true} ) )
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({ stream: true }) )
} );
gulp.task('browser-sync', function(){
	browserSync( {
		server: {
			baseDir: 'app'
		},
		notify: false
	} );
} );
gulp.task('scripts', function(){
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/bootstrap/dist/js/bootstrap.min.js',
			'app/libs/OwlCarousel2-2.2.1/dist/owl.carousel.min.js'
		]).pipe( concat('libs.min.js') )
		.pipe(uglify())
		.pipe( gulp.dest('app/js') );
});
gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'scripts', 'css-libs'], function(){
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/*html', browserSync.reload);
} );
gulp.task('img', function(){
	return gulp.src( 'app/img/**/*' )
			.pipe( cache( imagemin( {
				interlaced: true,
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				une: [pngquant()]
			})) ).pipe( gulp.dest( 'dist/img' ) );
});
gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('build', ['clean', 'scss', 'scripts', 'img'], function(){
	var buildCss = gulp.src( [
			'app/css/style.css',
			'app/css/libs.min.css',
		] ).pipe( gulp.dest( 'dist/css' ) );
	var buildFonts = gulp.src('app/fonts/**/*').pipe( gulp.dest( 'dist/fonts' ) );
	var buildJs = gulp.src('app/js/**/*').pipe( gulp.dest('dist/js') );
	var buildHtml = gulp.src('app/*.html').pipe( gulp.dest('dist') );
});
