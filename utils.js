const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));

/**
 *Parse the strings for date and time
 *
 * @param {String} date - a date string in format hh[H]mm
 * @param {String} time - a time string in format DD-MM-YYYY
 * @param {String} timeOffset - a time offset string in format +dddd @default +000
 * @returns {Date} Date - The resulting date object
 */
const dateStringsToTime = (date, time, config) =>
  dayjs(`${time} ${date} ${config.timeOffset}`, config.dateFormat)
    .toDate()
    .toISOString();

const byRegionNameDesc = (region, anotherRegion) =>
  anotherRegion.value - region.value;

module.exports = {
  dateStringsToTime,
  byRegionNameDesc,
};
