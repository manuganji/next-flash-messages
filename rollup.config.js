/* eslint-disable */

import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import { dts } from 'rollup-plugin-dts'

module.exports = [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/next-flash-messages.js',
      format: 'cjs',
    },
    external: [
      'cookie',
      'hoist-non-react-statics',
      'next',
      'react',
      'react-dom',
      'universal-cookie',
    ],
    jsnext: true,
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/next-flash-messages.d.ts',
      format: 'es',
    },
    external: [
      'cookie',
      'hoist-non-react-statics',
      'next',
      'react',
      'react-dom',
      'universal-cookie',
    ],
    plugins: [
      dts(),
    ],
  },
]
