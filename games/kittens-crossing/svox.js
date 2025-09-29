const FACE = {
  NX: 1 << 0, // -x (000001)
  PX: 1 << 1, // +x (000010)
  NY: 1 << 2, // -y (000100)
  PY: 1 << 3, // +y (001000)
  NZ: 1 << 4, // -z (010000)
  PZ: 1 << 5  // +z (100000)
};

const PLANAR = {
  NX: FACE.NX, // -x (000001)
  PX: FACE.PX, // +x (000010)
   X: FACE.NX | FACE.PX,
  NY: FACE.NY, // -y (000100)
  PY: FACE.PY, // +y (001000)
   Y: FACE.NY | FACE.PY,
  NZ: FACE.NZ, // -z (010000)
  PZ: FACE.PZ, // +z (100000)
   Z: FACE.NZ | FACE.PZ
};

const SKIP = PLANAR;

const AXIS = {
  X: 1 << 0, // (000001)
  Y: 1 << 1, // (000010)
  Z: 1 << 2  // (000100)
};

const CLAMP = AXIS;

AFRAME.registerComponent("svox", {
  schema: { type: 'string' },
 
  init: function () {
    const meshCache = this.constructor.meshCache = this.constructor.meshCache ?? {};
    const modelName = this.data;

    const cachedMesh = meshCache[modelName];
    if (cachedMesh) {
      this.mesh = new THREE.Mesh(cachedMesh.geometry, cachedMesh.material);
    }
    else {
      this.mesh = SvoxMeshGenerator.generate(modelName, SVOX.models[modelName]);
      meshCache[modelName] = this.mesh;
    }
    this.el.setObject3D('mesh', this.mesh);
  }  
});

