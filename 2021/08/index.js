const mean = require('lodash/mean');
const { request } = require('../util/request');

// Checks if all characters in the target are included in the base
const includesSegments = (base, target) => {
  return Array.from(target).every((digit) => base.includes(digit));
}

request(8).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const formattedData = data.split('\n')
      .filter((x) => x);

    // ---- DATA PREP ----

    const numbers = formattedData.reduce((result, line) => {
      const [input, output] = line.split(' | ');
      result.push({
        input: input.split(' '),
        output: output.split(' ')
      });
      return result;
    }, []);

    // ---- PART 1 ----

    const part1Answer = numbers.reduce((result, number) => {
      const uniqueSegments = number.output.filter((item) => [2, 3, 4, 7].includes(item.length));
      result += uniqueSegments.length;
      return result;
    }, 0);

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    const part2Answer = numbers.reduce((result, number) => {
      const { input, output } = number;

      // Sort each encoded digit so the characters are always in the same order
      const sortedInput = input.map((item) => Array.from(item).sort().join(''));
      const sortedOutput = output.map((item) => Array.from(item).sort().join(''));

      // 1, 4, 7, and 8 we can conclude immediately because they have unique numbers of segments
      const one = sortedInput.find((item) => item.length === 2);
      const four = sortedInput.find((item) => item.length === 4);
      const seven = sortedInput.find((item) => item.length === 3);
      const eight = sortedInput.find((item) => item.length === 7);

      // 9 has six segments and is the only one to also include all the segments in 4
      const nine = sortedInput.find((item) => item.length === 6 && includesSegments(item, four));

      // 0 has six segments and is the only one (besides 9) to include all the segments in 1
      const zero = sortedInput.find((item) => item.length === 6 && includesSegments(item, one) && item !== nine);

      // 6 is the only other one with six segments
      const six = sortedInput.find((item) => item.length === 6 && item !== zero && item !== nine);

      // 5 has five segments and is the only one to also be included entirely in the segments of 6
      const five = sortedInput.find((item) => item.length === 5 && includesSegments(six, item));

      // 3 has five segments and is the only one to include all the segments in 1
      const three = sortedInput.find((item) => item.length === 5 && includesSegments(item, one));

      // 2 is the only other one with five segments
      const two = sortedInput.find((item) => item.length === 5 && item !== three && item !== five);

      const codex = {
        [zero]: '0',
        [one]: '1',
        [two]: '2',
        [three]: '3',
        [four]: '4',
        [five]: '5',
        [six]: '6',
        [seven]: '7',
        [eight]: '8',
        [nine]: '9'
      };

      // Loop through the output and use the codex to put together the number string
      const outputStr = sortedOutput.reduce((resultStr, item) => {
        const digit = codex[item];
        resultStr += digit;
        return resultStr;
      }, '');

      // Turn the number string into a number and add it to the result
      const outputNum = parseInt(outputStr);
      result += outputNum;
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
