const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const gh = require('gh-pages');
const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');
const simpleGit = require('simple-git/promise');
const sizeOf = require('image-size');
const slug = require('slug');
const through = require('through2');
const webshot = require('webshot');
const { spawnSync } = require('child_process');
const { promisify } = require('util');
const stringify = promisify(require('csv-stringify'));

const { paths } = gulp;

const $ = loadPlugins({ pattern: ['gulp-*'] });

function removeHttp(str) {
  return str.replace('http://', '').replace('https://', '');
}

function toThumbnailPath(str) {
  const name = slug(removeHttp(str)).toLowerCase();
  return `assets/images/thumbnails/${name}.png`;
}

function getFolders(dir) {
  // return ['xemx']
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isDirectory());
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
    hoursCount: _.reduce(data, (sum, training) => (training.duration * 8) + sum, 0),
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

gulp.task('csv:commits', async () => {
  const names = ['pirhoo', 'pierre romera', 'romera', 'hello@pirhoo.com', 'pierre.romera@gmail.com'];
  let commits = [];
  for (const dir of getFolders('..')) {
    // Instanciate git instance from the dir path
    const git = simpleGit(path.join('..', dir));
    // Is it a git repository?
    if (await git.checkIsRepo()) {
      // Build an hash with a cksum of the dir
      const { stdout } = spawnSync('sh', ['-c', `echo ${dir} | cksum`]);
      const repository = stdout.toString().split(' ')[0];
      // Get all logs with a custom format
      const logs = await git.log({
        format: {
          repository, timestamp: '%ct', hash: '%H', author: '%aN <%ae>',
        },
      });
      // Filter logs by author email
      commits = commits.concat(_.filter(logs.all, log => _.some(names, name => log.author.toLowerCase().indexOf(name) > -1)));
    }
  }
  // Create the CSV in a promise
  const csv = await stringify(commits, { header: true, columns: ['repository', 'timestamp', 'hash'] });
  // Write the file!
  fs.writeFileSync(path.resolve('src/assets/csv/commits.csv'), csv);
});

gulp.task('csv:count', () => gulp.src(['src/assets/csv/commits.csv'])
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
      olderCommit: _.minBy(data, 'timestamp'),
      newerCommit: _.maxBy(data, 'timestamp'),
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
  'csv:count',
  'csv:projects',
  'csv:awards',
  'csv:webshots',
  'csv:sizes',
));

gulp.task('deploy', (cb) => {
  gh.publish(path.join(process.cwd(), 'dist'), cb);
});
