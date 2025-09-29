"use strict";

AFRAME.registerComponent('avoidbuildings', {
  schema: {
    radius: { default: 1 },  // objects fit through openings 2 voxels wide
    preservePosition: { default:false } 
  },

  init: function () {
    this.originalPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.lastPosition = new THREE.Vector3();

    this.originalPosition.copy(this.el.object3D.position)
    this.el.object3D.getWorldPosition(this.lastPosition);
  },

  tick: function (time, timeDelta) {
    this.checkAndUpdatePosition();
  },

  checkAndUpdatePosition: function () {
    if (this.data.preservePosition) {
      this.el.object3D.position.lerp(this.originalPosition, 0.05);
    }

    // Get the current world position
    this.el.object3D.getWorldPosition(this.currentPosition);
    
    this.currentPosition.multiplyScalar(2); // City scale is 0.5 per voxel
    this.currentPosition.x += ((City.CENTER + 0.5) * City.BLOCK);
    this.currentPosition.z += ((City.CENTER + 0.5) * City.BLOCK);

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const radius = this.data.radius;

    const currentX = Math.floor(this.currentPosition.x);
    const currentZ = Math.floor(this.currentPosition.z);

    if (City.voxels.getVoxel(currentX, 2, currentZ)) {
      // Inside a building, snap back to the last known good position
      // Convert the last position from world space back to local space
      this.el.object3D.parent.worldToLocal(this.lastPosition);
      this.el.object3D.position.copy(this.lastPosition);
      return;
    } else {
      // Keep your distance from buildings by moving away, closest collision first
      for (let count = 0; count < 8; count++) {

        let minDistanceX = Number.MAX_VALUE;
        let minDistanceZ = Number.MAX_VALUE;
        let minDistance = Number.MAX_VALUE;

        // Iterate through the relevant cells to check for the nearest collision
        for (let voxelZ = Math.floor(currentZ - radius - 1); voxelZ <= Math.floor(currentZ + radius + 1); voxelZ++) {
          for (let voxelX = Math.floor(currentX - radius - 1); voxelX <= Math.floor(currentX + radius + 1); voxelX++) {

            // Check if the voxel is set (i.e. we are close to a building)
            if (City.voxels.getVoxel(voxelX, 2, voxelZ)) {

              // Find the closest point on the cell's boundary to the circle's center.
              const closestX = clamp(this.currentPosition.x, voxelX, voxelX + 1);
              const closestZ = clamp(this.currentPosition.z, voxelZ, voxelZ + 1);

              // Calculate the distance vector from the closest point to the circle's center.
              const distanceX = this.currentPosition.x - closestX;
              const distanceZ = this.currentPosition.z - closestZ;
              const distance = Math.sqrt(distanceX ** 2 + distanceZ ** 2);
              
              // Check if we are closer than the radius
              if (distance < radius && distance < minDistance && distance > 0) {
                minDistanceX = distanceX;
                minDistanceZ = distanceZ;
                minDistance = distance;
              }
            }
          }
        }

        if (minDistance > radius) {
          // No (further) collisions, so stop pushing back
          break;
        } else {
          // Calculate and apply the pushback vector to resolve the collision.
          const overlap = radius - minDistance;
          const pushbackX = (minDistanceX / minDistance) * overlap;
          const pushbackY = (minDistanceZ / minDistance) * overlap;
          this.currentPosition.x += pushbackX;
          this.currentPosition.z += pushbackY;
        }
      }
    }
    this.currentPosition.x -= ((City.CENTER + 0.5) * City.BLOCK);
    this.currentPosition.z -= ((City.CENTER + 0.5) * City.BLOCK);
    this.currentPosition.multiplyScalar(0.5);
    
    // Set the new position using a temporary vector
    let newLocalPosition = new THREE.Vector3().copy(this.currentPosition);
    this.el.object3D.parent.worldToLocal(newLocalPosition);
    this.el.object3D.position.copy(newLocalPosition);

    // Save the new world position for the next tick
    this.el.object3D.getWorldPosition(this.lastPosition);
  }
});