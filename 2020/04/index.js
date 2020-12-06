const { request } = require('../util/request');

const validateField = (field, value) => {
  if (field === 'byr') {
    const valid = RegExp(/^\d{4}$/).test(value);
    const num = parseInt(value);
    return (valid && value.length === 4 && num >= 1920 && num <= 2002);
  } else if (field === 'iyr') {
    const valid = RegExp(/^\d{4}$/).test(value);
    const num = parseInt(value);
    return (valid && value.length === 4 && num >= 2010 && num <= 2020);
  } else if (field === 'eyr') {
    const valid = RegExp(/^\d{4}$/).test(value);
    const num = parseInt(value);
    return (valid && value.length === 4 && num >= 2020 && num <= 2030);
  } else if (field === 'hgt') {
    const validFormat = RegExp(/^\d+(cm|in)$/).test(value);
    if (validFormat) {
      const num = parseInt(value.match(/\d+/));
      const [unit] = value.match(/(cm|in)/);

      return (unit === 'cm')
        ? (num >= 150 && num <= 193)
        : (num >= 59 && num <= 76);
    } else {
      return false;
    }
  } else if (field === 'hcl') {
    return RegExp(/^#[0-9a-f]{6}$/).test(value);
  } else if (field === 'ecl') {
    return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
  } else if (field === 'pid') {
    return RegExp(/^\d{9}$/).test(value);
  } else {
    return true;
  }
}

request(4).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    let passport = {};
    let result1 = 0;
    let result2 = 0;

    data.split('\n').forEach((line) => {
      if (!line) {
        if (
          passport.byr && passport.iyr && passport.eyr && passport.hgt
          && passport.hcl && passport.ecl && passport.pid
        ) {
          result1++;

          if (Object.entries(passport).every(([field, value]) => {
            const result = validateField(field, value);
            return result;
          })) {
            result2++;
          }
        }

        passport = {};
        return;
      } else {
        line.split(' ').forEach((attr) => {
          const [key, value] = attr.split(':');

          if (key && value) {
            passport[key] = value;
          }
        })
      }
    }, 0);

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
