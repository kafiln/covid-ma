// import the function and name it as you prefer
const getData = require('.');

(async () => {
  // get the results
  try {
    const results = await getData({
      timeOffset: '+0000',
    });
    console.log(results);
  } catch (error) {
    console.error(error);
  }

  // use the resuls as you wish
})();
