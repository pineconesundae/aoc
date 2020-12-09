const { request } = require('../util/request');

request(8).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const program = data.split('\n').filter((line) => line);
    let indices = [];
    let result1 = 0;
    let index = 0;

    while (true) {
      if (indices.includes(index)) {
        break;
      } else {
        indices.push(index);
      }

      const line = program[index];
      const instr = line.substring(0, 3);
      const direction = line.substring(4, 5);
      const value = line.substring(5);

      if (instr === 'acc') {
        if (direction === '+') {
          result1 += parseInt(value);
        } else {
          result1 -= parseInt(value);
        }

        index++;
      } else if (instr === 'jmp') {
        if (direction === '+') {
          index += parseInt(value);
        } else {
          index -= parseInt(value);
        }
      } else {
        index++;
      }
    }

    index = 0;
    let result2 = 0;
    let onAnAdventure = false;
    let savePoint = {
      index: 0,
      result2: 0,
      newIndices: []
    };
    let newIndices = [];

    while (1) {
      if (index === program.length) {
        // If the index is one past the end of the array, we win
        break;
      } else if (index > program.length || newIndices.includes(index)) {
        // If we either go way over or we hit a place we've already been, revert to the save point
        ({ index, result2, indices: newIndices } = savePoint);
        onAnAdventure = false;
      }

      newIndices.push(index);

      const line = program[index];
      const instr = line.substring(0, 3);
      const direction = line.substring(4, 5);
      const value = parseInt(line.substring(5));

      if (instr === 'acc') {
        if (direction === '+') {
          result2 += value;
        } else {
          result2 -= value;
        }

        index++;
      } else if (instr === 'jmp') {
        // If we've already modified one line, just do normal jmp behavior
        if (onAnAdventure) {
          if (direction === '+') {
            index += value;
          } else {
            index -= value;
          }
        } else {
          // Otherwise, let's save our place and then do a nop instead
          const saveIndex = direction === '+' ? index + value : index - value;
          onAnAdventure = true;
          savePoint = Object.assign({}, {
            index: saveIndex,
            result2,
            indices: [...newIndices]
          });

          index++;
        }
      } else {
        // If we've already modified one line, just do normal nop behavior
        if (onAnAdventure) {
          index++;
        } else {
          // Otherwise, let's save our place and then do a jmp instead
          const saveIndex = index + 1;
          onAnAdventure = true;
          savePoint = Object.assign({}, {
            index: saveIndex,
            result2,
            indices: [...newIndices]
          });

          if (direction === '+') {
            index += value;
          } else {
            index -= value;
          }
        }
      }
    }

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
