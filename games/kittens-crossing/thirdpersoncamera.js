AFRAME.registerComponent('third-person-camera', {
  // Component's properties.
  schema: {
      // Selector for the target entity to follow.
      target: { type: 'selector' },
      // The desired distance from the target.
      distance: { type: 'number', default: -1 },
      // How fast the camera's rotation catches up to the target's rotation.
      rotationSpeed: { type: 'number', default: 0.05 }
  },

  // Initialization function. Called once when the component is first attached.
  init: function () {
      this.targetEl = null; // Will store a reference to the target entity.

      // Get the target entity from the schema data.
      this.targetEl = this.data.target;

      // If the target element is not found, log a warning and return.
      if (!this.targetEl) {
          console.warn('Missing 3rd person target');
          return;
      }

      // We will store the last position and rotation to prevent jitter.
      this.lastPosition = new THREE.Vector3();
      this.lastRotation = new THREE.Vector3();
  },

  // The tick function runs on every animation frame.
  tick: function () {
    if (!this.targetEl) {
        return;
    }

    // Get the target's world position and rotation in world space.
    const targetWorldPosition = this.targetEl.object3D.position;
    
    // Calculate the camera's target position.
    const targetPosition = new THREE.Vector3(
        targetWorldPosition.x,
        targetWorldPosition.y + 0, //this.data.height,
        targetWorldPosition.z
    );
    
    // Apply an offset to the target position to move the camera back.
    const offset = new THREE.Vector3(0, 0, this.data.distance);
    const yRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.targetEl.object3D.rotation.y, 0));
    offset.applyQuaternion(yRotationQuaternion);
    targetPosition.sub(offset);

    // Interpolate the camera rig's position.
    let distance = this.el.object3D.position.distanceTo(targetPosition);
    if (distance > Math.abs(this.data.distance)*2) // In case the camera gets stuck and can't follow anymore
      this.el.object3D.position.copy(targetPosition);
    else
      this.el.object3D.position.lerp(targetPosition, 0.1);

    // Slerp the camera rig's quaternion to the target quaternion for smooth rotation.
    this.el.object3D.quaternion.slerp(
        yRotationQuaternion,
        this.data.rotationSpeed
    );
  },

  // Remove event listeners when the component is detached.
  remove: function () {
      this.targetEl = null;
  }
});