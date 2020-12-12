const { request } = require('../util/request');
const { replaceAt } = require('../util/replaceAt');

const findNearbyOccupiedSeats = (seats, targetRow, targetCol) => {
  return [
    [targetRow - 1, targetCol - 1], [targetRow - 1, targetCol], [targetRow - 1, targetCol + 1],
    [targetRow, targetCol - 1], [targetRow, targetCol + 1],
    [targetRow + 1, targetCol - 1], [targetRow + 1, targetCol], [targetRow + 1, targetCol + 1]
  ].filter(([theRow, theCol]) => seats[theRow] && seats[theRow][theCol] === '#');
};

// Returns TRUE if an occupied seat is found
const traveseDirection = (seats, row, col, rowSlope, colSlope) => {
  const newRow = row + rowSlope;
  const newCol = col + colSlope;

  // If out of bounds, return false
  if (
    newRow < 0 || newRow === seats.length
    || newCol < 0 || newCol === seats[newRow].length
  ) {
    return false;
  }

  // If there is no seat, keep traversing along the slope
  if (seats[newRow][newCol] === '.') {
    return traveseDirection(seats, newRow, newCol, rowSlope, colSlope);
  } else {
    // If we encountered a seat, return TRUE if it is occupied
    return seats[newRow][newCol] === '#';
  }
};

const findVisibleOccupiedSeats = (seats, targetRow, targetCol) => {
  return [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ].filter(([rowSlope, colSlope]) => traveseDirection(seats, targetRow, targetCol, rowSlope, colSlope));
};

const doPart1 = (data) => {
  let nextSeats = data.split('\n').filter((row) => row);

  let curSeats = [];
  let numOccupiedSeats = 0;

  while (JSON.stringify(curSeats) !== JSON.stringify(nextSeats)) {
    curSeats = [...nextSeats];
    numOccupiedSeats = 0;

    for (let row = 0; row < curSeats.length; row++) {
      for (let col = 0; col < curSeats[row].length; col++) {
        let nextSeat;
        const curSeat = curSeats[row][col];
        const occupiedSeatsNearby = findNearbyOccupiedSeats(curSeats, row, col);

        if (curSeat === '#' && occupiedSeatsNearby.length >= 4) {
          nextSeat = replaceAt(nextSeats[row], 'L', col);
        } else if (curSeat === 'L' && occupiedSeatsNearby.length === 0) {
          nextSeat = replaceAt(nextSeats[row], '#', col);
        } else {
          nextSeat = replaceAt(nextSeats[row], curSeat, col);
        }

        nextSeats[row] = nextSeat;
        if (nextSeat[col] === '#') numOccupiedSeats++;
      }
    }
  }

  return numOccupiedSeats;
};

const doPart2 = (data) => {
  let nextSeats = data.split('\n').filter((row) => row);

  let curSeats = [];
  let numOccupiedSeats = 0;

  while (JSON.stringify(curSeats) !== JSON.stringify(nextSeats)) {
    curSeats = [...nextSeats];
    numOccupiedSeats = 0;

    for (let row = 0; row < curSeats.length; row++) {
      for (let col = 0; col < curSeats[row].length; col++) {
        let nextSeat;
        const curSeat = curSeats[row][col];
        const occupiedSeatsVisible = findVisibleOccupiedSeats(curSeats, row, col);

        if (curSeat === '#' && occupiedSeatsVisible.length >= 5) {
          nextSeat = replaceAt(nextSeats[row], 'L', col);
        } else if (curSeat === 'L' && occupiedSeatsVisible.length === 0) {
          nextSeat = replaceAt(nextSeats[row], '#', col);
        } else {
          nextSeat = replaceAt(nextSeats[row], curSeat, col);
        }

        nextSeats[row] = nextSeat;
        if (nextSeat[col] === '#') numOccupiedSeats++;
      }
    }
  }

  return numOccupiedSeats;
};

request(11).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const result1 = doPart1(data);
    const result2 = doPart2(data);

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
