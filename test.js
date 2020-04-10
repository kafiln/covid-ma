const { all } = require('.');

(async () => {
  const results = await all();
  console.log(results);
})();
