const { request } = require('../util/request');

request(3).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const numbers = data.split('\n')
      .filter((instruction) => instruction);

    // ---- PART 1 ----

    const numOfOnes = Array(numbers[0].length).fill(0);

    numbers.forEach((number) => {
      for (let index = 0; index < number.length; index++) {
        if (number[index] === '1') numOfOnes[index]++;
      }
    });

    const [gammaRateStr, epsilonRateStr] = numOfOnes.reduce((result, number) => {
      const oneIsMostCommon = number > numbers.length / 2;

      const gammaChar = oneIsMostCommon ? '1' : '0';
      const epsilonChar = oneIsMostCommon ? '0' : '1';

      result[0] = result[0] + gammaChar;
      result[1] = result[1] + epsilonChar;

      return result;
    }, ['', '']);

    const gammaRate = parseInt(gammaRateStr, 2);
    const epsilonRate = parseInt(epsilonRateStr, 2);

    console.log(`The answer to part 1 is ${gammaRate * epsilonRate}`);

    // ---- PART 2 ----

    let oxygenCandidates = Array.from(numbers);
    let co2Candidates = Array.from(numbers);

    let position = 0;
    while (oxygenCandidates.length > 1) {
      const numOfOnes = oxygenCandidates.reduce((result, candidate) => {
        if (candidate[position] === '1') result++;
        return result;
      }, 0);

      const oneIsMostCommon = numOfOnes >= oxygenCandidates.length / 2;

      oxygenCandidates = oxygenCandidates.filter((candidate) => parseInt(candidate[position]) == oneIsMostCommon);
      position++;
    }

    position = 0;
    while (co2Candidates.length > 1) {
      const numOfOnes = co2Candidates.reduce((result, candidate) => {
        if (candidate[position] === '1') result++;
        return result;
      }, 0);

      const oneIsMostCommon = numOfOnes >= co2Candidates.length / 2;

      co2Candidates = co2Candidates.filter((candidate) => parseInt(candidate[position]) != oneIsMostCommon);
      position++;
    }

    const oxygenRating = parseInt(oxygenCandidates[0], 2);
    const co2Rating = parseInt(co2Candidates[0], 2);

    console.log(`The answer to part 2 is ${oxygenRating * co2Rating}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
