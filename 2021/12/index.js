const { request } = require('../util/request');
const cloneDeep = require('lodash/cloneDeep');

// Recursively explores the connections at a node
const explorePart1 = (map, node, numPaths) => {
  // If we found the end, increment our paths
  if (node === 'end') {
    numPaths++;
  } else {
    // Deep clone the map so we don't mutate the visited prop
    const newMap = cloneDeep(map);
    newMap[node].visited = true;

    // Loop through the connections of the current node and explore them
    newMap[node].connections.forEach((connection) => {
      // We want to explore the node if it allows multiple visits or if
      // it hasn't been visited yet
      if (newMap[connection].multiple || !newMap[connection].visited) {
        numPaths = explorePart1(newMap, connection, numPaths);
      }
    });
  }

  return numPaths;
}

// Similar to Part 1, except includes an additional param that
// is a flag as to whether or not a small cave was already visited
// twice during the current path
const explorePart2 = (map, node, smallVisited, numPaths) => {
  if (node === 'end') {
    numPaths++;
  } else {
    const newMap = cloneDeep(map);
    newMap[node].visited = true;

    newMap[node].connections.forEach((connection) => {
      // The new logic here is we can explore the node if either...
      //  1) it allows multiple visits
      //  2) it hasn't been visited yet
      //  3) or a small cave hasn't been visited twice yet
      if (newMap[connection].multiple || !newMap[connection].visited || !smallVisited) {
        numPaths = explorePart2(
          newMap,
          connection,
          // This will flip smallVisited to true in the next recursion if we are
          // visiting a small cave that has already been visited
          (smallVisited || (!newMap[connection].multiple && newMap[connection].visited)),
          numPaths
        );
      }
    });
  }

  return numPaths;
}

request(12).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const map = data.split('\n')
      .filter((x) => x)
      .reduce((result, connection) => {
        const [a, b] = connection.split('-');

        // Skip adding start as a connection to other things
        if (b !== 'start') {
          // If we already have seen this node, add the new connection to it
          if (result[a]) {
            result[a].connections.push(b);
          } else {
            // Check if it is all uppercase - if so, that means this cave can
            // be visited multiple times
            const multiple = /[A-Z]/.test(a);

            result[a] = {
              connections: [b],
              visited: a === 'start', // Start is visited by default
              multiple
            };
          }
        }

        // Same as above, but going in reverse since connections are two-way
        if (a !== 'start') {
          if (result[b]) {
            result[b].connections.push(a);
          } else {
            const multiple = /[A-Z]/.test(b);

            result[b] = {
              connections: [a],
              visited: b === 'start',
              multiple
            };
          }
        }

        return result;
      }, {});

    const { start } = map;

    // ---- PART 1 ----

    const part1Answer = start.connections.reduce((result, connection) => {
      result += explorePart1(map, connection, 0);
      return result;
    }, 0);

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    const part2Answer = start.connections.reduce((result, connection) => {
      result += explorePart2(map, connection, false, 0);
      return result;
    }, 0);

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
