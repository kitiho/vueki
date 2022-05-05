import minimist from 'minimist';
import { execa } from 'execa';

const args = minimist(process.argv.slice(2));

const target = args._.length ? args._[0] : 'reactive';
const formats = args.f || 'global'
const sourcemap = args.s || false

execa('rollup', [
  "-wc",
  '--environment',
  [
    `TARGET:${target}`,
    `FORMATS:${formats}`,
    sourcemap ? `SOURCE_MAP:true` : ''
  ].filter(Boolean).join(','),
], {
  stdio: 'inherit' // 子进程的输出在当前命令行中
})
