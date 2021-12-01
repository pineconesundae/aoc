const { request } = require('../util/request');

const DIRECTIONS = {
  N: { x: 0, y: 1, label: 'N' },
  E: { x: 1, y: 0, label: 'E' },
  S: { x: 0, y: -1, label: 'S' },
  W: { x: -1, y: 0, label: 'W' }
};

const leftRotations = {
  N: 'W',
  E: 'N',
  S: 'E',
  W: 'S'
};

const rightRotations = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N'
};

const rotateShip = (heading, rotationDirection, rotationAmount) => {
  const rotations = rotationDirection === 'L' ? leftRotations : rightRotations;
  const numRotations = rotationAmount / 90;
  let newHeading = Object.assign({}, heading);

  for (let count = 0; count < numRotations; count++) {
    newHeading = DIRECTIONS[rotations[newHeading.label]];
  }

  return newHeading;
};

const rotateWaypoint = (position, rotationDirection, rotationAmount) => {
  const rotation = rotationDirection === 'L' ? { x: -1, y: 1 } : { x: 1, y: -1 };
  const numRotations = rotationAmount / 90;
  let newPosition = Object.assign({}, position);

  for (let count = 0; count < numRotations; count++) {
    const copy = Object.assign({}, newPosition);
    newPosition = {
      x: copy.y * rotation.x,
      y: copy.x * rotation.y
    }
  }

  return newPosition;
};

request(12).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    const instructions = data.split('\n').filter((instr) => instr).map((instr) => {
      const { groups: { direction, distance } } = instr.match(/(?<direction>.)(?<distance>\d+)/);
      return {
        direction,
        distance: parseInt(distance)
      };
    });

    const position = {
      x: 0,
      y: 0
    };
    let shipDirection = DIRECTIONS.E;

    const newPosition1 = instructions.reduce((result, { direction, distance }) => {
      if (['R', 'L'].includes(direction)) {
        shipDirection = rotateShip(shipDirection, direction, distance);
      } else if (direction === 'F') {
        result.x += shipDirection.x * distance;
        result.y += shipDirection.y * distance;
      } else {
        const travelSlope = DIRECTIONS[direction];

        result.x += travelSlope.x * distance;
        result.y += travelSlope.y * distance;
      }

      return result;
    }, Object.assign({}, position));

    let waypointPosition = {
      x: 10,
      y: 1,
      direction: DIRECTIONS.E
    };

    const newPosition2 = instructions.reduce((result, { direction, distance }) => {
      if (['R', 'L'].includes(direction)) {
        waypointPosition = rotateWaypoint(waypointPosition, direction, distance);
      } else if (direction === 'F') {
        result.x += distance * waypointPosition.x;
        result.y += distance * waypointPosition.y;
      } else {
        const travelSlope = DIRECTIONS[direction];

        waypointPosition.x += travelSlope.x * distance;
        waypointPosition.y += travelSlope.y * distance;
      }

      return result;
    }, Object.assign({}, position));

    const result1 = Math.abs(newPosition1.x) + Math.abs(newPosition1.y);
    const result2 = Math.abs(newPosition2.x) + Math.abs(newPosition2.y);

    console.log(`The answer to part 1 is ${result1}`);
    console.log(`The answer to part 2 is ${result2}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
});
