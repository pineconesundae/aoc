const { request } = require('../util/request');
const intersection = require('lodash/intersection');

request(4).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // *** DATA PREP ***

    const input = data
      .split('\n')
      .filter((line) => line)
      .map((line) => {
        const [winningNumbers, cardNumbers] = line
          .slice(10)
          .split(' | ')
          .map((numbers) => numbers.split(' ').filter((number) => number));

        return { quantity: 1, winningNumbers, cardNumbers };
      });

    // *** PART ONE ***

    const partOneAnswer = input.reduce((result, card) => {
      const { winningNumbers, cardNumbers } = card;

      const matches = intersection(winningNumbers, cardNumbers);

      if (matches.length > 0) {
        const points = Math.pow(2, matches.length - 1);
        result += points;
      }

      return result;
    }, 0);

    console.log(partOneAnswer);

    // *** PART TWO ***

    const partTwoAnswer = input.reduce((result, card, index) => {
      const { quantity, winningNumbers, cardNumbers } = card;

      const matches = intersection(winningNumbers, cardNumbers);

      if (matches.length > 0) {
        for (let count = 1; count <= matches.length; count++) {
          input[index + count].quantity += quantity;
        }
      }

      return result + quantity;
    }, 0);

    console.log(partTwoAnswer);
  }
});
