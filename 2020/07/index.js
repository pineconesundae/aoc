const { request } = require('../util/request');

const unpackBags = (rules, color, bags) => {
  const bag = rules[color];

  if (bag) {
    rules[color].forEach((containerColor) => {
      bags.add(containerColor);

      unpackBags(rules, containerColor, bags);
    });
  }

  return bags;
}

const packBags = (rules, color, numBagsPerLevel, total) => {
  const containees = rules[color];

  if (containees) {
    Object.entries(containees).forEach(([containeeColor, num]) => {
      total = packBags(rules, containeeColor, num * numBagsPerLevel, total + (num * numBagsPerLevel));
    });
  }

  return total;
}

request(7).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const rules = data.split('\n').filter((rule) => rule);

    const { bottomUp, topDown } = rules.reduce((result, rule) => {
      const [container, containees] = rule.split(' contain ');

      const [containerColor] = container.match(/.+?(?=bag)/).map((val) => val.trim());
      containees.split(', ').forEach((containee) => {
        let { groups: { num, containeeColor } } = containee.match(/(?<num>\d+|no)(?<containeeColor>.+?(?=bag))/);
        containeeColor = containeeColor.trim();

        if (num !== 'no') {
          // maps bags to the bags that can hold it
          if (result.bottomUp[containeeColor]) {
            if (!result.bottomUp[containeeColor].includes(containerColor)) {
              result.bottomUp[containeeColor].push(containerColor);
            }
          } else {
            result.bottomUp[containeeColor] = [containerColor];
          }

          // maps bags to the bags they hold
          if (result.topDown[containerColor]) {
            Object.assign(result.topDown[containerColor], { [containeeColor]: num });
          } else {
            result.topDown[containerColor] = { [containeeColor]: num };
          }
        }
      });

      return result;
    }, { bottomUp: {}, topDown: {} })

    const result1 = unpackBags(bottomUp, 'shiny gold', new Set());
    const result2 = packBags(topDown, 'shiny gold', 1, 0);

    console.log(`The answer to part 1 is ${result1.size}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
