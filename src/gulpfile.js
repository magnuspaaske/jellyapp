/**
 * Gulp is used to compile files for the browser continually throughout the development
 * process as well as to make a final build that's suitable for distribution
 */

const fs        = require('fs')
const _         = require('lodash')
const yaml      = require('js-yaml')

const gulp      = require('gulp')
const coffee    = require('gulp-coffee')
const sass      = require('gulp-sass')
const pug       = require('gulp-pug')
const concat    = require('gulp-concat')

const cleanCss      = require('gulp-clean-css')
const uglify        = require('gulp-uglify')
const rename        = require('gulp-rename')
const clean         = require('gulp-clean')
const replace       = require('gulp-replace')
const modifyFile    = require('gulp-modify-file')

const grunt     = require('grunt')


// Load environment if needed
if (process.env.NODE_ENV === 'development' && fs.existsSync('.env')) {
    require('dotenv').config({
        path: '.env'
    })
} else if (process.env.NODE_ENV) {
    if (fs.existsSync(`.env.${process.env.NODE_ENV}`)) {
        require('dotenv').config({
            path: `.env.${process.env.NODE_ENV}`
        })
    }
}


const cssPipeline = require('./grunt/pipeline').cssFilesToInject.map(path => {
    return 'tmp/styles/' + path
})
const jsPipeline = require('./grunt/pipeline').jsFilesToInject.map(path => {
    return 'tmp/scripts/' + path
})


// SASS
gulp.task('sass', () => {
    return gulp
        .src([
            'client/styles/**/*.sass',
            'client/styles/**/*.scss',
        ])
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true,
            sourcemap: 'none',
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/styles'))
})

gulp.task('css-clean', () => {
    return gulp.src('public/styles/')
        .pipe(clean())
})

// SASS prod
gulp.task('sass-prod', () => {
    return gulp
        .src([
            'client/styles/**/*.sass',
            'client/styles/**/*.scss',
        ])
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true,
            sourcemap: 'none',
        }))
        .pipe(gulp.dest('./tmp/styles'))
})


// CSS copy
gulp.task('css-copy', () => {
    return gulp.src('client/styles/**/*.css')
        .pipe(gulp.dest('public/styles'))
})

// CSS copy for production
gulp.task('css-copy-prod', () => {
    return gulp.src('client/styles/**/*.css')
        .pipe(gulp.dest('tmp/styles'))
})



// Assets copy
gulp.task('assets-copy', () => {
    return gulp.src('client/assets/**/*.*')
        .pipe(gulp.dest('public/assets/'))
})

gulp.task('assets-copy-prod', () => {
    return gulp
        .src('client/assets/**/*.*')
        .pipe(gulp.dest('tmp/copies/assets/'))
})


// Blog hbs copy
gulp.task('hbs-copy', () => {
    return gulp.src('client/blog_pug/**/*.hbs')
        .pipe(gulp.dest('blog_theme/'))
})


// Copy root files (that is, files that should be available from domain root)
gulp.task('root-copy', () => {
    return gulp
        .src([
            'client/root_files/**/*.*',
            'client/root_files/*.*',
            'client/root_files/*',
        ])
        .pipe(gulp.dest('public/'))
})



// Coffeescript compile
gulp.task('coffee', function () {
    return gulp.src('./client/scripts/**/*.coffee')
        .pipe(coffee({
            bare: false
        }))
        .on('error', function (err) {
            console.log('')
            console.log(err.toString())
            this.emit('end')
        })
        .pipe(gulp.dest('public/scripts/'))
})

gulp.task('js-clean', () => {
    return gulp.src('public/scripts/')
        .pipe(clean())
})

gulp.task('coffee-prod', () => {
    return gulp.src('./client/scripts/**/*.coffee')
        .pipe(coffee({
            bare: true
        }))
        .pipe(gulp.dest('tmp/scripts/'))
})


// Javascript copy
gulp.task('js-copy', () => {
    return gulp.src('./client/scripts/**/*.js')
        .pipe(gulp.dest('public/scripts'))
})

// Javascript copy
gulp.task('js-copy-prod', () => {
    return gulp.src('./client/scripts/**/*.js')
        .pipe(gulp.dest('tmp/scripts'))
})

// Pug dynamic
gulp.task('pug-tmps', () => {
    return gulp
        .src('./client/scripts/templates/*.pug')
        .pipe(pug({
            pretty: false,
            client: true,
            compileDebug: false,
            inlineRuntimeFunctions: false,
        }))
        .pipe(modifyFile((content, path, file) => {
            let filename
            filename = path.replace('/client/scripts/templates/', '')
            filename = filename.replace('.js', '')
            return `this["pug"]["${filename}"] = ${content}`
        }))
        .pipe(gulp.dest('public/scripts/templates/'))
})

// Pug dynamic production
gulp.task('pug-tmps-prod', () => {
    return gulp.src('./client/scripts/templates/*.pug')
        .pipe(pug({
            pretty: false,
            client: true,
            compileDebug: false,
            inlineRuntimeFunctions: false,
        }))
        .pipe(modifyFile((content, path, file) => {
            let filename
            filename = path.replace('/client/scripts/templates/', '')
            filename = filename.replace('.js', '')
            return `this["pug"]["${filename}"] = ${content}`
        }))
        .pipe(gulp.dest('tmp/scripts/templates/'))
})



// Load data
const loadData = () => {
    const data = {}
    try {
        const yamlData = yaml.safeLoad(fs.readFileSync('./client/data.yaml', {
            encoding: 'utf-8'
        }))
        Object.assign(data, yamlData)
    } catch (e) {
        console.log('Could not fetch data from ./client/data.yaml')
    }
    return data
}


// Pug static
gulp.task('pug-static', () => {
    return gulp.src('client/static_pug/**/*.pug')
        .pipe(pug({
            pretty: false,
            client: false,
            locals: loadData(),
        }))
        .pipe(gulp.dest('public/'))
})
gulp.task('pug-prod', () => {
    return gulp.src('client/static_pug/**/*.pug')
        .pipe(pug({
            pretty: false,
            client: false,
            locals: loadData(),
        }))
        .pipe(gulp.dest('tmp/'))
})


// Pug Blog
gulp.task('pug-blog', () => {
    return gulp.src('client/blog_pug/**/*.pug')
        .pipe(pug({
            pretty: false,
            client: false,
            locals: loadData(),
        }))
        .pipe(rename({
            extname: '.hbs'
        }))
        .pipe(gulp.dest('blog_theme/'))
})

gulp.task('pug-blog-prod', () => {
    return gulp.src('client/blog_pug/**/*.pug')
        .pipe(pug({
            pretty: false,
            client: false,
            locals: loadData(),
        }))
        .pipe(rename({
            extname: '.hbs'
        }))
        .pipe(gulp.dest('tmp/'))
})


// Replace file paths pug production
gulp.task('pug-link-images', () => {
    const hashes = JSON.parse(fs.readFileSync('./tmp/assets-hashes.json', {
        encoding: 'utf-8',
    }))

    let gulpObj = gulp.src('tmp/**/*.html')

    _(hashes).each((val, key) => {
        gulpObj = gulpObj.pipe(replace(key, `${(process.env.CACHE_HOST || '')}${val}`))
    })

    return gulpObj.pipe(gulp.dest('public/'))
})


// Replace file paths blog production
gulp.task('pug-blog-link-assets', () => {
    const hashes = JSON.parse(fs.readFileSync('./tmp/assets-hashes.json'), {
        encoding: 'utf-8',
    })

    let gulpObj = gulp.src('tmp/**/*.hbs')

    _(hashes).each((val, key) => {
        gulpObj = gulpObj.pipe(replace(key, `${process.env.CACHE_HOST || ''}${val}`))
    })

    return gulpObj
        .pipe(replace('<link rel="stylesheet" href="/styles', '<link rel="stylesheet" href="/assets/styles'))
        .pipe(replace('<script type="text/javascript" src="/scripts', '<script type="text/javascript" src="/assets/scripts'))
        .pipe(gulp.dest('blog_theme'))
})


// Copy assets from public to blog
gulp.task('pug-blog-copy-assets', () => {
    return gulp
        .src([
            './public/assets/**/*.*',
            './public/scripts.min-*.js',
            './public/styles.min-*.css',
        ])
        .pipe(gulp.dest('./blog_theme/assets'))
})

// Concat
gulp.task('concat-css', () => {
    return gulp.src(cssPipeline)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./tmp/'))
})

gulp.task('concat-js', () => {
    return gulp.src(jsPipeline)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./tmp/'))
})



// Minify/uglify
gulp.task('minify-css', () => {
    return gulp.src('tmp/styles.css')
        .pipe(cleanCss({
            compatibility: 'ie8'
        }))
        .pipe(rename((path) => {
            path.basename += '.min'
        }))
        .pipe(gulp.dest('tmp/'))
})

gulp.task('minify-js', () => {
    return gulp.src('tmp/scripts.js')
        .pipe(uglify({

        }))
        .pipe(rename((path) => {
            path.basename += '.min'
        }))
        .pipe(gulp.dest('tmp/'))
})


// Function to quickly deal with copying npm dependencies
const copyNpm = (location, type, prod, filename) => {
    let dest = ''
    // Check for prod
    if (prod) {
        dest = 'tmp/'
    } else {
        dest = 'public/'
    }
    if (type === 'js') {
        dest += 'scripts/dependencies'
    } else if (type === 'css') {
        dest += 'styles/dependencies'
    }

    if (filename) {
        return gulp.src(`${process.cwd()}/node_modules/` + location.replace(/^\//, ''))
            .pipe(rename((path) => {
                path.basename = filename
            }))
            .pipe(gulp.dest(dest))
    } else {
        return gulp.src(`${process.cwd()}/node_modules/` + location.replace(/^\//, ''))
            .pipe(gulp.dest(dest))
    }

}

// Copy over dependencies for development
gulp.task('copy-npm-dependencies', gulp.parallel(
    // Add jquery
    () => copyNpm('jquery/dist/jquery.js', 'js'),
    // Add lodash
    () => copyNpm('lodash/lodash.js', 'js'),
    // Add chart.js
    () => copyNpm('chart.js/dist/Chart.js', 'js'),
    () => copyNpm('chart.js/dist/Chart.css', 'css'),
    // Add moment
    () => copyNpm('moment/moment.js', 'js'),
))


// Copy over dependencies for production
gulp.task('copy-npm-dependencies-prod', gulp.parallel(
    // Add jquery
    () => copyNpm('jquery/dist/jquery.js', 'js', true),
    // Add lodash
    () => copyNpm('lodash/lodash.js', 'js', true),
    // Add chart.js
    () => copyNpm('chart.js/dist/Chart.js', 'js'),
    () => copyNpm('chart.js/dist/Chart.css', 'css'),
    // Add moment
    () => copyNpm('moment/moment.js', 'js'),
))


// Grunt tasks
const gruntTasks = [
    'grunt-sails-linker:devCss',
    'grunt-sails-linker:devJs',
    'grunt-bushcaster:assets',
    'grunt-bushcaster:prodJs',
    'grunt-bushcaster:prodCss',
    'grunt-sails-linker:prodCss',
    'grunt-sails-linker:prodJs',
]

gruntTasks.map((task) => {
    gulp.task(task, (cb) => {
        return grunt.tasks([
            // Get the right name for the task
            task.replace('grunt-', '')
        ], {
            gruntfile: 'Gruntfile.js'
        }, () => {
            cb()
        })
    })
})




// Watch changes
gulp.task('default', gulp.series(
    gulp.parallel(
        'sass',
        'css-copy',
        'coffee',
        'js-copy',
        'assets-copy',
        'root-copy',
        // 'hbs-copy',
        'copy-npm-dependencies',
        'pug-tmps',
    ),
    gulp.series(
        // Linking sheets and styles
        // 'pug-blog-copy-assets',
        'grunt-sails-linker:devCss',
        'grunt-sails-linker:devJs',
    ),
    // gulp.parallel(
    //     'pug-blog',
    //     // 'pug-static',
    // ),
    () => {
        // Watching SASS (including relinking sheets if needed)
        const sassWatch = gulp.watch([
            'client/styles/**/*.sass',
            'client/styles/**/*.scss',
            'client/styles/**/*.css',
        ])
        sassWatch.on('change', gulp.parallel(
            'sass',
            'css-copy',
        ))
        sassWatch.on('unlink', gulp.series(
            gulp.parallel('css-clean'),
            gulp.parallel(
                'sass',
                'css-copy',
            ),
            gulp.parallel('grunt-sails-linker:devCss'),
            // gulp.parallel('pug-static'),
        ))
        sassWatch.on('add', gulp.series(
            gulp.parallel(
                'css-copy',
                'sass',
            ),
            gulp.parallel('grunt-sails-linker:devCss'),
            // gulp.parallel('pug-static'),
        ))

        const jsWatch = gulp.watch([
            'client/scripts/**/*.coffee',
            'client/scripts/**/*.js',
        ])
        jsWatch.on('change', gulp.parallel(
            'coffee',
            'js-copy',
        ))
        jsWatch.on('unlink', gulp.series(
            gulp.parallel('js-clean'),
            gulp.parallel(
                'coffee',
                'js-copy',
            ),
            gulp.parallel('grunt-sails-linker:devJs'),
            // gulp.parallel('pug-static'),
        ))
        jsWatch.on('add', gulp.series(
            gulp.parallel(
                'coffee',
                'js-copy',
            ),
            gulp.parallel('grunt-sails-linker:devJs'),
            // gulp.parallel('pug-static'),
        ))

        // gulp.watch('client/data.yaml', gulp.series(
        //     'pug-static',
        // ))

        // gulp.watch('client/**/*.pug', gulp.series(
        //     // 'pug-static',
        //     'pug-tmps',
        //     'pug-blog',
        // ))

        gulp.watch([
            'client/assets/*',
            'client/assets/**/*',
        ], gulp.series(
            'assets-copy',
            // 'pug-blog-copy-assets',
        ))
    }
))


// Build tasks
gulp.task('build-css', gulp.series(
    gulp.parallel(
        'sass-prod',
        'css-copy-prod',
    ),
))

gulp.task('build-js', gulp.series(
    gulp.parallel(
        'coffee-prod',
        'js-copy-prod',
    ),
))

// Build task
gulp.task('build', gulp.series(
    gulp.parallel(
        // Compile all js, css, copy over assets
        'build-css',
        'build-js',
        'pug-tmps-prod',
        'root-copy',
        'assets-copy-prod',
        // 'hbs-copy',
        'copy-npm-dependencies-prod',
    ),
    gulp.parallel(
        'concat-js',
        'concat-css',
    ),
    gulp.parallel(
        'grunt-bushcaster:assets',
    ),
    gulp.parallel(
        // Minify css + js
        'minify-css',
        'minify-js',
    ),
    gulp.series(
        // Link cache busted assets to css/js
        'grunt-bushcaster:prodJs',
        'grunt-bushcaster:prodCss',
    ),
    gulp.series(
        // Link assets to layout layout files
        'grunt-sails-linker:prodCss',
        'grunt-sails-linker:prodJs',
    ),
    // gulp.parallel(
    //     // Build pug
    //     'pug-prod',
    //     // 'pug-blog-prod',
    //     // 'pug-blog-copy-assets',
    // ),
    gulp.series(
        'pug-link-images',
        'pug-blog-link-assets',
    )
))
