const { request } = require('../util/request');

function crt(num, rem) {
  let sum = 0;
  const prod = num.reduce((a, c) => a * c, 1);

  for (let i = 0; i < num.length; i++) {
    const [ni, ri] = [num[i], rem[i]];
    const p = Math.floor(prod / ni);
    sum += ri * p * mulInv(p, ni);
  }
  return sum % prod;
}

function mulInv(a, b) {
  const b0 = b;
  let [x0, x1] = [0, 1];

  if (b === 1) {
    return 1;
  }
  while (a > 1) {
    const q = Math.floor(a / b);
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
}

request(13).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const [timestampStr, schedule] = data.split('\n').filter((item) => item);
    const timestamp = parseInt(timestampStr);
    const busIds = schedule.split(',').filter((id) => id !== 'x').map((id) => parseInt(id));

    const result = busIds.reduce((result, id) => {
      const waitTime = id - (timestamp % id);

      return waitTime < result.waitTime
        ? { id, waitTime }
        : result;
    }, { id: 0, waitTime: 9999999 });

    // Part 2
    // 0 mod 7
    // 1 mod 13
    // 4 mod 59
    // 6 mod 31
    // 7 mod 19
    // N = 7 x 13 x 59 x 31 x 19 = 3162341
    /*
     7 0 3162341/7  = 451763u === 1 mod  7 => u = 
    13 1 3162341/13 = 243257v === 1 mod 13 => v = 
    59 4 3162341/59 =  53599w === 1 mod 59 => w = 
    31 6 3162341/31 = 102011x === 1 mod 31 => x = 
    19 7 3162341/19 = 166439y === 1 mod 19 => y = 

    451763 = 7(64537) + 4
    7 = 4(1) + 3
    4 = 3(1) + 1
    3 = 1(3) + 0
    */

    const result1 = result.id * result.waitTime;

    console.log(crt([7, 13, 59, 31, 19], [0, 12, 55, 25, 12]));
    console.log(crt([17, 13, 19], [0, 11, 16]));
    console.log(crt([1789, 37, 47, 1889], [0, 36, 45, 1886]));

    console.log(`The answer to part 1 is ${result1}`);
    // console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
