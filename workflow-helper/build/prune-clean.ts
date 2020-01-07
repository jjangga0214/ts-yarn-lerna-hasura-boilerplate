// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'fs-extra'
import path from 'path'

const rootPath = path.resolve(__dirname, '..', '..')

/**
 * Clean (delete unnecessary things in) project root
 */
async function cleanRoot() {
  const contents = await fs.readdir(rootPath)
  contents
    .filter(content => {
      return !['package.json', 'yarn.lock', 'packages', 'LICENSE'].includes(
        content,
      )
    })
    .map(content => {
      return path.join(rootPath, content)
    })
    .forEach(fs.remove)
}
/**
 * This does two things
 * 1. prune (delete at all) unreferenced packages
 * 2. clean (delete unnecessary things in) referenced packages
 */
async function pruneOrClean() {
  const pkgsPath = path.resolve(rootPath, 'packages')
  const pkgs = await fs.readdir(pkgsPath) // .e.g ['api', 'hasura', 'hello']
  for (const pkg of pkgs) {
    const pkgPath = path.join(pkgsPath, pkg) // e.g. './packages/api'
    // Not using await in this line for parallelism
    fs.readdir(pkgPath).then(contents => {
      if (contents.includes('dist')) {
        // Clean referenced package
        contents
          .filter(content => {
            return !['package.json', 'dist'].includes(content)
          })
          .map(content => {
            return path.join(pkgPath, content)
          })
          .forEach(fs.remove)
      } else {
        // Prune unreferenced package
        fs.remove(pkgPath)
      }
    })
  }
}

cleanRoot()
pruneOrClean()
