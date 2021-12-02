const { request } = require('../util/request');

request(2).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const instructions = data.split('\n')
      .filter((instruction) => instruction)
      .map((instruction) => {
        const [command, strValue] = instruction.split(' ');
        const value = parseInt(strValue);

        return { command, value };
      });

    // ---- PART 1 ----

    let depth = 0;
    let position = 0;

    instructions.forEach(({ command, value }) => {
      switch (command) {
        case 'forward':
          position += value;
          break;
        case 'up':
          depth -= value;
          break;
        case 'down':
          depth += value;
          break;
      }
    });

    console.log(`The answer to part 1 is ${depth * position}`);

    // ---- PART 2 ----

    let aim = 0;
    depth = 0;
    position = 0;

    instructions.forEach(({ command, value }) => {
      switch (command) {
        case 'forward':
          position += value;
          depth += aim * value;
          break;
        case 'up':
          aim -= value;
          break;
        case 'down':
          aim += value;
          break;
      }
    });

    console.log(`The answer to part 2 is ${depth * position}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
