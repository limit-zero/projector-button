const cheerio = require('cheerio');
const express = require('express');
const fetch = require('node-fetch');
const { asyncRoute } = require('@base-cms/utils');
const { USERNAME, PASSWORD } = require('./env');

const app = express();
const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

const powerOn = async (hostname) => {
  const response = await fetch(`http://${hostname}/cgi-bin/power_on.cgi`, {
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: 'lang=e&from=BASIC_CTL',
  });
  if (!response.ok) throw new Error(response.statusText);
  const body = await response.text();
  const $ = cheerio.load(body);
  return $('body').text().trim();
};

const powerOff = async (hostname) => {
  const response = await fetch(`http://${hostname}/cgi-bin/power_off.cgi`, {
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: 'lang=e&from=BASIC_CTL',
  });
  if (!response.ok) throw new Error(response.statusText);
  const body = await response.text();
  const $ = cheerio.load(body);
  return $('body').text().trim();
};

app.get('/', (req, res) => res.json({ ping: 'pong' }));

app.get('/favicon.ico', (req, res) => res.status(404).send());

app.get('/:hostname(*)', asyncRoute(async (req, res) => {
  const { params } = req;
  const { hostname } = params;

  let status = '';
  try {
    const onResponse = await powerOn(hostname);
    switch (onResponse) {
      case 'Starting projector.After lamp turn on, open top page again.':
        status = 'Starting projector...';
        break;
      case 'Cooling Down. Please wait until projector returns to standby.':
        status = 'Cooling down...';
        break;
      case 'Projector has already turned on.':
        await powerOff(hostname);
        status = 'Entering standby...';
        break;
      default:
        break;
    }
    res.json({ hostname, status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}));

module.exports = app;
