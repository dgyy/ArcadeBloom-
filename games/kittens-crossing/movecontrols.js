AFRAME.registerComponent('movecontrols', {
  schema: { type: 'selector' },

  init: function () {
    let data = this.data;
    this.thumbdirection = 0;
    this.clock = new THREE.Clock();
    this.smoothMove = { x: 0, z: 0 };
    this.smoothRotate = 0;
    this.localKeys = {};

    this.attachEventListeners();
  },

  tick: function (time, timeDelta) {
    // Smooth move
    let speedX = this.smoothMove.x;
    let speedZ = this.smoothMove.z;

    // 0.6 means towards the rim of the track pad
    // 4 Units a second, max 0.25 unit per frame (in case of low frame rates)
    // Use both thumbsticks at the same time to run
    let delta = timeDelta / 1000;
    speedX = (speedX < -0.6 || speedX > 0.6) ? Math.min(delta * 4, 0.25) * Math.sign(speedX) : 0;
    speedZ = (speedZ < -0.6 || speedZ > 0.6) ? Math.min(delta * 4, 0.25) * Math.sign(speedZ) : 0;

    if (speedX !== 0 || speedZ !== 0) {
      let position = this.data.object3D.position.clone();
      let direction = this.data.object3D.rotation.y;
      position.x += Math.cos(direction) * speedX + Math.sin(direction) * speedZ;
      position.z += -Math.sin(direction) * speedX + Math.cos(direction) * speedZ;
      this.data.object3D.position.x = position.x;
      this.data.object3D.position.z = position.z;
    }

    let rotate = this.smoothRotate;
    rotate = (rotate < -0.6 || rotate > 0.6) ? Math.min(delta * 2, 0.25) * Math.sign(rotate) : 0;
    this.data.object3D.rotation.y -= rotate;
  },

  ///////////////////////////////////////////////////////
  play: function () {
    this.attachEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  remove: function () {
    this.pause();
  },

  attachEventListeners: function () {
    this.el.addEventListener("thumbstickmoved", this.thumbstickMoved.bind(this));
    if (this.el.id.includes('left')) {
      window.addEventListener("keydown", this.onKeyDown.bind(this));
      window.addEventListener("keyup", this.onKeyUp.bind(this));
    }
    window.addEventListener("blur", this.onBlur.bind(this));
  },

  removeEventListeners: function () {
    this.el.removeEventListener("thumbstickmoved", this.thumbstickMoved);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  },

  thumbstickMoved: function (event) {
    this.smoothRotate = event.detail.x;
    this.smoothMove.z = event.detail.y;
  },

  onKeyDown: function (event) {
    if (AFRAME.utils.shouldCaptureKeyEvent(event)) {
      if (event.code === "KeyW" || event.code === "ArrowUp") { this.smoothMove.z = -1; }
      if (event.code === "KeyA" || event.code === "ArrowLeft") { this.smoothRotate = -1; }
      if (event.code === "KeyS" || event.code === "ArrowDown") { this.smoothMove.z = +1; }
      if (event.code === "KeyD" || event.code === "ArrowRight") { this.smoothRotate = +1; }
      this.emit(event);
    }
  },

  onKeyUp: function (event) {
    if (AFRAME.utils.shouldCaptureKeyEvent(event)) {
      if (event.code === "KeyW" || event.code === "ArrowUp") { this.smoothMove.z = 0; }
      if (event.code === "KeyA" || event.code === "ArrowLeft") { this.smoothRotate = 0; }
      if (event.code === "KeyS" || event.code === "ArrowDown") { this.smoothMove.z = 0; }
      if (event.code === "KeyD" || event.code === "ArrowRight") { this.smoothRotate = 0; }
      this.emit(event);
    }
  },

  onBlur: function () {
    for (let code in this.localKeys) {
      if (this.localKeys.hasOwnProperty(code)) {
        delete this.localKeys[code];
      }
    }
  },

  emit: function (event) {
    // Emit convenience event, identifying key.
    this.el.emit(event.type + ':' + event.code, new window.KeyboardEvent(event.type, event));
  }
});
