const mean = require('lodash/mean');
const { request } = require('../util/request');

request(7).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const positions = data.split(',')
      .filter((x) => x)
      .map((x) => parseInt(x))
      .sort();

    // ---- DATA PREP ----

    // Probably far over-complicating this, but using a weighted mean was my first thought...
    const firstHalf = positions.slice(0, Math.ceil(positions.length / 2));
    const firstHalfMiddle = Math.floor(firstHalf.length / 2);
    const firstQuartile = firstHalf.length % 2 === 0
      ? (firstHalf[firstHalfMiddle - 1] + firstHalf[firstHalfMiddle]) / 2
      : firstHalf[firstHalfMiddle];

    const secondHalf = positions.slice(Math.floor(positions.length / 2));
    const secondHalfMiddle = Math.floor(secondHalf.length / 2);
    const thirdQuartile = secondHalf.length % 2 === 0
      ? (secondHalf[secondHalfMiddle - 1] + secondHalf[secondHalfMiddle]) / 2
      : secondHalf[secondHalfMiddle];

    const iqr = thirdQuartile - firstQuartile;
    const outlierThreshold = iqr * 1.5;

    // Now that we have the outlier threshold, remove all outliers
    const filteredPositions = positions.filter((position) => position >= firstQuartile - outlierThreshold && position <= thirdQuartile + outlierThreshold);

    // Calculate the weighted mean from the filtered set
    const weightedMean = Math.floor(mean(filteredPositions));

    // ---- PART 1 ----

    // Use the weighted mean as a starting point
    let weightedMeanAnswer = positions.reduce((result, position) => {
      result += Math.abs(position - weightedMean);
      return result;
    }, 0);

    let potentialAnswers = [weightedMeanAnswer];

    // Expand out the search from the weighted mean in both directions by 200
    for (let search = 1; search < 200; search++) {
      const adjustedMeanPos = weightedMean + search;
      const adjustedMeanNeg = weightedMean - search;

      potentialAnswers.push(
        positions.reduce((result, position) => {
          result += Math.abs(position - adjustedMeanPos);
          return result;
        }, 0),
        positions.reduce((result, position) => {
          result += Math.abs(position - adjustedMeanNeg);
          return result;
        }, 0)
      );
    }

    // Find the minimum in that set and hope it's right!
    const part1Answer = Math.min(...potentialAnswers);

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    // Part 2 is basically the same as Part 1, just we have to do an additional
    // calculation to get the summation of the distance instead of using the
    // distance value immediately
    weightedMeanAnswer = positions.reduce((result, position) => {
      const distance = Math.abs(position - weightedMean);
      const summation = (distance * (distance + 1)) / 2;
      result += summation;
      return result;
    }, 0);

    potentialAnswers = [weightedMeanAnswer];

    // All logic here is the same as Part 1 with the added summation calculation
    for (let search = 1; search < 200; search++) {
      const adjustedMeanPos = weightedMean + search;
      const adjustedMeanNeg = weightedMean - search;

      potentialAnswers.push(
        positions.reduce((result, position) => {
          const distance = Math.abs(position - adjustedMeanPos);
          const summation = (distance * (distance + 1)) / 2;
          result += summation;
          return result;
        }, 0),
        positions.reduce((result, position) => {
          const distance = Math.abs(position - adjustedMeanNeg);
          const summation = (distance * (distance + 1)) / 2;
          result += summation;
          return result;
        }, 0)
      );
    }

    const part2Answer = Math.min(...potentialAnswers);

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
