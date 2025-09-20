export function boxCollision({ box1, box2 }) {
  // console.log(box1.position.x <= box2.position.x + box2.width)

  return (
    box1.position.x + box1.width >= box2.position.x &&
    box1.position.x <= box2.position.x + box2.width &&
    box1.position.y + box1.height >= box2.position.y &&
    box1.position.y <= box2.position.y + box2.height
  )
}

export function circleRectCollision(circle, rect) {
  // Find the nearest x and y on the rectangle to the circle's center
  const nearestX = Math.max(
    rect.position.x,
    Math.min(circle.position.x, rect.position.x + rect.width),
  )
  const nearestY = Math.max(
    rect.position.y,
    Math.min(circle.position.y, rect.position.y + rect.height),
  )

  // Determine the distance from the circle's center to this nearest point
  const deltaX = circle.position.x - nearestX
  const deltaY = circle.position.y - nearestY

  // If the distance is less than the circle's radius, they are colliding
  return deltaX * deltaX + deltaY * deltaY <= circle.radius * circle.radius
}

export function circleRectCollisionResponse(circle, rect) {
  // Find the nearest x and y on the rectangle to the circle's center
  const nearestX = Math.max(
    rect.position.x,
    Math.min(circle.position.x, rect.position.x + rect.width),
  )
  const nearestY = Math.max(
    rect.position.y,
    Math.min(circle.position.y, rect.position.y + rect.height),
  )

  // Determine the distance from the circle's center to this nearest point
  const deltaX = circle.position.x - nearestX
  const deltaY = circle.position.y - nearestY
  const distanceSquared = deltaX * deltaX + deltaY * deltaY

  let collisionSide = null // Variable to store the collision side

  // If the distance is less than the circle's radius, they are colliding
  if (distanceSquared <= circle.radius * circle.radius) {
    // Calculate the overlap distance between circle and rectangle
    const overlap = circle.radius - Math.sqrt(distanceSquared)

    // Correct the circle's position based on which side it collided with
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      circle.position.x += deltaX > 0 ? overlap : -overlap
      collisionSide = deltaX > 0 ? 'right' : 'left'
    } else {
      circle.position.y += deltaY > 0 ? overlap : -overlap
      collisionSide = deltaY > 0 ? 'bottom' : 'top'
    }
  }

  return collisionSide // Returns the side of the rectangle the circle collided with or null if no collision
}
