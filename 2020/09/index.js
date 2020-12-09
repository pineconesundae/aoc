const { request } = require('../util/request');

const findWeakness = (nums) => {
  try {
    nums.forEach((num, index) => {
      const sums = new Set();

      for (let count = index; count < index + 25; count++) {
        for (let count2 = count + 1; count2 < index + 25; count2++) {
          sums.add(nums[count] + nums[count2]);
        }
      }

      if (!sums.has(nums[index + 25])) {
        throw nums[index + 25];
      }
    });
  } catch (result1) {
    return result1;
  }

  return -1;
}

request(9).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const nums = data.split('\n').filter((num) => num).map((num) => parseInt(num));

    const result1 = findWeakness(nums);
    console.log(`The answer to part 1 is ${result1}`);

    try {
      nums.forEach((num, index) => {
        let acc = num;
        let inc = 0;

        while (acc < result1) {
          inc++;
          acc += nums[index + inc];
        }

        if (acc === result1) {
          const goodBois = nums.slice(index, index + inc + 1);
          goodBois.sort((a, b) => a - b);
          throw (goodBois[0] + goodBois[goodBois.length - 1]);
        }
      });
    } catch (result2) {
      console.log(`The answer to part 2 is ${result2}`);
    }
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
