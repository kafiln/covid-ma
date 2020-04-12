const { dateStringsToTime } = require('../utils');

describe('The strings parser function', () => {
  it('should return a string', () => {
    const result = dateStringsToTime('20-04-2020', '13H25');
    expect(typeof result).toBe('string');
  });

  //TODO: refactor those tests with parameters
  it('should return a correct ISO string', () => {
    const result = dateStringsToTime('20-04-2020', '13H25');
    expect(result).toBe('2020-04-20T12:25:00.000Z');
  });

  it('should return a correct ISO string given a specific time offset', () => {
    const result = dateStringsToTime('20-04-2020', '13H25', '+0000');
    expect(result).toBe('2020-04-20T13:25:00.000Z');
  });

  it('should return the correct values', () => {
    const result = dateStringsToTime('20-04-2020', '00H25');
    expect(result).toBe('2020-04-19T23:25:00.000Z');
  });
});
