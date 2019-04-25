const { green, yellow } = require('chalk');
const log = require('fancy-log');

const app = require('./app');
const { PORT } = require('./env');

app.listen(PORT, () => {
  log(`Server ${green('ready')} on ${yellow(`http://0.0.0.0:${PORT}`)}`);
});
