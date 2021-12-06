const { request } = require('../util/request');

const breedLanternfish = (initialFish, days) => {
  let fish = Array.from(initialFish);

  for (let curDay = 1; curDay <= days; curDay++) {
    const newFish = [];

    fish = fish.map((timer) => {
      if (timer === 0) {
        newFish.push(8);
        return 6;
      } else {
        return timer - 1;
      }
    }).concat(newFish);
  }

  return fish;
}

request(6).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const initialFish = data.split(',')
      .filter((x) => x)
      .map((x) => parseInt(x));

    // ---- PART 1 ----

    const part1Answer = breedLanternfish(initialFish, 80);

    console.log(`The answer to part 1 is ${part1Answer.length}`);

    // ---- PART 2 ----

    // This is not possible...out of memory errors!
    // const part2Answer = breedLanternfish(initialFish, 256);

    // Load up each "day" into a bucket and seed the fish timers into it
    const buckets = initialFish.reduce((result, timer) => {
      result[timer] += 1;
      return result;
    }, Array(9).fill(0));

    // Loop for 256 days...
    for (let curDay = 0; curDay < 256; curDay++) {
      // Knock off the first element of the array - these are the reproducing fish
      const birthers = buckets.shift();

      // Push these fish onto the end of the array - this represents the newly born fish
      buckets.push(birthers);

      // Add the reproducing fish to the seventh bucket, resetting their reproductive timer
      buckets[6] += birthers;
    }

    // Sum up all the buckets to get the total number of fish
    const part2Answer = buckets.reduce((result, bucket) => result + bucket, 0);

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
