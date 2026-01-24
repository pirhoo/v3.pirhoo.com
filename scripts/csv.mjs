#!/usr/bin/env node
/* eslint-disable no-console */
import { $, fs, path } from 'zx'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import simpleGit from 'simple-git'
import { Vibrant } from 'node-vibrant/node'
import { imageSize as sizeOf } from 'image-size'
import slug from 'slug'
import {
  compact, countBy, filter, groupBy, keys,
  map, maxBy, minBy, reduce, some
} from 'lodash-es'

$.verbose = false
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const rootDir = path.resolve(__dirname, '..')

function removeHttp(str) {
  return str.replace('http://', '').replace('https://', '')
}

function toThumbnailPath(str) {
  const name = slug(removeHttp(str)).toLowerCase()
  return `assets/images/thumbnails/${name}.png`
}

function getFolders(dir) {
  try {
    return fs.readdirSync(dir).filter(childDir => {
      const fullpath = path.join(dir, childDir)
      return fs.existsSync(fullpath) && fs.statSync(fullpath).isDirectory()
    })
  } catch {
    return []
  }
}

async function getFolderCommits(dir, depth = 0) {
  if (depth > 3) return []
  process.env.LANG = 'en_GB'
  console.log(`Scanning ${dir}...`)
  const git = simpleGit(dir)

  if (await git.checkIsRepo('root')) {
    const names = ['pirhoo', 'pierre romera', 'romera', 'hello@pirhoo.com', 'pierre.romera@gmail.com', 'promera@icij.org']
    const { stdout } = await $`echo "${dir}" | cksum`
    const repository = stdout.toString().split(' ')[0]

    try {
      const logs = await git.log({
        format: {
          repository,
          timestamp: '%ad',
          hash: '%H',
          author: '%aN <%ae>'
        },
        '--date': 'unix'
      })
      return filter(logs.all, log => {
        const timestamp = parseInt(log.timestamp, 10)
        const after2011 = new Date(timestamp * 1000) > new Date(2011, 0, 1)
        const byPirhoo = some(names, name => log.author.toLowerCase().indexOf(name) > -1)
        return after2011 && byPirhoo
      }).map(log => ({
        repository: log.repository,
        timestamp: parseInt(log.timestamp, 10),
        hash: log.hash
      }))
    } catch {
      return []
    }
  }

  let commits = []
  for (const child of getFolders(dir)) {
    const childPath = path.join(dir, child)
    const folderCommits = await getFolderCommits(childPath, depth + 1)
    commits = commits.concat(folderCommits)
  }
  return commits
}

async function processTrainings() {
  console.log('Processing trainings...')
  const csvPath = path.join(rootDir, 'data/trainings.csv')
  const data = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true })

  const result = {
    hoursCount: reduce(data, (sum, training) => (parseInt(training.duration, 10) * 8) + sum, 0),
    countriesCount: keys(countBy(data, 'country')).length,
    customersCount: keys(countBy(data, 'customer')).length,
    categoryCount: countBy(data, 'category'),
    monthsCount: countBy(data, training => {
      const date = new Date(Date.parse(training.date_start))
      return `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-01`
    }),
    olderTraining: minBy(data, training => Date.parse(training.date_start)),
    newerTraining: maxBy(data, training => Date.parse(training.date_start))
  }

  fs.writeFileSync(
    path.join(rootDir, 'src/assets/json/trainings.json'),
    JSON.stringify(result, null, 2)
  )
}

async function collectCommits() {
  console.log('Collecting commits...')
  const parentDir = path.resolve(rootDir, '..')
  const commits = await getFolderCommits(parentDir)
  console.log(`Collected ${commits.length} commits`)

  const csv = stringify(commits, { header: true, columns: ['repository', 'timestamp', 'hash'] })
  fs.writeFileSync(path.join(rootDir, 'data/commits.csv'), csv)
}

async function countCommits() {
  console.log('Counting commits...')
  const csvPath = path.join(rootDir, 'data/commits.csv')
  const data = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true })

  let monthsCount = groupBy(data, commit => {
    const date = new Date(parseInt(commit.timestamp, 10) * 1000)
    return `${date.getFullYear()}-${date.getMonth() + 1}-01`
  })

  monthsCount = reduce(monthsCount, (result, month, key) => ({
    ...result,
    [key]: {
      count: month.length,
      repositories: countBy(month, 'repository')
    }
  }), {})

  const result = {
    commitsCount: data.length,
    repositoriesCount: keys(countBy(data, 'repository')).length,
    monthsCount,
    olderCommit: minBy(data, c => parseInt(c.timestamp, 10)),
    newerCommit: maxBy(data, c => parseInt(c.timestamp, 10))
  }

  fs.writeFileSync(
    path.join(rootDir, 'src/assets/json/commits.json'),
    JSON.stringify(result, null, 2)
  )
}

async function processInvestigations() {
  console.log('Processing investigations...')
  const csvPath = path.join(rootDir, 'data/investigations.csv')
  const data = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true })

  fs.writeFileSync(
    path.join(rootDir, 'src/assets/json/investigations.json'),
    JSON.stringify(data, null, 2)
  )
}

async function processProjects() {
  console.log('Processing projects...')
  const csvPath = path.join(rootDir, 'data/projects.csv')
  const data = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true })

  const projects = map(data, site => ({
    ...site,
    thumbnail: site.thumbnail || toThumbnailPath(site.url)
  }))

  fs.writeFileSync(
    path.join(rootDir, 'src/assets/json/projects.json'),
    JSON.stringify(projects, null, 2)
  )
}

async function processAwards() {
  console.log('Processing awards...')
  const csvPath = path.join(rootDir, 'data/awards.csv')
  const data = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true })

  const result = {
    awardsCount: data.length,
    countriesCount: keys(countBy(data, 'country')).length,
    projectsCount: keys(countBy(data, 'project')).length
  }

  fs.writeFileSync(
    path.join(rootDir, 'src/assets/json/awards.json'),
    JSON.stringify(result, null, 2)
  )
}

async function processSizes() {
  console.log('Processing image sizes...')
  const jsonPath = path.join(rootDir, 'src/assets/json/projects.json')
  const projects = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const projectsWithSizes = map(projects, site => {
    const imagePath = path.join(rootDir, 'src', site.thumbnail)
    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath)
      const dimensions = sizeOf(buffer)
      return { ...site, width: dimensions.width, height: dimensions.height }
    }
    return site
  })

  fs.writeFileSync(jsonPath, JSON.stringify(projectsWithSizes, null, 2))
}

async function processColors() {
  console.log('Processing colors...')
  const jsonPath = path.join(rootDir, 'src/assets/json/projects.json')
  const projects = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const projectsWithColors = await Promise.all(
    projects.map(async project => {
      if ((!project.color || project.color === '') && project.thumbnail) {
        const imagePath = path.join(rootDir, 'src', project.thumbnail)
        if (fs.existsSync(imagePath)) {
          try {
            const palette = await Vibrant.from(imagePath).getPalette()
            const nonNullVibrants = compact([
              palette.Vibrant,
              palette.LightVibrant,
              palette.DarkVibrant,
              palette.Muted,
              palette.LightMuted,
              palette.DarkMuted
            ])
            if (nonNullVibrants.length > 0) {
              return { ...project, color: nonNullVibrants[0].hex }
            }
          } catch (e) {
            console.log(`  Error extracting color for ${project.thumbnail}: ${e.message}`)
          }
        }
      }
      return project
    })
  )

  fs.writeFileSync(jsonPath, JSON.stringify(projectsWithColors, null, 2))
}

async function main() {
  console.log('Starting CSV processing pipeline...\n')

  await processTrainings()
  await collectCommits()
  await countCommits()
  await processInvestigations()
  await processProjects()
  await processAwards()
  await processSizes()
  await processColors()

  console.log('\nDone!')
}

main().catch(console.error)
