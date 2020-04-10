// External dependencies
const { JSDOM } = require('jsdom');
const moment = require('moment');
const innerText = require('styleless-innertext');

// Config consts
const {
  WEBSITE_URL,
  TEXT_NODE,
  DATE_FORMAT,
  REGIONS_NODE,
} = require('./config');

const dateStringsToTime = (date, time) =>
  moment(`${time} ${date}`, DATE_FORMAT).toString();

const desc = (a, b) => b.value - a.value;

const regionsFromNode = (node) =>
  Array.from(node.children)
    .splice(2) // remove the headers
    .map((e) => {
      const word = innerText(e)
        .replace(/\u{200b}/gu, '')
        .replace(/\s+/g, ' ');

      return {
        name: word.match(/(\D)*/)[0].trim(),
        value: parseInt(word.match(/(\d)+/)[0]),
      };
    })
    .sort(desc);

const valuesFromNode = (node) =>
  innerText(node)
    .replace(/\u{200b}/gu, '') // remove zero width space
    .replace(/\s+/g, ' ') // replace white spaces with one ' '
    .trim() // trimStart && trinEnd
    .split(' ');

const nodeFromUrlAndPath = async (url, path) => {
  const document = await JSDOM.fromURL(url);
  const node = document.window.document.querySelector(path);
  if (!node) throw Error(ERROR_MESSAGE);
  return node;
};

const globalData = async () => {
  const tbody = await nodeFromUrlAndPath(WEBSITE_URL, TEXT_NODE);
  const [time, date, recovered, deaths, confirmed, negatives] = valuesFromNode(
    tbody
  );

  const result = {
    lastUpdate: dateStringsToTime(date, time),
    recovered: parseInt(recovered),
    deaths: parseInt(deaths),
    confirmed: parseInt(confirmed),
    negatives: parseInt(negatives),
    tested: parseInt(negatives) + parseInt(confirmed),
  };

  return result;
};

const regionsData = async () => {
  const trs = await nodeFromUrlAndPath(WEBSITE_URL, REGIONS_NODE);
  return regionsFromNode(trs);
};

all = async () => {
  const [regions, global] = await Promise.all([regionsData(), globalData()]);

  return {
    ...global,
    regions,
  };
};

module.exports = {
  regions: regionsData,
  global: globalData,
  all: all,
};
