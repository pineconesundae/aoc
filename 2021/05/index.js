const { request } = require('../util/request');

request(5).then((response) => {
  const { data, status } = response;

  if (status === 200) {
    // --- DATA PREP ---

    const vents = data.split('\n')
      .filter((vent) => vent)
      .reduce((result, vent) => {
        const [start, end] = vent.split(' -> ');
        const [startX, startY] = start.split(',').map((point) => parseInt(point));
        const [endX, endY] = end.split(',').map((point) => parseInt(point));

        result.push({
          start: {
            x: startX,
            y: startY
          },
          end: {
            x: endX,
            y: endY
          }
        });

        return result;
      }, []);

    // ---- ANSWER CALCULATION ----

    const part1DangerZones = {};
    const part2DangerZones = {};

    vents.forEach((vent) => {
      const xDirection = vent.start.x > vent.end.x ? -1
        : vent.start.x < vent.end.x ? 1 : 0;
      const yDirection = vent.start.y > vent.end.y ? -1
        : vent.start.y < vent.end.y ? 1 : 0;

      let xPosition = vent.start.x;
      let yPosition = vent.start.y;

      while (xPosition !== vent.end.x || yPosition !== vent.end.y) {
        const ventKey = `${xPosition}|${yPosition}`;

        // For Part 1, we only want to use vents that are horizontal or vertical
        if (xDirection === 0 || yDirection === 0) {
          part1DangerZones[ventKey] = part1DangerZones[ventKey]
            ? part1DangerZones[ventKey] + 1
            : 1;
        }

        part2DangerZones[ventKey] = part2DangerZones[ventKey]
          ? part2DangerZones[ventKey] + 1
          : 1;

        xPosition += xDirection;
        yPosition += yDirection;
      }

      // The loop exits when the positions equal the end state, so we need
      // to do one more because the end point should be included
      const ventKey = `${vent.end.x}|${vent.end.y}`;
      if (xDirection === 0 || yDirection === 0) {
        part1DangerZones[ventKey] = part1DangerZones[ventKey]
          ? part1DangerZones[ventKey] + 1
          : 1;
      }

      part2DangerZones[ventKey] = part2DangerZones[ventKey]
        ? part2DangerZones[ventKey] + 1
        : 1;
    });

    const part1Answer = Object.values(part1DangerZones).filter((position) => position > 1).length;
    const part2Answer = Object.values(part2DangerZones).filter((position) => position > 1).length;

    console.log(`The answer to part 1 is ${part1Answer}`);
    console.log(`The answer to part 2 is ${part2Answer}`);
  } else {
    console.log('Something terrible has happened...', response);
  }

  console.log('All done!');
}).catch((err) => {
  console.log('Something terrible has happened...', err);
});
