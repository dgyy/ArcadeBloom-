// https://edu-js-o.medium.com/test-collision-with-separating-axis-theorem-in-javascript-8456d1c92b6c
// https://www.youtube.com/watch?v=-EsWKT7Doww&t=1340s

// Helper function to check for overlap between projections
function overlap(projection1, projection2) {
  return projection1.max > projection2.min && projection2.max > projection1.min;
}

// Helper function to get the overlap amount
function getOverlap(projection1, projection2) {
  return Math.min(projection1.max - projection2.min, projection2.max - projection1.min);
}

export function calculateSeparation(ball, wall) {
  let smallestOverlap = Number.POSITIVE_INFINITY;
  let mtvAxis = null;
  let vertexClosestToBall = null;

  // Check polygon axes for separation
  // for (const normal of wall.normals) {
  for (let i = 0; i < wall.normals.length; i++) {
    const normal = wall.normals[i];
    const projection1 = wall.project(normal);
    const projection2 = ball.project(normal);

    if (!overlap(projection1, projection2)) {
      return null; // No collision
    } else {
      const o = getOverlap(projection1, projection2);
      if (o < smallestOverlap) {
        smallestOverlap = o;
        mtvAxis = normal;
        vertexClosestToBall = wall.vertices[i];
      }
    }
  }

  // Check the axis for the ball center to polygon vertices
  for (const vertex of wall.vertices) {
    const axis = { x: ball.pos.x - vertex.x, y: ball.pos.y - vertex.y };
    const length = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
    if (length === 0) continue; // Avoid division by zero

    axis.x /= length;
    axis.y /= length;

    const projection1 = wall.project(axis);
    const projection2 = ball.project(axis);

    if (!overlap(projection1, projection2)) {
      return null; // No collision
    } else {
      const o = getOverlap(projection1, projection2);
      if (o < smallestOverlap) {
        smallestOverlap = o;
        mtvAxis = axis;
        vertexClosestToBall = vertex;
      }
    }
  }

  if (smallestOverlap === Number.POSITIVE_INFINITY) {
    return null; // No collision detected
  }
  
  // Make sure the MTV pushes the ball out of the wall, not deeper in.
  let d = {
    x: ball.pos.x - vertexClosestToBall.x,
    y: ball.pos.y - vertexClosestToBall.y
  };

  // Dot product to check the direction of the MTV
  if ((d.x * mtvAxis.x + d.y * mtvAxis.y) < 0) {
    mtvAxis.x = -mtvAxis.x;
    mtvAxis.y = -mtvAxis.y;
  }

  return {
    mtv: { x: mtvAxis.x * smallestOverlap, y: mtvAxis.y * smallestOverlap },
    axis: mtvAxis
  };
}