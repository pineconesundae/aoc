const { request } = require('../util/request');

const calculateTrees = (map, rightSlope, downSlope) => {
  const width = map[0].length;
  const height = map.length;
  let x = 0;
  let y = 0;
  let result = 0;

  while (y < height - 1) {
    x += rightSlope;
    y += downSlope;

    if (x > (width - 1)) {
      x -= width;
    }

    if (map[y][x] === '#') {
      result++;
    }
  }

  return result;
}

const result = request(3).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const map = data.split('\n').filter((coord) => coord);

    const result1 = calculateTrees(map, 3, 1);

    const result2a = calculateTrees(map, 1, 1);
    const result2b = calculateTrees(map, 5, 1);
    const result2c = calculateTrees(map, 7, 1);
    const result2d = calculateTrees(map, 1, 2);
    const result2 = result1 * result2a * result2b * result2c * result2d;

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
