import fs from 'fs-extra'
import path from 'path'

const rootPath = path.resolve(__dirname, '..', '..')

/**
 * Clean (delete) unnecessary things in project root
 */
async function cleanRoot() {
  const contents = await fs.readdir(rootPath)
  contents
    .filter(content => {
      return ![
        'package.json',
        'yarn.lock',
        'packages',
        'LICENSE',
        'node_modules',
      ].includes(content)
    })
    .map(content => {
      return path.join(rootPath, content)
    })
    .forEach(fs.remove)
}

/**
 * Clean unnecessary files in each packages
 */
async function cleanPkg() {
  const pkgsPath = path.resolve(rootPath, 'packages')
  const pkgs = await fs.readdir(pkgsPath) // .e.g ['api', 'hasura', 'hello']
  for (const pkg of pkgs) {
    const pkgPath = path.join(pkgsPath, pkg) // e.g. './packages/api'
    // Not using await in this line for parallelism
    fs.readdir(pkgPath).then(contents => {
      contents
        .filter(content => {
          return !['package.json', 'dist', 'node_modules'].includes(content)
        })
        .map(content => {
          return path.join(pkgPath, content)
        })
        .forEach(fs.remove)
    })
  }
}

cleanPkg()
cleanRoot()
