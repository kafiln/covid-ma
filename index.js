// External dependencies
const { JSDOM } = require('jsdom');
const innerText = require('styleless-innertext');

const { dateStringsToTime, byRegionNameDesc } = require('./utils');

// Config consts
const { WEBSITE_URL, TEXT_NODE, REGIONS_NODE } = require('./config');

const regionsFromNode = (node) =>
  Array.from(node.children)
    .splice(1) // remove the headers
    .map((e) => {
      const word = innerText(e)
        .replace(/\u{200b}/gu, '')
        .replace(/\s+/g, ' ');

      return {
        name: word.match(/(\D)*/)[0].trim(),
        value: parseInt(word.match(/(\d)+/)[0]),
      };
    })
    .sort(byRegionNameDesc);

const countryDto = (values) => {
  const [time, date, recovered, deaths, confirmed, negatives] = values;

  return {
    lastUpdate: dateStringsToTime(date, time),
    recovered: parseInt(recovered),
    deaths: parseInt(deaths),
    confirmed: parseInt(confirmed),
    negatives: parseInt(negatives),
    tested: parseInt(negatives) + parseInt(confirmed),
  };
};

const countryFromNode = (node) =>
  countryDto(
    innerText(node)
      .replace(/\u{200b}/gu, '') // remove zero width space
      .replace(/\s+/g, ' ') // replace white spaces with one ' '
      .trim() // trimStart && trinEnd
      .split(' ')
  );

const nodesFromUrl = async (url) => {
  const document = await JSDOM.fromURL(url);
  const country = document.window.document.querySelector(TEXT_NODE);
  const regions = document.window.document.querySelector(REGIONS_NODE);
  return [regions, country];
};

const getAllData = async () => {
  const [regionsNode, countryNode] = await nodesFromUrl(WEBSITE_URL);

  return {
    ...countryFromNode(countryNode),
    regions: regionsFromNode(regionsNode),
  };
};

module.exports = getAllData;
