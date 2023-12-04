const { request } = require('../util/request');
const zip = require('lodash/zip');
const cloneDeep = require('lodash/cloneDeep');

request(14).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // ---- DATA PREP ----

    const [template, ...ruleStrs] = data.split('\n')
      .filter((x) => x);

    const rules = ruleStrs.reduce((result, rule) => {
      const [pair, element] = rule.split(' -> ');
      result[pair] = element;
      return result;
    }, {});

    // ---- PART 1 ----

    let step = 0;
    let updatedTemplate = template;

    while (step < 10) {
      let optimalPolymer = updatedTemplate[0];
      let position = 0;

      while (position < updatedTemplate.length - 1) {
        const polymer = updatedTemplate.slice(position, position + 2);
        const elementToAdd = rules[polymer];
        optimalPolymer += elementToAdd + polymer[1];

        position++;
      }

      updatedTemplate = optimalPolymer;

      step++;
    }

    let counts = {};
    for (let count = 0; count < updatedTemplate.length; count++) {
      const element = updatedTemplate[count];

      if (counts[element]) counts[element]++;
      else counts[element] = 1;
    }

    const maxCount = Math.max(...Object.values(counts));
    const minCount = Math.min(...Object.values(counts));
    const part1Answer = maxCount - minCount;

    console.log(`The answer to part 1 is ${part1Answer}`);

    // ---- PART 2 ----

    // Can't do the same solution as above - stack overflow!

    step = 0;
    polymers = {};

    let position = 0;
    while (position < template.length - 1) {
      const polymer = template.slice(position, position + 2);

      if (polymers[polymer]) polymers[polymer]++;
      else polymers[polymer] = 1;

      position++;
    }

    while (step < 40) {
      const nextPolymers = {};
      counts = {}
      counts[template[0]] = 1;

      Object.entries(polymers).forEach(([polymer, amount]) => {
        const elementToAdd = rules[polymer];
        const [firstElement, secondElement] = polymer;

        [`${firstElement}${elementToAdd}`, `${elementToAdd}${secondElement}`].forEach((newPolymer) => {
          if (nextPolymers[newPolymer]) nextPolymers[newPolymer] += amount;
          else nextPolymers[newPolymer] = amount;
        });

        if (counts[elementToAdd]) counts[elementToAdd] += amount;
        else counts[elementToAdd] = amount;

        if (counts[secondElement]) counts[secondElement] += amount;
        else counts[secondElement] = amount;
      });

      polymers = cloneDeep(nextPolymers);

      step++;
    }

    const maxCount2 = Math.max(...Object.values(counts));
    const minCount2 = Math.min(...Object.values(counts));
    const part2Answer = maxCount2 - minCount2;

    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
