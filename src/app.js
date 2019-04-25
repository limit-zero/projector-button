const express = require('express');
const { USERNAME, PASSWORD } = require('./env');

const app = express();

const createAuth = () => Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

app.get('/', (req, res) => {
  res.json({ ping: 'pong', auth: createAuth() });
});

module.exports = app;
