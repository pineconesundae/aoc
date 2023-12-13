const { request } = require('../util/request');

request(3).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // *** DATA PREP ***

    const input = data.split('\n').filter((line) => line);

    // *** PART ONE ***

    const xMax = input[0].length;
    const yMax = input.length;
    let x = 0;
    let y = 0;
    let collectNum = false;
    let isPart = false;
    let num = '';
    const partOneResults = {
      parts: [],
      nonParts: []
    };

    const checkPart = (xCheck, yCheck) => collectNum && (isPart || input[yCheck].at(xCheck).match(/[^0-9\.]/));

    while (y < yMax) {
      const char = input[y].at(x);

      if (char.match(/[0-9]/)) {
        collectNum = true;
        num += char;
      } else if (collectNum) {
        if (isPart) partOneResults.parts.push(parseInt(num));
        else partOneResults.nonParts.push(parseInt(num));

        collectNum = false;
        isPart = false;
        num = '';
      }

      if (x > 0) isPart = checkPart(x - 1, y);
      if (y > 0 && x > 0) isPart = checkPart(x - 1, y - 1);
      if (y > 0) isPart = checkPart(x, y - 1);
      if (y > 0 && x < xMax - 1) isPart = checkPart(x + 1, y - 1);
      if (y + 1 < yMax && x > 0) isPart = checkPart(x - 1, y + 1);
      if (y + 1 < yMax) isPart = checkPart(x, y + 1);
      if (y + 1 < yMax && x + 1 < xMax) isPart = checkPart(x + 1, y + 1);
      if (x + 1 < xMax) isPart = checkPart(x + 1, y);

      x++;
      if (x === xMax) {
        x = 0;
        y++;
      }
    }

    const partOneAnswer = partOneResults.parts.reduce((result, partNum) => {
      return result + partNum;
    }, 0);

    console.log(partOneAnswer);

    // *** PART TWO ***

    x = 0;
    y = 0;
    collectNum = false;
    num = '';
    let isGear = false;
    let gearCoords = '';
    const partTwoResults = {};

    const checkGear = (xCheck, yCheck) => {
      const maybeGear = input[yCheck].at(xCheck).match(/[*]/);
      if (collectNum && maybeGear && !gearCoords) {
        gearCoords = `${xCheck},${yCheck}`;
        isGear = true;
      }
    }

    while (y < yMax) {
      const char = input[y].at(x);

      if (char.match(/[0-9]/)) {
        collectNum = true;
        num += char;
      } else if (collectNum) {
        if (isGear) {
          if (partTwoResults[gearCoords]) partTwoResults[gearCoords].push(parseInt(num));
          else partTwoResults[gearCoords] = [parseInt(num)];
        }

        collectNum = false;
        isGear = false;
        gearCoords = '';
        num = '';
      }

      if (x > 0) isPart = checkGear(x - 1, y);
      if (y > 0 && x > 0) isPart = checkGear(x - 1, y - 1);
      if (y > 0) isPart = checkGear(x, y - 1);
      if (y > 0 && x < xMax - 1) isPart = checkGear(x + 1, y - 1);
      if (y + 1 < yMax && x > 0) isPart = checkGear(x - 1, y + 1);
      if (y + 1 < yMax) isPart = checkGear(x, y + 1);
      if (y + 1 < yMax && x + 1 < xMax) isPart = checkGear(x + 1, y + 1);
      if (x + 1 < xMax) isPart = checkGear(x + 1, y);

      x++;
      if (x === xMax) {
        x = 0;
        y++;
      }
    }

    const partTwoAnswer = Object.values(partTwoResults).reduce((result, gears) => {
      if (gears.length === 2) {
        const gearRatio = gears[0] * gears[1];
        result += gearRatio;
      }

      return result;
    }, 0);

    console.log(partTwoAnswer);
  }
});
