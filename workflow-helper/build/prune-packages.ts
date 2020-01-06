// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'fs-extra'
import path from 'path'

/**
 * Remove every packages not containing 'dist'
 */
async function main() {
  const pkgsDir = 'packages'
  const pkgs = await fs.readdir(pkgsDir) // .e.g ['api', 'hasura', 'hello']
  for (const pkg of pkgs) {
    const pkgDir = path.join(pkgsDir, pkg) // e.g. './packages/api'
    // Not using await in this line for parallelism
    fs.readdir(pkgDir).then(contents => {
      if (!contents.includes('dist')) {
        fs.remove(pkgDir) // Remove a package not containing 'dist'
      }
    })
  }
}

main()
  .then(() => {
    console.log('Packages not containing "dist" are successfully removed.')
  })
  .catch(console.error)
