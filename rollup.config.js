import path from 'path';
const packageFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const sourcemap = process.env.SOURCE_MAP === 'true'
const target = process.env.TARGET
// package目录
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, target)
const resolve = (...args) => path.resolve(packageDir, ...args)
const name = path.basename(packageDir)
const pkg = require(resolve('package.json'))

const outputConfig = {
  'esm-bundler': {
    format: 'es',
    file: resolve(`dist/${name}.esm.js`),
    sourcemap,
  },
  'cjs-bundler': {
    format: 'cjs',
    file: resolve(`dist/${name}.cjs.js`),
    sourcemap,
  },
  'global': {
    format: 'iife',
    file: resolve(`dist/${name}.global.js`),
    sourcemap,
  },
}

const packageConfig = pkg.buildOptions.format

import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const createConfig = (format, output) => {
  output.exports = 'named'
  output.extend = true
  let external = []
  if (format === 'global') {
    output.name = pkg.buildOptions.name
  } else {
    external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
  }
  return {
    input: resolve(`src/index.ts`),
    output,
    external,
    plugins: [
      json(),
      ts(),
      commonjs(),
      nodeResolve()
    ]
  }
}
export default packageConfig.map(format => createConfig(format, outputConfig[format]))
