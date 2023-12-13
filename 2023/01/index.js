const { request } = require('../util/request');

request(1).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // *** DATA PREP ***

    const input = data.split('\n').filter((line) => line);

    // *** PART ONE ***

    const partOneAnswer = input.reduce((result, string) => {
      const matches = string.match(/\d/g);
      const firstDigit = matches[0];
      const secondDigit = matches[matches.length - 1];

      const number = parseInt(`${firstDigit}${secondDigit}`);

      return result + number;
    }, 0);

    console.log(partOneAnswer);

    // *** PART TWO ***

    const convertDigit = (digit) => {
      const conversions = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        eno: 1,
        owt: 2,
        eerht: 3,
        ruof: 4,
        evif: 5,
        xis: 6,
        neves: 7,
        thgie: 8,
        enin: 9
      };

      return isNaN(parseInt(digit))
        ? conversions[digit]
        : parseInt(digit);
    };

    const partTwoAnswer = input.reduce((result, string) => {
      const firstDigit = convertDigit(string.match(/\d|one|two|three|four|five|six|seven|eight|nine/)[0]);
      const secondDigit = convertDigit(string.split('').reverse().join('').match(/\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/)[0]);

      const number = parseInt(`${firstDigit}${secondDigit}`);

      return result + number;
    }, 0);

    console.log(partTwoAnswer);
  }
});
