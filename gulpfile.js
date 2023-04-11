const {
  compact, countBy, extend, filter, groupBy, keys,
  map, maxBy, minBy, reduce, some,
} = require('lodash');
const fs = require('fs');
const gh = require('gh-pages');
const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');
const simpleGit = require('simple-git');
const sizeOf = require('image-size');
const slug = require('slug');
const { spawnSync } = require('child_process');
const { promisify } = require('util');
const stringify = promisify(require('csv-stringify'));
const Vibrant = require('node-vibrant');

const $ = loadPlugins({ pattern: ['gulp-*'] });

function removeHttp(str) {
  return str.replace('http://', '').replace('https://', '');
}

function toThumbnailPath(str) {
  const name = slug(removeHttp(str)).toLowerCase();
  return `assets/images/thumbnails/${name}.png`;
}

function getFolders(dir) {
  return fs.readdirSync(dir).filter((childDir) => {
    const fullpath = path.join(dir, childDir);
    return fs.existsSync(fullpath) && fs.statSync(fullpath).isDirectory();
  });
}

async function getFolderCommits(dir, depth = 0) {
  // Maxium depth reached
  if (depth > 3) return [];
  // Foce git locale to English
  process.env.LANG = 'en_GB';
  /* eslint-disable no-console */
  console.log(`Scanning ${dir}...`);
  // Instanciate git instance from the dir path
  const git = simpleGit(dir);
  // Is it a git repository?
  if (await git.checkIsRepo('root')) {
    // All possible author name
    const names = ['pirhoo', 'pierre romera', 'romera', 'hello@pirhoo.com', 'pierre.romera@gmail.com', 'promera@icij.org'];
    // Build an hash with a cksum of the dir
    const { stdout } = spawnSync('sh', ['-c', `echo "${dir}" | cksum`]);
    const repository = stdout.toString().split(' ')[0];
    try {
      // Get all logs with a custom format
      const logs = await git.log({
        format: {
          repository, timestamp: '%ct', hash: '%H', author: '%aN <%ae>',
        },
      });
      // Filter logs by author email
      return filter(logs.all, log => some(names, name => log.author.toLowerCase().indexOf(name) > -1));
    } catch (_) {
      return [];
    }
  }
  let commits = [];
  /* eslint-disable no-await-in-loop,no-restricted-syntax */
  for (const child of getFolders(dir)) {
    const childPath = path.join(dir, child);
    const folderCommits = await getFolderCommits(childPath, depth + 1);
    commits = commits.concat(folderCommits);
  }
  return commits;
}

gulp.task('resize:thumbnails', () => gulp.src('src/assets/images/thumbnails/*.{png,jpg}')
  .pipe($.filter(image => sizeOf(image.path).width > 200))
  .pipe($.imageResize({
    width: 200,
    upscale: true,
  }))
  .pipe(gulp.dest('src/assets/images/thumbnails/')));

gulp.task('resize:investigations', () => gulp.src('src/assets/images/investigations/*.{png,jpg}')
  .pipe($.filter(image => sizeOf(image.path).width > 600))
  .pipe($.imageResize({
    width: 600,
    upscale: true,
  }))
  .pipe(gulp.dest('src/assets/images/investigations/')));

gulp.task('csv:trainings', () => gulp.src(['data/trainings.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => ({
    hoursCount: reduce(data, (sum, training) => (training.duration * 8) + sum, 0),
    countriesCount: keys(countBy(data, 'country')).length,
    customersCount: keys(countBy(data, 'customer')).length,
    categoryCount: countBy(data, 'category'),
    monthsCount: countBy(data, (training) => {
      const date = new Date(Date.parse(training.date_start));
      return `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`;
    }),
    olderTraining: minBy(data, training => Date.parse(training.date_start)),
    newerTraining: maxBy(data, training => Date.parse(training.date_start)),
  })))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:commits', async () => {
  const commits = await getFolderCommits(path.join(__dirname, '..'));
  // eslint-disable-next-line
  console.log('Collected %s commits', commits.length);
  // Create the CSV in a promise
  const csv = await stringify(commits, { header: true, columns: ['repository', 'timestamp', 'hash'] });
  // Write the file!
  fs.writeFileSync(path.resolve('data/commits.csv'), csv);
});

gulp.task('csv:count', () => gulp.src(['data/commits.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor((data) => {
    // Grount commits by month
    let monthsCount = groupBy(data, (commit) => {
      const date = new Date(commit.timestamp * 1000);
      return `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    });
      // Aggregate commits data by month
    monthsCount = reduce(monthsCount, (result, month, key) => ({
      ...result,
      [key]: {
        count: month.length,
        repositories: countBy(month, 'repository'),
      },
    }), {});
    return {
      commitsCount: data.length,
      repositoriesCount: keys(countBy(data, 'repository')).length,
      monthsCount,
      olderCommit: minBy(data, 'timestamp'),
      newerCommit: maxBy(data, 'timestamp'),
    };
  }))
  .pipe(gulp.dest('src/assets/json/')));


gulp.task('csv:projects', () => gulp.src(['data/projects.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => map(data, site => extend(site, {
    thumbnail: site.thumbnail || toThumbnailPath(site.url, true),
  }))))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:investigations', () => gulp.src(['data/investigations.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:awards', () => gulp.src(['data/awards.csv'])
  .pipe($.convert({ from: 'csv', to: 'json' }))
  .pipe($.jsonEditor(data => ({
    awardsCount: data.length,
    countriesCount: keys(countBy(data, 'country')).length,
    projectsCount: keys(countBy(data, 'project')).length,
  })))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv:colors', async () => {
  // eslint-disable-next-line
  const projects = require('./src/assets/json/projects.json');
  // Get color for each projects
  const projectsPromises = await projects.map(async (orginalProject) => {
    const project = { ...orginalProject };
    if ((!project.color || project.color === '') && project.thumbnail) {
      // Extract the palette
      const palette = await Vibrant.from(path.join('src', project.thumbnail)).getPalette();
      const nonNullVibrants = compact([
        palette.Vibrant,
        palette.LightVibrant,
        palette.DarkVibrant,
        palette.Muted,
        palette.LightMuted,
        palette.DarkMuted,
      ]);
      // Take the first non null as main colors
      project.color = nonNullVibrants[0].getHex();
    }
    return project;
  });
  const projectsWithColor = await Promise.all(projectsPromises);
  // Write the JSON back
  const json = JSON.stringify(projectsWithColor, null, 2);
  fs.writeFileSync(path.resolve('./src/assets/json/projects.json'), json);
});

gulp.task('csv:sizes', () => gulp.src(['src/assets/json/projects.json'])
  .pipe($.jsonEditor(data => map(data, site => extend(site, sizeOf(`src/${site.thumbnail}`)))))
  .pipe(gulp.dest('src/assets/json/')));

gulp.task('csv', gulp.series(
  'csv:trainings',
  'csv:commits',
  'csv:count',
  'csv:investigations',
  'csv:projects',
  'csv:awards',
  'csv:sizes',
  'csv:colors',
));

gulp.task('deploy', (cb) => {
  gh.publish(path.join(process.cwd(), 'dist'), cb);
});
