const cheerio = require('cheerio');
const express = require('express');
const fetch = require('node-fetch');
const { asyncRoute } = require('@base-cms/utils');
const { USERNAME, PASSWORD, PROJECTOR_URI } = require('./env');

const app = express();

const createAuth = () => Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

const checkStatus = async () => {
  const query = 'key=pow_on&lang=e&from=BASIC_CTL';
  const response = await fetch(`${PROJECTOR_URI}/cgi-bin/power_ctl.cgi?${query}`, {
    method: 'get',
    headers: {
      Authorization: `Basic ${createAuth()}`,
    },
  });
  if (!response.ok) throw new Error(response.statusText);
  const body = await response.text();
  const $ = cheerio.load(body);
  return $('body').text().trim();
};

const powerOn = async () => {
  const response = await fetch(`${PROJECTOR_URI}/cgi-bin/power_on.cgi`, {
    method: 'post',
    headers: {
      Authorization: `Basic ${createAuth()}`,
    },
    body: 'lang=e&from=BASIC_CTL',
  });
  if (!response.ok) throw new Error(response.statusText);
  const body = await response.text();
  const $ = cheerio.load(body);
  return $('body').text().trim();
};

app.get('/', asyncRoute(async (req, res) => {
  const status = await checkStatus();
  if (status !== 'Are you sure to let projector power on ?') {
    res.send('The projector is already on.');
  } else {
    const result = await powerOn();
    res.send(result);
  }
}));

module.exports = app;
