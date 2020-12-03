const { request } = require('../util/request');

const result = request(2).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const result1 = data
      .split('\n')
      .filter((code) => code)
      .reduce((total, code) => {
        const [limits, given, password] = code.split(' ');
        const [min, max] = limits.split('-').map((limit) => parseInt(limit));
        const char = given[0];

        const count = (password.match(RegExp(char, 'g')) || []).length;

        if (count >= min && count <= max) {
          total++;
        }

        return total;
      }, 0);

    const result2 = data
      .split('\n')
      .filter((code) => code)
      .reduce((total, code) => {
        const [indices, given, password] = code.split(' ');
        const [index1, index2] = indices.split('-').map((limit) => parseInt(limit));
        const char = given[0];

        const char1 = password[index1 - 1];
        const char2 = password[index2 - 1];

        if ((char === char1 && char != char2) || (char !== char1 && char === char2)) {
          total++;
        }

        return total;
      }, 0);

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
