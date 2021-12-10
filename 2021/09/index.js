const { request } = require('../util/request');

// Recursively searches a location and its surrounding locations
const search = (map, visited, row, col, basinSize) => {
  const rowMax = map.length - 1;
  const colMax = map[0].length - 1;

  const height = map[row][col];

  // If our location is a 9 or we have already visited it, just skip over
  if (height < 9 && visited[row][col] !== '*') {
    // Mark this location as visited
    visited[row][col] = '*';

    // Increment the basin size
    basinSize++;

    // Search up
    if (row > 0 && visited[row - 1][col] !== '*')
      basinSize = search(map, visited, row - 1, col, basinSize);
    // Search right
    if (col < colMax && visited[row][col + 1] !== '*')
      basinSize = search(map, visited, row, col + 1, basinSize);
    // Search down
    if (row < rowMax && visited[row + 1][col] !== '*')
      basinSize = search(map, visited, row + 1, col, basinSize);
    // Search left
    if (col > 0 && visited[row][col - 1] !== '*')
      basinSize = search(map, visited, row, col - 1, basinSize);
  }

  // Return our current basin size from this search
  return basinSize;
}

request(9).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const heightMap = data.split('\n')
      .filter((x) => x)
      .map((x) => Array.from(x).map((y) => parseInt(y)));

    // ---- PART 1 ----

    const part1Answer = heightMap.reduce((result, row, rowIndex) => {
      row.forEach((height, colIndex) => {
        // Zero is always a low point
        if (height === 0) {
          result += 1;
        } else if (height !== 9) { // Nine can never be a low point
          if (
            (colIndex === 0 || row[colIndex - 1] > height) // Left position
            && (colIndex === row.length - 1 || row[colIndex + 1] > height) // Right position
            && (rowIndex === 0 || heightMap[rowIndex - 1][colIndex] > height) // Top position
            && (rowIndex === heightMap.length - 1 || heightMap[rowIndex + 1][colIndex] > height) // Bottom position
          ) {
            result += height + 1;
          }
        }
      });

      return result;
    }, 0);

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    // Duplicate the height map to track visited locations
    const visitedMap = Array.from(heightMap);
    const basinSizes = [];

    // Loop through the map, location by location
    for (let row = 0; row < heightMap.length; row++) {
      for (let col = 0; col < heightMap[0].length; col++) {
        // Start searching for a basin
        const basinSize = search(heightMap, visitedMap, row, col, 0);

        // If we found a basin, add it to the array
        if (basinSize > 0) basinSizes.push(basinSize);
      }
    }

    // Sort the basins in descending order
    basinSizes.sort((a, b) => b - a);

    const part2Answer = basinSizes[0] * basinSizes[1] * basinSizes[2];

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
