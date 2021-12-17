const { request } = require('../util/request');
const zip = require('lodash/zip');
const cloneDeep = require('lodash/cloneDeep');

request(13).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // ---- DATA PREP ----

    // This trigger is used to determine when the coordinates end and the folds begin
    let trigger = false;
    const { coords, folds } = data.split('\n')
      .reduce((result, line) => {
        // If we have a blank line, that is the trigger
        if (!line) trigger = true;
        else {
          // If the trigger is true, that means we are reading in a fold
          if (trigger) {
            const [foldCoord, foldLine] = line
              .slice(11) // Slice off the words in the beginning
              .split('='); // Get the two parts of the fold directive

            result.folds.push({
              foldCoord,
              foldLine: parseInt(foldLine)
            });
          } else {
            // If the trigger was not true, read in a dot coordinate
            const [x, y] = line.split(',');

            result.coords.push({
              x: parseInt(x),
              y: parseInt(y)
            });
          }
        }

        return result;
      }, { coords: [], folds: [] });

    // Find the biggest value for x and y
    const maxX = Math.max(...coords.map((coord) => coord.x));
    const maxY = Math.max(...coords.map((coord) => coord.y)) + 1;
    // The +1 for Y was determined by trial and error

    // Create a zero-filled row with enough space for the largest x value
    const defaultRow = Array(maxX + 1).fill(0);
    // Create a second array with enough rows for the largest y value
    let paper = Array(maxY + 1);
    // Loop through and add the proper amount of rows
    for (let count = 0; count < maxY + 1; count++) {
      paper[count] = cloneDeep(defaultRow);
    }

    // Now that we have the array set up, go through each of the dot coordinates and set it to 1
    coords.forEach(({ x, y }) => {
      paper[y][x] = 1;
    })

    // ---- PART 1 ----

    // Loop through each fold directive
    folds.forEach(({ foldCoord, foldLine }, index) => {
      // If the fold direction is the y-axis, pivot the paper so the y-axis becomes the x-axis
      // Just easier to calculate things by going through rows rather than columns
      if (foldCoord === 'y') {
        paper = zip(...paper);
      }

      // Loop through each row in the paper
      paper = paper.map((row) => {
        // Grab off the part to the right of the fold and reverse it
        const foldedPart = row.slice(foldLine).reverse();
        // Drop the last item, since that is the fold line
        foldedPart.pop();

        // Since we reversed the folded part, we can just Boolean OR it with the non-folded part index-by-index
        foldedPart.forEach((dot, index) => {
          row[index] = row[index] || dot;
        });

        // Finally, slice off the non-folded part, decreasing the row length by half, completing the "fold"
        return row.slice(0, foldLine);
      })

      // If we had pivoted the paper earlier, pivot it again to get it back to normal
      if (foldCoord === 'y') {
        paper = zip(...paper);
      }

      // If this is the first trip through the loop, tally up all the dots for the Part 1 answer
      if (index === 0) {
        const part1Answer = paper.reduce((result, row) => {
          const numInRow = row.filter((dot) => dot).length;
          result += numInRow;
          return result;
        }, 0);
        console.log(`The answer to part 1 is ${part1Answer}`);
      }
    });

    // ---- PART 2 ----

    // For Part 2, we actually need to look at the array to see the letters, so join them all together
    // as a string and replace the 1s and 0s with characters to make it easier to read
    console.log(`The answer to part 2 is:`);
    console.log(paper.map((row) => row.join('').replace(/0/g, '.').replace(/1/g, '#')));
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
