const { dateStringsToTime } = require('../utils');
const moment = require('moment');

describe('The strings parser function', () => {
  it('should return a string', () => {
    const result = dateStringsToTime('20-04-2020', '13H25', '+0000');
    expect(typeof result).toBe('string');
  });

  it('should return a correct ISO string', () => {
    const result = dateStringsToTime('20-04-2020', '13H25');
    expect(result).toBe('2020-04-20T12:25:00.000Z');
  });

  //TODO: refactor those tests with parameters
  it('should return a correct ISO string given a specific time offset', () => {
    const result = dateStringsToTime('20-04-2020', '13H25', '+0000');
    expect(result).toBe('2020-04-20T13:25:00.000Z');
  });

  it('should return the correct values', () => {
    const dateString = dateStringsToTime('20-04-2020', '00H25');
    const result = moment.utc(dateString);
    expect(result.milliseconds()).toBe(0);
    expect(result.seconds()).toBe(0);
    expect(result.minutes()).toBe(25);
    expect(result.hours()).toBe(23);
    expect(result.date()).toBe(19);
    expect(result.month()).toBe(3);
    expect(result.year()).toBe(2020);
  });
});
