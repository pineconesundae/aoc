const axios = require('axios').default;
const { session } = require('./session');

function request(day) {
  return axios.get(`https://adventofcode.com/2020/day/${day}/input`, {
    headers: {
      Cookie: `session=${session}`
    }
  });
}

module.exports = { request };