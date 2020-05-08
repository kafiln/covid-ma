// External dependencies
const { JSDOM } = require('jsdom');
const innerText = require('styleless-innertext');

const { dateStringsToTime, byRegionNameDesc } = require('./utils');

// Config consts
const DEFAULT_CONFIG = require('./config');

const regionsFromNode = (node) =>
  Array.from(node.children)
    .splice(1) // remove the headers
    .map((e) => {
      // console.log(innerText(e));
      const word = innerText(e)
        .replace(/\u{200b}/gu, '')
        .replace(/,/, '.')
        .replace(/\s+/g, ' ');

      const numberRegex = /(\d)*\.?(\d)+/;
      console.log(word);

      return {
        name: word.match(/(\D)*/)[0].trim(),
        value: parseFloat(word.match(numberRegex)[0]),
      };
    })
    .sort(byRegionNameDesc);

const countryDto = (values, config) => {
  const [time, date, recovered, deaths, confirmed, negatives] = values;

  return {
    lastUpdate: dateStringsToTime(date, time, config),
    recovered: parseInt(recovered),
    deaths: parseInt(deaths),
    confirmed: parseInt(confirmed),
    negatives: parseInt(negatives),
    tested: parseInt(negatives) + parseInt(confirmed),
    actives: parseInt(confirmed) - parseInt(deaths) - parseInt(recovered),
  };
};

const countryFromNode = (node, config) =>
  countryDto(
    innerText(node)
      .replace(/\u{200b}/gu, '') // remove zero width space
      .replace(/\s+/g, ' ') // replace white spaces with one ' '
      .trim() // trimStart && trinEnd
      .split(' '),
    config
  );

const nodesFromUrl = async (config) => {
  const document = await JSDOM.fromURL(config.websiteUrl);
  const country = document.window.document.querySelector(config.textNode);
  const regions = document.window.document.querySelector(config.regionsNode);
  return [regions, country];
};

const getAllData = async (options) => {
  // Provided config overrides the default one
  const config = { ...DEFAULT_CONFIG, ...options };
  const [regionsNode, countryNode] = await nodesFromUrl(config);

  return {
    ...countryFromNode(countryNode, config),
    regions: regionsFromNode(regionsNode, config),
  };
};

module.exports = getAllData;
