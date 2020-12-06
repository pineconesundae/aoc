const { request } = require('../util/request');

const calculateSeatId = (minRow, maxRow, minSeat, maxSeat, token) => {
  if (token && token.length > 0) {
    const [char] = token;

    if (char === 'F') {
      const reduce = Math.ceil((maxRow - minRow) / 2);
      return calculateSeatId(minRow, maxRow - reduce, minSeat, maxSeat, token.substring(1));
    } else if (char === 'B') {
      const add = Math.ceil((maxRow - minRow) / 2);
      return calculateSeatId(minRow + add, maxRow, minSeat, maxSeat, token.substring(1));
    } else if (char === 'L') {
      const reduce = Math.ceil((maxSeat - minSeat) / 2);
      return calculateSeatId(minRow, maxRow, minSeat, maxSeat - reduce, token.substring(1));
    } else {
      const add = Math.ceil((maxSeat - minSeat) / 2);
      return calculateSeatId(minRow, maxRow, minSeat + add, maxSeat, token.substring(1));
    }
  } else {
    console.log(minRow, maxRow, minSeat, maxSeat);
    return (maxRow * 8) + maxSeat;
  }
};

request(5).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const passes = data.split('\n').filter((pass) => pass);
    let result1 = 0;

    const seatIds = passes.map((pass) => {
      const seatId = calculateSeatId(0, 127, 0, 7, pass);

      if (seatId > result1) {
        result1 = seatId;
      }

      return seatId;
    });

    const result2 = seatIds.sort().find((seatId, index, array) => {
      return (index + 1 < array.length && array[index + 1] === array[index] + 2);
    })

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2 + 1}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
