const {
  parallel,
  src,
  watch,
} = require('gulp');
const cache = require('gulp-cached');
const eslint = require('gulp-eslint');
const log = require('fancy-log');
const {
  green,
  magenta,
  cyan,
  red,
} = require('chalk');
const { spawn } = require('child_process');

let isFirstRun = true;
let node;
const server = async () => {
  if (node) node.kill();
  isFirstRun = false;
  node = await spawn('node', ['src/index.js'], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
  node.on('close', (code, signal) => {
    const exited = [];
    if (code) exited.push(`code ${magenta(code)}`);
    if (signal) exited.push(`signal ${magenta(signal)}`);
    log(`Process ${green('exited')} with ${exited.join(' ')}`);
  });
};

const lintScripts = () => src(['src/**/*.js'])
  .pipe(cache('lint'))
  .pipe(eslint())
  .pipe(eslint.format());


const serve = () => {
  const watcher = watch(
    ['src/**/*.js'],
    { queue: false, ignoreInitial: false },
    parallel(lintScripts, server),
  );
  watcher.on('add', (path) => {
    if (!isFirstRun) log(`File ${green(path)} was ${green('added')}`);
  });
  watcher.on('change', path => log(`File ${green(path)} was ${cyan('changed')}`));
  watcher.on('unlink', path => log(`File ${green(path)} was ${red('removed')}.`));
};

exports.default = serve;
exports.serve = serve;
exports['lint:js'] = lintScripts;
