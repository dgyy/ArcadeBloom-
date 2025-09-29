AFRAME.registerComponent("score", {
  init() {
    this.arrow = SvoxMeshGenerator.generate("Arrow", {
      size: { x: 9, y: 1, z: 9 },
      scale:0.03,
      lighting: {
        color: '#FFF',
        direction: { x:0, y:1, z:-1 },
        ambient:0.7
      },
      materials: [
        { A:'#08A' },
        { B:'#08A', deform:10, clamp:CLAMP.Y },
        { C:'#08A', deform:4, clamp:CLAMP.Y },
      ],
      meshMaterial: { material: 'Basic' },
      voxels:'4(3-3A3-)C7AC-B5AB3-B3AB5-BAB7-C4-'
    });
    this.el.setObject3D('arrow', this.arrow);  
    this.arrow.position.set(0, -0.25, 0)

    this.kittens = [...document.querySelectorAll('[kitten]')];
    this.worldPosition = new THREE.Vector3();

    this.text = document.getElementById('text');
  },

  tick() {
    this.cat = this.cat ?? document.getElementById('cat').components.catwalk;
    if (!this.cat) return;

    const voxels = this.kittens.map(k=>k.components.kitten.state).join('-');
    if (this.last != voxels) {
      this.mesh = SvoxMeshGenerator.generate("Score", {
        size: { x: voxels.length, y: 1, z: 1 },
        scale:0.04,
        lighting: {
          color: '#FFF',
          direction: { x:0, y:0, z:1},
          ambient:0.7
        },
        materials: [
          { S:'#08A', M:'#08A', F:'#0C0', D:'#222' }
        ],
        meshMaterial: { material: 'Basic' },
        voxels:voxels
      });
      this.el.setObject3D('mesh', this.mesh);  
      this.last = voxels;
    }

    this.el.object3D.getWorldPosition(this.worldPosition);
    const nearest = this.kittens
                    .filter(k=>'SM'.includes(k.components.kitten.state))
                    .map(k => {k.distance=k.object3D.position.distanceTo(this.worldPosition); return k;})
                    .sort((a, b) => a.distance - b.distance)[0];

    let textValue = ``;
    const followCount = this.kittens.map(k=>k.components.kitten.state==='F'?'F':'').join('').length;

    if (nearest && !this.cat.dead) {
      this.arrow.lookAt(nearest.object3D.position);
    }
    else { // The game is over...
      this.arrow.removeFromParent();
      [...document.querySelectorAll('[movecontrols]')].map(e=>e.pause());

      if (this.cat.dead) {
        textValue = `You should\nhave looked!\nMi-ouch!`;
      }
      else if (followCount != this.kittens.length) {
        textValue = `You saved only\n${followCount} kittens out of ${this.kittens.length}\Mi-aww...`;
      }
      else {
        textValue = `Wow!\nYou can\nsave them all!\nPurrfect!`;
      }
      setTimeout(() => {
        window.location.reload();
      }, 7500);
    }
    this.text.setAttribute('value', textValue);
  }
});