import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  mkdirSync,
  copyFileSync,
  readdirSync,
  rmSync,
  readFileSync,
  writeFileSync
} from 'node:fs'

const wd = dirname(fileURLToPath(import.meta.url))
const dest = join(wd, 'npm')

function clearDir (path) {
  let files
  try {
    files = readdirSync(path, { encoding: 'utf8', withFileTypes: true })
  } catch (_) {
    return null
  }
  for (const dirent of files) {
    if (dirent.isDirectory()) rmSync(join(path, dirent.name), { force: true, recursive: true })
    else rmSync(join(path, dirent.name), { force: true })
  }
}

async function createJson () {
  const text = readFileSync(join(wd, 'package.json'), { encoding: 'utf8' })
  const json = JSON.parse(text)
  delete json.scripts
  delete json.devDependencies
  delete json.private
  json.main = json.main.replace('dist/', '')
  json.types = json.main.replace('dist/', '')
  json.exports['.']['import'] = json.main.replace('dist/', '')
  json.exports['.']['types'] = json.main.replace('dist/', '')
  writeFileSync(
    join(dest, 'package.json'),
    JSON.stringify(json, null, 2),
    { encoding: 'utf8' }
  )
}

void function () {
  clearDir(dest)
  mkdirSync(dest, { recursive: true })
  copyFileSync(join(wd, 'LICENSE.md'), join(dest, 'LICENSE.md'))
  copyFileSync(join(wd, 'README.md'), join(dest, 'README.md'))
  createJson()
}()
