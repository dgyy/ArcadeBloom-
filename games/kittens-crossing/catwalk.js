AFRAME.registerComponent("catwalk", {
  schema: { default:'#222' },
 
  init: function () {
    this.CATMODELS = new VoxelMatrix(36, 18, 28, '433-11(E2-)E506-5(4C2-)4C-108C-4(4C2-)4C-6C468-181C5(4-2C)4-3C11(2-4C)2-3C5(4-2C)4-C10-2C6-2C304-254C5(2-4C)2-3C5(4-2C)4-C10-2(2C6-2C26-)2C6-2C64-2C14-2C151-5(4C2-)4C-108C-11(4C2-)4C109-2C2-2(2C4-)4C2(4-2C)2-2C10-4C4-2C8-2C16-2C6-2C26-4C4-2C8-2C16-4C4-2C8-2(2C18-2C14-)2C44-5(2C4-)2C3-29(4C2-)4C3-5(2C4-)2C110-2C2-2C10-2C6-2C4-2C2-4C2(2(2-2C6-2C)2(2-4C))2(2-2C4-4C2-4C4-2C2(2-4C))17(2-4C)2-110C-11(4C2-)4C3-5(2C4-)2C146-2C2-4C8-2C4-4C4-2C2-4C2-2C10-2C6-2C4-2C2-4C2(2-2C6-2C)3(2-4C)2(8-2C4-4C4-2C2(2-4C))10(2-4C)2-182C-5(4C2-)4C3-5(2C4-)2C152-4(2C14-2C18-)2C14-2C84-180C2-4(2C4-)2C3-4C33-2C152-2(2C14-2C6-2C2-2C6-)2C14-2C116-5(2C4-)2C3-4C-180C2-5(2C4-)2C212-2C2-2C30-2C2-2C67-4C32-4C3-4(2C4-)2C3-5(4C2-)4C-180C-4C3-5(2C4-)2C212-2C2-2C30-2C2-2C66-6C31-4C3-4(2C4-)2C2-6C-4(4C2-)4C-180C2-5(2C4-)2C218-3(2C2-2C30-)6C30-6C2-4(2C4-)2C2-6C-4(4C2-)4C-114C-4(4C2-)4C3-2C3-4(4C2-)4C9-4(2C4-)2C10-4(2C4-)2C182-4(6C30-)6C2-4(2C4-)2C2-3(6C-4(4C2-)4C-)6C-4(4C2-)4C3-2C3-4(4C2-)4C8-4(4C2-)4C9-4(2C4-)2C10-4(2C4-)2C158-2C14-2C6-4(6C30-)6C2-4(2C4-)2C2-2(6C-4(4C2-)4C-)36C2(2-2C2-30C)7-4(4C2-)4C8-4(4C2-)4C9-4(2C4-)2C158-2C14-2C6-6C6-2C14-2C6-4(6C30-)6C2-4(2C4-)2C2-36C-4C-30C2-2C2-2(30C6-)30C7-4(4C2-)4C9-4(2C4-)2C152-2C2-4C4-2C8-2C4-8C6-2C8-2C4-4C4-2(6C6-2C14-2C6-)2(6C30-)6C31-4C-30C2-2C2-3(30C6-)30C7-4(4C2-)4C9-4(2C4-)2C152-2C2-2C6-2C14-3(2C2-)4C4-2C2-2C4-4C2(2-2C)2(8-2C)4-4C16-2C14-2C18-2C14-2C12-2(2C4(2-4C)2-2C6-)4(30C6-)30C7-4(4C2-)4C187-2C2-2C4-4C4-2C8-3(2C2-)2(2C6-2C2-)3(2C2-)2(4C4-2C2-2C4-4C2-2C6-2C2-)4(4C2-)2(2C6-2C4(2-4C)2-)2C4(6-30C)8-4(2C4-)2C234-2C6-2C12-2(2C2-)2C4-4C4-2C8-3(2C2-)2C4-4C2-4C4-4(2C2-)2C4-4C2-4C4-2C4(2-2C6-2C4(2-4C))2-2C2(6-30C)8-4(2C4-)2C10-4(2C4-)2C234-2C6-2C26-2C6-2C12-2(2C2-)2C4-4C4-2C8-3(2C2-)2(2C4-4C2-4C4-4(2C2-))2C4-4C2-4C4-2(2C2-)4(2C34-)11(2C4-)2C10-4(2C4-)3(2C10-2C3-2(2C5-)2C3-)2C126-2C6-2C26-2C6-2(2C12-)2C6-2C12-7(2C34-)11(2C4-)4(2C10-2C3-2(2C5-)2C3-)2C436-2(2C34-)2C76-2(2C3-2(2C5-)2C3-2C10-)2C3-2(2C5-)2C3-2C436-2C34-2C112-4(2C3-2(2C5-)2C3-2C10-2C3-2(2C5-)2C3-2C586-)2C3-2(2C5-)2C3-2C10-2C3-2(2C5-)2C3-2C8-');

    this.CATDEAD = {
      size: { x: 10, y: 10, z: 16 },
      scale: this.data === '#222' ? 0.04 : 0.02,
      meshMaterial: {
        material: 'Phong',
        shininess: 200
      },
      materials: [
        { deform: 2, C:this.data, E:'#975', B:'#A00' }
      ],
      voxels:'2B-3B2-2B90-2B-4B-2B91-9B92-8B93-5B94-3B2-B93-2(2B-)2B92-2B2-B2-2B92-2B-5B44-2(2C8-)2C2(4-6C)4-9B45-2(2C8-)2C2(4-6C)4-8B46-2C8-2C37-5B5-4B37-2C8-2(2C36-7B4-4B7-4(2C8-))2C35-6B-2B3-4B83-3B5-2B90-'
    };

    this.catDead = SvoxMeshGenerator.generate('Cat.Stand', this.CATDEAD);
    this.catStand = SvoxMeshGenerator.generate('Cat.Stand', this.generateCat(0))
    this.catSit   = SvoxMeshGenerator.generate('Cat.Sit', this.generateCat(5))

    this.walkMeshes = [
      SvoxMeshGenerator.generate('Cat.Walk1', this.generateCat(1)),
      SvoxMeshGenerator.generate('Cat.Walk2', this.generateCat(2)),
      SvoxMeshGenerator.generate('Cat.Walk3', this.generateCat(3)),
      SvoxMeshGenerator.generate('Cat.Walk4', this.generateCat(4))
    ];

    this.dead = false;
    this.totalDistance = 0;
    this.delayedDistance = 0;
    this.currentPosition = new THREE.Vector3();
    this.lastPosition = new THREE.Vector3();
    this.lastPosition.copy(this.el.object3D.position)
  },

  tick(time, timeDelta) {
    if (this.dead) return;

    this.currentPosition.copy(this.el.object3D.position)
    const dx = this.currentPosition.x - this.lastPosition.x;
    const dz = this.currentPosition.z - this.lastPosition.z;
    const distanceThisTick = Math.sqrt(dx * dx + dz * dz);

    this.lastPosition.copy(this.currentPosition);
    this.totalDistance += distanceThisTick;
    this.delayedDistance = (this.delayedDistance * 9 + this.totalDistance)/10;
    const speed = Math.abs(this.totalDistance - this.delayedDistance);

    if (speed < 0.00001) {
      this.mesh = this.catSit ;
    }
    else if (speed < 0.1) {
      this.mesh = this.catStand ;
    }
    else {
      this.mesh = this.walkMeshes[Math.floor((this.totalDistance*4))%4];
    }
    this.el.setObject3D('mesh', this.mesh);

    const targets = this.el.sceneEl.querySelectorAll('[vehicle]');
    targets.forEach(targetEl => {
      const targetPosition = targetEl.object3D.position;
      const distance = this.currentPosition.distanceTo(targetPosition);
      if (distance < 1 && this.el.object3D.position.y < 0.1) {
        this.mesh = this.catDead;
        this.el.setObject3D('mesh', this.mesh);
        this.dead = true;
        this.el.setAttribute('spray', '');
        this.el.removeAttribute('movecontrols');
        this.el.components.sound.playSound();
      }
    });    
  },

  generateCat(index) {
    let voxels = '';
    const offset = index * 6;
    for (let z = 0; z < 28; z++) {
      for (let y = 0; y < 18; y++) {
        for (let x = 0; x < 6; x++) {
          voxels += this.CATMODELS.getVoxel(offset + x, y, z) ?? '-';
        }
      }
    }

    return {
      size: { x: 6, y: 18, z: 28 },
      scale: this.data === '#222' ? 0.04 : 0.02,
      meshMaterial: {
        material: 'Phong',
        shininess: 200
      },
      materials: [
        { deform: 2, C:this.data, E:'#975'}
      ],
      voxels
    }
  }  
});

AFRAME.registerComponent('walk-up-and-down', {
  schema: {
    // The length of the model
    length: { type: 'number', default: 0.5 },
  },

  tick: function () {
    // Get the world position of the entity.
    const worldPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPos);

    // Calculate a point at the front and at the back of the model
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.el.object3D.quaternion);
    const len = this.data.length/2;
    const front = new THREE.Vector3(worldPos.x + dir.x * len, 0, worldPos.z + dir.z * len);
    const back  = new THREE.Vector3(worldPos.x - dir.x * len, 0, worldPos.z - dir.z * len);

    // Get the ground level at the front and the back
    let frontLevel = City.getGroundLevel(front);
    let backLevel = City.getGroundLevel(back);
    frontLevel = Math.abs(frontLevel);
    backLevel  = Math.abs(backLevel);
    
    // Update the entity's y using lerp for smoother movement
    const newY = (frontLevel + backLevel) / 2;
    this.el.object3D.position.y += (newY - this.el.object3D.position.y) * 0.1;

    // Calculate the pitch rotation based on the difference in height.
    const dy = frontLevel - backLevel;
    const newPitch = -Math.atan2(dy, 1);// * (180/pi);
    this.el.object3D.rotation.x = newPitch;
  },
});
