// External dependencies
const { JSDOM } = require('jsdom');
const moment = require('moment');
const innerText = require('styleless-innertext');

// Config consts
const { WEBSITE_URL, TEXT_NODE, DATE_FORMAT } = require('./config');

const dateStringsToTime = (date, time) =>
  moment(`${time} ${date}`, DATE_FORMAT);

const valuesFromNode = (node) =>
  innerText(node)
    .replace(/\u{200b}/gu, '') // remove zero width space
    .replace(/\s+/g, ' ') // replace white spaces with one ' '
    .trim() // trimStart && trinEnd
    .split(' ');

const getCovidResults = async () => {
  const document = await JSDOM.fromURL(WEBSITE_URL);
  const tbody = document.window.document.querySelector(TEXT_NODE);
  if (!tbody) throw Error(ERROR_MESSAGE);

  const [time, date, recovered, deaths, confirmed, negatives] = valuesFromNode(
    tbody
  );

  const lastUpdate = dateStringsToTime(date, time);

  const result = {
    lastUpdate: lastUpdate.toString(),
    recovered: +recovered,
    deaths: +deaths,
    confirmed: +confirmed,
    negatives: +negatives,
  };
  return result;
};

module.exports = getCovidResults;
