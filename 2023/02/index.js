const { request } = require('../util/request');

request(2).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // *** DATA PREP ***

    const input = data
      .split('\n')
      .filter((line) => line)
      .map((line) => {
        const rolls = line.split(': ')[1];
        const pulls = rolls.split('; ').map((pull) => {
          const colors = pull.split(', ');
          const formatted = colors.reduce((result, color) => {
            const [number, colorName] = color.split(' ');
            result[colorName] = parseInt(number);
            return result;
          }, {});

          return formatted;
        });

        return pulls;
      });

    const limits = {
      red: 12,
      green: 13,
      blue: 14
    };

    // *** PART ONE ***

    const partOneAnswer = input.reduce((result, pulls, index) => {
      let invalid = false;

      pulls.forEach((pull) => {
        invalid = invalid
          || pull.red > limits.red
          || pull.green > limits.green
          || pull.blue > limits.blue;
      });

      if (!invalid) result += index + 1;

      return result;
    }, 0);

    console.log(partOneAnswer);

    // *** PART TWO ***

    const partTwoAnswer = input.reduce((result, pulls) => {
      const max = {
        red: 1,
        green: 1,
        blue: 1
      };

      pulls.forEach((pull) => {
        if (pull.red > max.red) max.red = pull.red;
        if (pull.green > max.green) max.green = pull.green;
        if (pull.blue > max.blue) max.blue = pull.blue;
      });

      const power = max.red * max.green * max.blue;

      return result + power;
    }, 0);

    console.log(partTwoAnswer);
  }
});
