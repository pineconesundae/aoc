const { request } = require('../util/request');

request(1).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const numbers = data.split('\n').filter((number) => number).map((number) => parseInt(number));

    let numIncreases = 0;

    numbers.forEach((number, index) => {
      if (index > 0) {
        if (numbers[index - 1] < number) numIncreases++;
      }
    });

    console.log(`The answer to part 1 is ${numIncreases}`);

    numIncreases = 0;

    numbers.forEach((number, index) => {
      if (index > 0 && index < numbers.length - 2) {
        const previousTripletSum = numbers[index - 1] + number + numbers[index + 1];
        const currentTripletSum = number + numbers[index + 1] + numbers[index + 2];

        if (currentTripletSum > previousTripletSum) numIncreases++;
      }
    });

    console.log(`The answer to part 2 is ${numIncreases}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
