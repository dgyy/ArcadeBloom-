AFRAME.registerComponent('kitten', {
  schema: {
  },

  init: function () {
    this.state = 'S';  // [S]it [M]ove [F]ollow [D]ead
    this.targetEl = null;
    this.targetPosition = new THREE.Vector3();
    this.elPosition = new THREE.Vector3();
    this.catEl = document.querySelector('#cat');

    do {
      this.el.object3D.position.x = ((Math.random() - 0.5) * (City.SIZE - 4) * City.BLOCK) * City.SCALE;
      this.el.object3D.position.y = 0.5;
      this.el.object3D.position.z = ((Math.random() - 0.5) * (City.SIZE - 4) * City.BLOCK) * City.SCALE;
    } while (City.getGroundLevel(this.el.object3D.position) != 0.5 || 
             this.el.object3D.position.distanceTo(this.catEl.object3D.position) < 20);  // Not too close to the cat or they would wake up immediately.

    this.el.object3D.rotation.y = Math.random() * Math.PI * 2;
  },

  tick: function (time, deltaTime) {
    if (this.state === 'D') return;
    if (!this.catEl) { return; }

    const el = this.el;
    const data = this.data;

    const myPosition = el.object3D.position;
    const catPosition = this.catEl.object3D.position;
    const catDistance = this.catEl.components.catwalk.dead ? Number.MAX_VALUE : myPosition.distanceTo(catPosition);

    if (this.el.components.catwalk.dead) {
      this.state = 'D';
    }
    else if (this.state === 'S' && catDistance < 15) {  // Accross the road
      this.state = 'M';
    }
    else if (this.state === 'M' && catDistance < 1.5) {  // Close by
      this.state = 'F'

      let firstKittenInLine = null;
      const allKittens = document.querySelectorAll('[kitten]');
      for (const kitten of allKittens) {
        const kittenComp = kitten.components.kitten;
        if (kittenComp && kittenComp.state && kittenComp.targetEl === this.catEl) {
          firstKittenInLine = kitten;
          break;
        }
      }

      this.targetEl = this.catEl;
      if (firstKittenInLine) {
        firstKittenInLine.components.kitten.targetEl = el;
      }
    }
    else if(this.state === 'F'  && (this.targetEl.components.catwalk.dead 
            || this.targetEl.components.kitten && this.targetEl.components.kitten.state != 'F')) {
        this.state = 'M';
        this.targetEl = null;
    }

    let targetPosition = null;
    if (this.state === 'M') {
      const speed = 4;
      const directionChangesPerSecond = 0.2;

      this.velocity = this.velocity ?? new THREE.Vector3((Math.random() - 0.5), 0, (Math.random() - 0.5));
      this.el.object3D.position.x += this.velocity.x * speed * deltaTime/1000;
      this.el.object3D.position.z += this.velocity.z * speed * deltaTime/1000;
      targetPosition = this.el.object3D.position.clone().add(this.velocity);
      if (Math.random() < directionChangesPerSecond * (deltaTime / 1000)) {
        this.velocity = null;
      }
    }
    else if (this.state === 'F') {
      const followDistance = 0.6;

      targetPosition = this.targetEl.object3D.position.clone();
      targetPosition.y = el.object3D.position.y;

      const direction = new THREE.Vector3().subVectors(targetPosition, myPosition).normalize();
      const desiredPosition = new THREE.Vector3().copy(targetPosition).sub(direction.multiplyScalar(followDistance));

      el.object3D.position.lerp(desiredPosition, 1);
    }

    if (targetPosition) {
      el.object3D.lookAt(targetPosition);
      el.components.catwalk.mesh.rotation.y = Math.PI;  // Kitten/cat models look to -Z
    }
  }
});
