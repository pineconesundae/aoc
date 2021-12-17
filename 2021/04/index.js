const zip = require('lodash/zip');
const { request } = require('../util/request');

// Checks rows of a board to find a bingo
const checkRows = (board) => {
  return board.some((row) => {
    return row.every((number) => typeof number === 'string');
  });
}

// Checks columns of a board to find a bingo
const checkCols = (board) => {
  // zip from lodash pivots the array, turning columns into rows
  const pivotBoard = zip(...board);

  return checkRows(pivotBoard);
}

// Evaluates all boards for bingos
const evalBoards = (boards) => {
  const result = {
    winningBoards: [],
    winningIndicies: []
  };

  // Loop through each board and check rows and colunns for bingos
  boards.forEach((board, index) => {
    const rowWin = checkRows(board);
    const colWin = checkCols(board);

    if (rowWin || colWin) {
      result.winningBoards.push(board);
      result.winningIndicies.push(index);
    }
  });

  return result;
}

// Main function
request(4).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // -- DATA PREP --

    // Split out the bingo numbers, the blank line, and then the boards
    const [inputNumbers, , ...inputBoards] = data.split('\n');

    // Separate out the bingo numbers and convert to integers
    const numbers = inputNumbers
      .split(',')
      .map((input) => parseInt(input));

    // Loop through each line of board input
    const boards = [];
    let curBoard = [];
    inputBoards.forEach((input) => {
      // If it is a blank line, that's the end of a board
      if (!input) {
        boards.push(curBoard);
        curBoard = [];
      } else {
        // Add a row to the current board being collected
        curBoard.push(
          input.trim() // Trim whitespace from the row
            .replace(/\s+/g, ',') // Replace whitespace between the numbers with a comma
            .split(',') // Split on the comma
            .map((str) => parseInt(str)) // Convert each number to an integer
        );
      }
    });

    // -- ANSWER CALCULATION --

    let part1Answer = 0;
    let part2Answer = 0;
    let numBingos = 0;
    const numBoards = boards.length;

    try {
      // Start looping through each bingo number
      for (let numIndex = 0; numIndex < numbers.length; numIndex++) {
        const number = numbers[numIndex];

        // Loop through each board, row, and column and see if it has the number
        boards.forEach((board) => {
          board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
              if (number === col) {
                // If a match is found, change the number to a string
                board[rowIndex][colIndex] = number.toString();
              }
            });
          });
        });

        // Run all the boards through an evaluation function to find bingos
        const results = evalBoards(boards);

        // If a bingo was found...
        if (results.winningBoards.length > 0) {
          // Loop through each winning board
          results.winningBoards.forEach((winningBoard) => {
            // Sum up all the unmarked numbers (they are the ones that are not strings)
            const sumUnmarkedNums = winningBoard.reduce((result, row) => {
              row.forEach((num) => {
                if (typeof num !== 'string') result += num;
              });

              return result;
            }, 0);

            numBingos++;

            // If Part 1 hasn't been calculated yet, do so
            if (!part1Answer) part1Answer = number * sumUnmarkedNums;

            // If the number of bingos matches the number of boards, this is
            // the last board to get a bingo, and thus the answer to Part 2
            if (numBingos === numBoards) {
              part2Answer = number * sumUnmarkedNums;
              // This is a bit of a hack to just abort out of the loop as fast
              // as possible, since we are all done as soon as we find Part 2
              throw new Error;
            }
          });

          // Loop through the indicies of the winning boards and swap them all
          // out for just empty arrays so they don't continue to count for bingos
          results.winningIndicies.forEach((winningIndex) => {
            boards[winningIndex] = [];
          });
        }
      }
    } catch {
      // If we fall into the catch statement, that's because we just calculated Part 2
      console.log(`The answer to part 1 is ${part1Answer}`);
      console.log(`The answer to part 2 is ${part2Answer}`);
    }
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
