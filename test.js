const getAllData = require('.');

(async () => {
  console.time('duration');
  const results = await getAllData();
  console.log(results);
  console.timeEnd('duration');
})();
