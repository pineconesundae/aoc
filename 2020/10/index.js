const { request } = require('../util/request');

request(10).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const adapters = data.split('\n').filter((adapter) => adapter).map((adapter) => parseInt(adapter)).sort((a, b) => a - b);

    const differences = adapters.reduce((result, adapter, index) => {
      if (index + 1 === adapters.length) {
        result.three += 1; // The final jump has a joltage of 3
      } else {
        const difference = adapters[index + 1] - adapter;
        const key = difference === 1 ? 'one' : (difference === 2 ? 'two' : 'three');
        result[key] += 1;
      }

      return result;
    }, {
      one: 1, // Start with 1 here because of the initial joltage jump from the base
      two: 0,
      three: 0
    });

    adapters.reverse().push(0); // Add 0 onto the end to account for the 0 joltage outlet
    const connections = {
      0: 1
    };

    const result1 = differences.one * differences.three;

    const result2 = adapters.reduce((result, adapter, index) => {
      let count = 1;
      let numConnections = 0;

      while (index - count > -1 && count < 4) {
        const diff = adapters[index - count] - adapters[index];
        if (diff < 4) {
          numConnections += connections[index - count];
        }
        count++;
      }

      if (numConnections > 0) {
        connections[index] = numConnections;
      }

      result = connections[index];

      return result;
    }, 0);

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
