// External dependencies
const { JSDOM } = require('jsdom');
const innerText = require('styleless-innertext');

const { dateStringsToTime, byRegionNameDesc } = require('./utils');

// Config consts
const DEFAULT_CONFIG = require('./config');

const regionsFromNode = (node, totalValue) =>
  Array.from(node.children)
    .splice(1) // remove the headers
    .map((e) => {
      // console.log(innerText(e));
      const word = innerText(e)
        .replace(/\u{200b}/gu, '')
        .replace(/,/, '.')
        .replace(/\s+/g, ' ');

      const numberRegex = /(\d)*\.?(\d)+/;
      const name = word.match(/(\D)*/)[0].trim();
      const pourcentage = parseFloat(word.match(numberRegex)[0]);
      value = Math.round((pourcentage * totalValue) / 100);

      return {
        name,
        pourcentage,
        value,
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

  const country = countryFromNode(countryNode, config);

  return {
    ...country,
    regions: regionsFromNode(regionsNode, country.confirmed),
  };
};

module.exports = getAllData;
