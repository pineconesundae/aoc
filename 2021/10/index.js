const { request } = require('../util/request');

request(10).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const code = data.split('\n')
      .filter((x) => x);

    const openers = ['(', '{', '[', '<'];
    const closers = [')', '}', ']', '>'];

    const invalidScores = {
      ')': 3,
      ']': 57,
      '}': 1197,
      '>': 25137
    };

    const completionScores = {
      '(': 1,
      '[': 2,
      '{': 3,
      '<': 4
    };

    // ---- PART 1 ----

    const part1Answer = code.reduce((result, line) => {
      const stack = [];

      // Loop through each character in the line
      for (let index = 0; index < line.length; index++) {
        const char = line[index];

        // If it's an opener, push it onto the stack
        if (openers.includes(char)) {
          stack.push(char);
        } else {
          // If it's not an opener, we need to find if it is a valid closer
          const closerIndex = closers.findIndex((closer) => closer === char);
          const opener = openers[closerIndex];

          // Grab the last character off the current stack
          const lastChar = stack.pop();

          // If the last character is not the opener that matches the closer,
          // we have a corrupted line
          if (lastChar !== opener) {
            // Calculate the score based on the invalid character
            const score = invalidScores[char];
            result += score;
            break;
          }
        }
      }

      return result;
    }, 0);

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    // Same tactic in Part 2, except we only care about the finished state
    // of the non-corrupted lines
    const scores = [];
    code.filter((line) => {
      let lineScore = 0;
      const stack = [];

      for (let index = 0; index < line.length; index++) {
        const char = line[index];

        // Use the same logic to calculate the stack
        if (openers.includes(char)) {
          stack.push(char);
        } else {
          const closerIndex = closers.findIndex((closer) => closer === char);
          const opener = openers[closerIndex];

          const lastChar = stack.pop();

          // This time, since we don't care about corrupted lines, we can just
          // return false to short-circuit out of the current filter loop
          if (lastChar !== opener) {
            return false;
          }
        }
      }

      // If we make it to here, we have a valid line, so we need to calculate
      // the score to close out the clusters

      // Loop through the stack, which now only contains the openers that were
      // never closed
      while (stack.length > 0) {
        const opener = stack.pop();
        // Based on whatever opener it is, tally up the score
        lineScore = (lineScore * 5) + completionScores[opener];
      }

      // Add the line score to our array of all line scores
      scores.push(lineScore);

      return true;
    });

    // Sort all the scores and find the median
    scores.sort((a, b) => b - a);
    const part2Answer = scores[Math.floor(scores.length / 2)];

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
