const app = require('./app');
const { PORT } = require('./env');

app.listen(PORT, () => {
  if (process.send) process.send({ event: 'ready', location: `http://0.0.0.0:${PORT}` });
});
