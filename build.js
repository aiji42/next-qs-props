const { build } = require('esbuild')
const { dependencies, peerDependencies } = require('./package.json')

const shared = {
  entryPoints: ['./src/index.ts'],
  external: Object.keys({ ...dependencies, ...peerDependencies }),
  bundle: true,
  outdir: './dist',
  target: 'esnext'
}

build({
  ...shared,
  outExtension: { '.js': '.cjs' },
  format: 'cjs'
})

build({
  ...shared,
  outExtension: { '.js': '.mjs' },
  format: 'esm'
})
