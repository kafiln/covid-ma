const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));

const { DATE_FORMAT, TIME_OFFSET } = require('./config');
/**
 *Parse the strings for date and time
 *
 * @param {String} date - a date string in format hh[H]mm
 * @param {String} time - a time string in format DD-MM-YYYY
 * @param {String} timeOffset - a time offset string in format +dddd @default +0100
 * @returns {Date} Date - The resulting date object
 */
const dateStringsToTime = (date, time, timeOffset = TIME_OFFSET) =>
  dayjs(`${time} ${date} ${timeOffset}`, DATE_FORMAT).toDate().toISOString();

const byRegionNameDesc = (region, anotherRegion) =>
  anotherRegion.value - region.value;

module.exports = {
  dateStringsToTime,
  byRegionNameDesc,
};
