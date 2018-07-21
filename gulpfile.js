const gulp = require('gulp');
const sizeOf = require('image-size');
const slug = require('slug');
const async = require('async');
const fs = require('fs');
const webshot = require('webshot');
const through = require('through2');
const gh = require('gh-pages');
const path = require('path');
const _ = require('lodash');
const loadPlugins = require('gulp-load-plugins');

const { paths } = gulp;

const $ = loadPlugins({ pattern: ['gulp-*'] });

function removeHttp(str) {
  return str.replace('http://', '').replace('https://', '');
}

function toThumbnailPath(str) {
  const name = slug(removeHttp(str)).toLowerCase();
  return `assets/images/thumbnails/${name}.png`;
}

gulp.task('resize', () => gulp.src(`${paths.src}/assets/images/thumbnails/*.{png,jpg}`)
  .pipe($.filter(image => sizeOf(image.path).width !== 200))
  .pipe($.imageResize({
    width: 200,
    upscale: true,
  }))
  .pipe(gulp.dest(`${paths.src}/assets/images/thumbnails/`)));

gulp.task('csv:trainings', () => gulp.src(['src/assets/csv/trainings.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => ({
    hoursCount: _.reduce(data, (sum, training) => sum + (training.duration * 8, 0)),
    countriesCount: _.keys(_.countBy(data, 'country')).length,
    customersCount: _.keys(_.countBy(data, 'customer')).length,
    categoryCount: _.countBy(data, 'category'),
    monthsCount: _.countBy(data, (training) => {
      const date = new Date(Date.parse(training.date_start));
      return `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`;
    }),
    olderTraining: _.minBy(data, training => Date.parse(training.date_start)),
    newerTraining: _.maxBy(data, training => Date.parse(training.date_start)),
  })))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:commits', () => gulp.src(['src/assets/csv/commits.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor((data) => {
    // Grount commits by month
    let monthsCount = _.groupBy(data, (commit) => {
      const date = new Date(commit.timestamp * 1000);
      return `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    });
      // Aggregate commits data by month
    monthsCount = _.reduce(monthsCount, (result, month, key) => ({
      ...result,
      [key]: {
        count: month.length,
        repositories: _.countBy(month, 'repository'),
      },
    }), {});
    return {
      commitsCount: data.length,
      repositoriesCount: _.keys(_.countBy(data, 'repository')).length,
      monthsCount,
      olderCommit: _.min(data, 'timestamp'),
      newerCommit: _.max(data, 'timestamp'),
    };
  }))
  .pipe(gulp.dest('src/assets/json/')));


gulp.task('csv:projects', () => gulp.src(['src/assets/csv/projects.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => _.map(data, site => _.extend(site, {
    thumbnail: site.thumbnail || toThumbnailPath(site.url, true),
  }))))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:awards', () => gulp.src(['src/assets/csv/awards.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => ({
    awardsCount: data.length,
    countriesCount: _.keys(_.countBy(data, 'country')).length,
    projectsCount: _.keys(_.countBy(data, 'project')).length,
  })))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:webshots', () => gulp.src(['src/assets/csv/projects.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe(through.obj((file, enc, cb) => {
    let data = JSON.parse(file.contents);
    // Filter data to only have the website with no screenshot yet
    data = _.filter(data, (site) => {
      const thumbnailPath = `src/${toThumbnailPath(site.url)}`;
      return site.thumbnail === '' && !fs.existsSync(thumbnailPath);
    });
    // Async function to iterate over websites
    async.eachSeries(data, (site, next) => {
      // Inform the user
      $.util.log('Screenshoting %s', site.url);
      // Start the screenshot
      webshot(removeHttp(site.url), `src/${toThumbnailPath(site.url)}`, {
        // We are not in hurry
        renderDelay: 6000,
        // We need a bigger screen
        windowSize: {
          width: site.width || 1600,
          height: site.height || 900,
        },
      }, next);
    }, cb);
  })));

gulp.task('csv:sizes', () => gulp.src(['src/assets/json/projects.json'])
  .pipe($.jsonEditor(data => _.map(data, site => _.extend(site, sizeOf(`src/${site.thumbnail}`)))))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv', gulp.series(
  'csv:trainings',
  'csv:commits',
  'csv:projects',
  'csv:awards',
  'csv:webshots',
  'csv:sizes',
));

gulp.task('deploy', (cb) => {
  gh.publish(path.join(process.cwd(), 'dist'), cb);
});
