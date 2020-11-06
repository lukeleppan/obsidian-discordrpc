import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: [
    'main.ts',
  ],
  output: {
    dir: '.',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian', 'electron', 'net', 'events', 'timers'],
  plugins: [
    nodeResolve({browser: true,preferBuiltins: false}),
    typescript(),
    commonjs(),
  ]
};