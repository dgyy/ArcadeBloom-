// usage: this.el.setAttribute('spray', '');
AFRAME.registerComponent('spray', {
  init: function () {
    this.COUNT = 100;
    this.positions = new Float32Array(this.COUNT * 3);
    for (let i = 0; i < this.COUNT; i++) {
      this.positions[i * 3 + 0] = (Math.random() - 0.5) / 2;
      this.positions[i * 3 + 1] = Math.random() / 2;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) / 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    const material = new THREE.PointsMaterial({ color: 'red', size: 0.05 });
    this.points = new THREE.Points(geometry, material);
    this.el.object3D.add(this.points);
    this.startTime = null;
  },
  tick: function (time) {
    this.startTime = this.startTime ?? time;
    const elapsed = time - this.startTime;
    const ratio = elapsed / 1000;
    const scale = 1 + 0.05 * (1 - ratio);
    for (let i = 0; i < this.COUNT; i++) {
      this.positions[i * 3 + 0] *= scale;
      this.positions[i * 3 + 1] *= scale;
      this.positions[i * 3 + 2] *= scale;
      this.positions[i * 3 + 1] -= 0.1 * ratio;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    if (ratio >= 1) {
      this.el.object3D.remove(this.points)
      this.el.removeAttribute('spray');
    }
  }
});

