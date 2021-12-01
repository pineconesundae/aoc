const { request } = require('../util/request');

request(14).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const program = data.split('\n').filter((cmd) => cmd);
    let mask;

    const memory = program.reduce((result, cmd) => {
      const [command, , value] = cmd.split(' ');

      if (command.substr(0, 3) === 'mas') {
        mask = value.reverse(); // ???
      } else {

      }
    }, []);

    // console.log(`The answer to part 1 is ${result1}`);
    // console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
