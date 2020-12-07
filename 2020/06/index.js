const { request } = require('../util/request');

request(6).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const people = data.split('\n');
    let groupAnswers = {}
    let numInGroup = 0;

    const { result1, result2 } = people.reduce((total, answers) => {
      if (!answers) {
        const answeredQuestions = Object.keys(groupAnswers).length;
        total.result1 += answeredQuestions;

        const everyoneAnswered = Object.entries(groupAnswers).reduce((result, [question, numAnswered]) => {
          if (numAnswered === numInGroup) {
            result++;
          }

          return result;
        }, 0);
        total.result2 += everyoneAnswered;

        groupAnswers = {};
        numInGroup = 0;
      } else {
        const answeredQuestions = answers.match(/./g);
        answeredQuestions.forEach((answer) => {
          if (groupAnswers[answer]) {
            groupAnswers[answer]++;
          } else {
            groupAnswers[answer] = 1;
          }
        });

        numInGroup++;
      }

      return total;
    }, { result1: 0, result2: 0 });

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
