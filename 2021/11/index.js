const { request } = require('../util/request');

request(11).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    let map = data.split('\n')
      .filter((x) => x)
      .map((x) => Array.from(x).map((y) => parseInt(y)));

    const rowMax = map.length;
    const colMax = map[0].length;

    // ---- PART 1 ----

    let part1Answer = 0;
    let part2Answer = 0;
    let megaFlash = false;

    // Megaflash is when all the octopi flash as one!
    while (!megaFlash) {
      part2Answer++;

      // Increment all positions by one
      map = map.map((row) => {
        return row.map((col) => col + 1);
      });

      // Loop until there is no more flashes
      let flash = true;
      while (flash) {
        flash = false;

        // Loop through each position in the map
        for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
          for (let colIndex = 0; colIndex < colMax; colIndex++) {
            const octopus = map[rowIndex][colIndex];

            // If the octopus has reached critical mass, it's time to flash
            if (octopus > 9) {
              // For Part 1, we only want to tally everything up to step 100
              if (part2Answer <= 100) part1Answer++;

              // Set the toggle to true so we take another pass through to catch any
              // octopi that flash due to this flash
              flash = true;

              // Set the octopus who just flashed to -1
              map[rowIndex][colIndex] = -1;

              // Increment all the surrounding octopi by one (if they haven't already flashed)
              if (rowIndex > 0) {
                if (colIndex > 0 && map[rowIndex - 1][colIndex - 1] > -1) map[rowIndex - 1][colIndex - 1] += 1;
                if (map[rowIndex - 1][colIndex] > -1) map[rowIndex - 1][colIndex] += 1;
                if (colIndex < colMax - 1 && map[rowIndex - 1][colIndex + 1] > -1) map[rowIndex - 1][colIndex + 1] += 1;
              }

              if (colIndex > 0 && map[rowIndex][colIndex - 1] > -1) map[rowIndex][colIndex - 1] += 1;
              if (colIndex < colMax - 1 && map[rowIndex][colIndex + 1] > -1) map[rowIndex][colIndex + 1] += 1;

              if (rowIndex < rowMax - 1) {
                if (colIndex > 0 && map[rowIndex + 1][colIndex - 1] > -1) map[rowIndex + 1][colIndex - 1] += 1;
                if (map[rowIndex + 1][colIndex] > -1) map[rowIndex + 1][colIndex] += 1;
                if (colIndex < colMax - 1 && map[rowIndex + 1][colIndex + 1] > -1) map[rowIndex + 1][colIndex + 1] += 1;
              }
            }
          }
        }
      }

      // Check to see if every octopus flashed - this is the end of our loop if so
      megaFlash = map.every((row) => row.every((col) => col === -1));

      // Reset any octopus who flashed to 0
      map = map.map((row) => {
        return row.map((col) => col === -1 ? 0 : col);
      });
    }

    console.log(`The answer to part 1 is ${part1Answer}`);

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
