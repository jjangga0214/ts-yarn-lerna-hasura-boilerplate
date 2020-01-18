// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

const rootPath = path.resolve(__dirname, '..', '..')

async function prune() {
  const pkgsPath = path.resolve(rootPath, 'packages')
  const pkgs = await fs.readdir(pkgsPath) // .e.g ['api', 'hasura', 'hello']

  const command = `npx lerna list --all --scope '@jjangga0214/${process.env.PACKAGE}' \
  --json --include-dependencies --loglevel silent --no-progress`
  const { stdout, stderr } = await execAsync(command)

  if (stderr) {
    throw new Error(stderr)
  }

  interface LernaPkg {
    name: string
    version: string
    location: string
    private: boolean
  }
  const referencedPkgs: LernaPkg[] = JSON.parse(stdout)
  const referencedPkgsPaths = referencedPkgs.map(pkg => pkg.location)

  pkgs
    .map(pkg => path.join(pkgsPath, pkg))
    .filter(pkgPath => !referencedPkgsPaths.includes(pkgPath))
    .forEach(fs.remove)
}

prune()
