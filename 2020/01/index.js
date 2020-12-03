const { request } = require('../util/request');

const result = request(1).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const numbers = data.split('\n').filter((number) => number).map((number) => parseInt(number));

    numbers.forEach((number1) => {
      numbers.forEach((number2) => {
        const sum = number1 + number2;

        if (sum === 2020) {
          console.log(`The answer to part 1 is ${number1 * number2}`);
        }
      });
    });

    numbers.forEach((number1) => {
      numbers.forEach((number2) => {
        numbers.forEach((number3) => {
          const sum = number1 + number2 + number3;

          if (sum === 2020) {
            console.log(`The answer to part 2 is ${number1 * number2 * number3}`);
          }
        });
      });
    });
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
