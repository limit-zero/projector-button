const cheerio = require('cheerio');
const express = require('express');
const fetch = require('node-fetch');
const { asyncRoute } = require('@base-cms/utils');
const { USERNAME, PASSWORD } = require('./env');

const app = express();

const createAuth = () => Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

const checkStatus = async (hostname) => {
  const query = 'key=pow_on&lang=e&from=BASIC_CTL';
  const response = await fetch(`http://${hostname}/cgi-bin/power_ctl.cgi?${query}`, {
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

const powerOn = async (hostname) => {
  const response = await fetch(`http://${hostname}/cgi-bin/power_on.cgi`, {
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

app.get('/:hostname(*)', asyncRoute(async (req, res) => {
  const { params } = req;
  const { hostname } = params;
  const status = await checkStatus(hostname);
  if (status !== 'Are you sure to let projector power on ?') {
    res.send(`The projector "${hostname}" is already on.`);
  } else {
    await powerOn(hostname);
    res.send(`The projector "${hostname}" is powering on!`);
  }
}));

module.exports = app;
