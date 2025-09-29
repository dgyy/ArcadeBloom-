const SVOX = { models: {} };

class SvoxModel {

  constructor(voxelModel) {

    // Ensure lighting is filled with defaults for missing values
    const lighting = {
      ambient: 1,
      ao: 0,
      direction: { x: 1, y: 1, z: 1 },
      color: '#FFF',
      ...(voxelModel.lighting || {})
    };

    // Copy all parameters in the object
    Object.assign(this, {
      ...voxelModel,
      lighting,
      scale: voxelModel.scale ?? 1,
      position: [],
      positionProperties: [],
      face: [],
      faceMaterial: [],
      faceClamped: [],
      links: [],

      // Temp
      vertexIndexMap: new Map()
    });

    this.createRgbColors();

    this.createModel();

    // Deform
    const maxDeformCount = Math.max(...Object.values(voxelModel.materials).map(m => m.deform ?? 0));
    for (let i = 1; i <= maxDeformCount; i++) {
      this.deform(i);
    }

    // Scatter
    this.scatter();

    // Remove temp
    delete this.voxels;
    delete this.vertexIndexMap;
    delete this.positionProperties;
  }

  createRgbColors() {
    const lightColor = SvoxModel.hexToRgbColor(this.lighting.color);

    for (let voxelId in this.materials) {
      let material = this.materials[voxelId];
      material.rgbColor = SvoxModel.getRgbColor(material.color ?? '#F0F', lightColor);
    }

    for (const voxelId in this.materials) {
      this.materials[voxelId + 'shadow'] = {
        ...this.materials[voxelId],
        rgbColor: SvoxModel.getRgbColor(this.materials[voxelId].color, lightColor, this.lighting.ambient)
      };
      this.materials[voxelId + 'ao'] = {
        ...this.materials[voxelId],
        rgbColor: SvoxModel.getRgbColor(this.materials[voxelId].color, lightColor, 1 - this.lighting.ao)
      };
      this.materials[voxelId + 'shadowao'] = {
        ...this.materials[voxelId],
        rgbColor: SvoxModel.getRgbColor(this.materials[voxelId].color, lightColor, (this.lighting.ambient) * (1 - this.lighting.ao))
      };
    }
  }

  static hexToRgbColor(color) {
    if (!/^#([0-9A-Fa-f]{3})$/.test(color)) {
      throw `Invalid color ${color}`;
    }
    let rgb = {
      r: parseInt(color[1], 16) * 17 / 255,
      g: parseInt(color[2], 16) * 17 / 255,
      b: parseInt(color[3], 16) * 17 / 255
    };
    return rgb;
  }

  static getRgbColor(color, lightColor, lightIntensity = 1) {
    let linearColor = SvoxModel.hexToRgbColor(color)
    return SvoxModel.toSRgb(linearColor, lightColor, lightIntensity);
  }

  static toSRgb(rgb, lightColor, lightIntensity) {
    const color = new THREE.Color(rgb.r, rgb.g, rgb.b);
    color.r = color.r * lightColor.r * lightIntensity;
    color.g = color.g * lightColor.g * lightIntensity;
    color.b = color.b * lightColor.b * lightIntensity;
    color.convertSRGBToLinear();
    return { r: color.r, g: color.g, b: color.b };
  }  

  createModel() {
    const errorMaterial = { color: 'F0F', rgbColor: { r: 1, g: 0, b: 1 } };
    const calcShadow = this.lighting.ambient != 1;
    const calcAo = (this.lighting.ao ?? 0) != 0;

    // Define the properties for each of the six faces
    const faces = [
      // Left face (-x)
      {
        id: FACE.NX,
        axis: AXIS.X,
        direction: { x: -1, y: 0, z: 0 },
        vertices: [0, 3, 7, 4],
        getX: (voxelIndex) => Math.floor(voxelIndex / this.size.z) % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => voxelIndex % this.size.z
      },
      // Right face (+x)
      {
        id: FACE.PX,
        axis: AXIS.X,
        direction: { x: 1, y: 0, z: 0 },
        vertices: [2, 1, 5, 6],
        getX: (voxelIndex) => Math.floor(voxelIndex / this.size.z) % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => this.size.z - 1 - voxelIndex % this.size.z
      },
      // Bottom face (-y)
      {
        id: FACE.NY,
        axis: AXIS.Y,
        direction: { x: 0, y: -1, z: 0 },
        vertices: [0, 1, 2, 3],
        getX: (voxelIndex) => voxelIndex % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => Math.floor(voxelIndex / this.size.x) % this.size.z
      },
      // Top face (+y)
      {
        id: FACE.PY,
        axis: AXIS.Y,
        direction: { x: 0, y: 1, z: 0 },
        vertices: [7, 6, 5, 4],
        getX: (voxelIndex) => voxelIndex % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => Math.floor(voxelIndex / this.size.x) % this.size.z
      },
      // Back face (-z)
      {
        id: FACE.NZ,
        axis: AXIS.Z,
        direction: { x: 0, y: 0, z: -1 },
        vertices: [1, 0, 4, 5],
        getX: (voxelIndex) => this.size.x - 1 - voxelIndex % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => Math.floor(voxelIndex / this.size.x) % this.size.z
      },
      // Front face (+z)
      {
        id: FACE.PZ,
        axis: AXIS.Z,
        direction: { x: 0, y: 0, z: 1 },
        vertices: [3, 2, 6, 7],
        getX: (voxelIndex) => voxelIndex % this.size.x,
        getY: (voxelIndex) => Math.floor(voxelIndex / (this.size.x * this.size.z)),
        getZ: (voxelIndex) => Math.floor(voxelIndex / this.size.x) % this.size.z
      }
    ];

    const vertex = [];
    const voxelCount = this.size.x * this.size.y * this.size.z;
    for (const face of faces) {
      for (let voxelIndex = 0; voxelIndex < voxelCount; voxelIndex++) {

        // Instead of walking through x, y, z, we are looping six times over the voxels,
        // once for each face and generating adjacent faces so we can merge them in
        // the SvoxMeshGenerator. Since the direction is different for each face
        // We calculate the x, y, z to go trough the voxels in the right order.
        const x = face.getX(voxelIndex);
        const y = face.getY(voxelIndex);
        const z = face.getZ(voxelIndex);

        let voxelId = this.voxels.getVoxel(x, y, z);
        if (voxelId) {
          let material = this.materials[voxelId] ?? errorMaterial;
          let shadowMaterial = this.materials[voxelId + 'shadow'] ?? errorMaterial;
          let aoMaterial = this.materials[voxelId + 'ao'] ?? errorMaterial;
          let shadowOaMaterial = this.materials[voxelId + 'shadowao'] ?? errorMaterial;

          // Get vertex indices for the current voxel.
          if (face.id === FACE.NX) {
            vertex[0] = this.getOrAddVertex(x, y, z, material);
            vertex[1] = this.getOrAddVertex(x + 1, y, z, material);
            vertex[2] = this.getOrAddVertex(x + 1, y, z + 1, material);
            vertex[3] = this.getOrAddVertex(x, y, z + 1, material);
            vertex[4] = this.getOrAddVertex(x, y + 1, z, material);
            vertex[5] = this.getOrAddVertex(x + 1, y + 1, z, material);
            vertex[6] = this.getOrAddVertex(x + 1, y + 1, z + 1, material);
            vertex[7] = this.getOrAddVertex(x, y + 1, z + 1, material);
          }
          else {
            vertex[0] = this.getVertex(x, y, z);
            vertex[1] = this.getVertex(x + 1, y, z);
            vertex[2] = this.getVertex(x + 1, y, z + 1);
            vertex[3] = this.getVertex(x, y, z + 1);
            vertex[4] = this.getVertex(x, y + 1, z);
            vertex[5] = this.getVertex(x + 1, y + 1, z);
            vertex[6] = this.getVertex(x + 1, y + 1, z + 1);
            vertex[7] = this.getVertex(x, y + 1, z + 1);
          }

          // Loop through the face definitions to generate the geometry
          if ((this.skip & face.id) && this.voxels.faceOnBoundary(x, y, z, face.id))
            continue;

          if (!this.voxels.faceObstructed(x, y, z, face.id)) {
            // Use the data structure to determine the clamped value and check for clamping
            const clamped = (material.deform ?? 0) === 0 || material.clamp === face.axis;

            const shadow = calcShadow && this.inShadow(x, y, z, face.id, face.direction);
            const ao = (calcAo && material.ao !== false) && this.voxels.faceSemiObstructed(x, y, z, face.id);

            // Choose material based on shadow and AO
            let mat = shadow && ao ? shadowOaMaterial :
                      shadow ? shadowMaterial :
                      ao ? aoMaterial :
                      material;
            this.faceMaterial.push(mat);
            this.faceClamped.push(clamped ? face.axis : 0);

            const v = face.vertices;

            for (let i = 0; i < 4; i++) {
              // Push all 4 vertex indices into the face array
              this.face.push(vertex[v[i]]);

              // Link all edges to the neighbor vertices.
              // Except for clamped faces, that link to itself for nice peripendicular deforms
              this.addLinks(vertex[v[i]], vertex[v[clamped ? i : (i + 1) % 4]]);
            }
          }
        }
      }
    }
  }

  getOrAddVertex(x, y, z, material) {
    const key = ((x + 1024) << 22) | ((y + 1024) << 11) | (z + 1024);
    let index = this.vertexIndexMap.get(key);
    if (!index) {
      index = this.position.length / 3;
      this.position.push(x, y, z);
      this.vertexIndexMap.set(key, index);
      this.links.push([]);
      this.positionProperties[index] = {
        deform: material.deform ?? 0,
        scatter: material.scatter ?? 0,
        clamp: material.clamp
      };
    }
    else {
      const props = this.positionProperties[index];
      props.deform = Math.min(props.deform, material.deform ?? 0);
      props.scatter = Math.min(props.scatter, material.scatter ?? 0);
      props.clamp |= material.clamp;
    }
    return index;
  }

  getVertex(x, y, z) {
    const key = ((x + 1024) << 22) | ((y + 1024) << 11) | (z + 1024);
    let index = this.vertexIndexMap.get(key);
    return index;
  }

  addLinks(v1Index, v2Index) {
    if (!this.links[v1Index].includes(v2Index)) {
      this.links[v1Index].push(v2Index);
    }
    if (!this.links[v2Index].includes(v1Index)) {
      this.links[v2Index].push(v1Index);
    }
  }

  inShadow(x, y, z, face, faceDirection) {
    const lightDirection = this.lighting.direction;

    if ((face === FACE.NX && lightDirection.x >= 0) ||
      (face === FACE.PX && lightDirection.x <= 0) ||
      (face === FACE.NY && lightDirection.y >= 0) ||
      (face === FACE.PY && lightDirection.y <= 0) ||
      (face === FACE.NZ && lightDirection.z >= 0) ||
      (face === FACE.PZ && lightDirection.z <= 0)) {
      return true;
    }

    let i = 0;
    let shadow = false;
    while (true) {
      const cx = Math.round(x + faceDirection.x * 0.55 + i * lightDirection.x);
      const cy = Math.round(y + faceDirection.y * 0.55 + i * lightDirection.y);
      const cz = Math.round(z + faceDirection.z * 0.55 + i * lightDirection.z);
      if (this.voxels.outOfBounds(cx, cy, cz)) {
        return false;
      }
      if (this.voxels.getVoxel(cx, cy, cz)) {
        return true;
      }
      i += 0.5;
    }
    return false;
  }

  deform(iteration) {
    let newVertices = [...this.position];
    for (let v = 0; v < this.links.length; v++) {
      const props = this.positionProperties[v];
      if (props.deform >= iteration) {
        if ((props.clamp & CLAMP.X) === 0) {
          newVertices[v * 3 + 0] = average(this.position, v, this.links[v], 0);
        }
        if ((props.clamp & CLAMP.Y) === 0) {
          newVertices[v * 3 + 1] = average(this.position, v, this.links[v], 1);
        }
        if ((props.clamp & CLAMP.Z) === 0) {
          newVertices[v * 3 + 2] = average(this.position, v, this.links[v], 2);
        }
      }
    }
    this.position = newVertices;

    function average(vertices, vertexIndex, links, axis) {
      let average = vertices[vertexIndex * 3 + axis];
      for (const linkIndex of links) {
        average += vertices[linkIndex * 3 + axis];
      }
      return average / (links.length + 1);
    }
  }

  scatter() {
    const scatter = (strength) => (Math.random() * 2 - 1) * strength;
    for (let v = 0; v < this.positionProperties.length; v++) {
      const props = this.positionProperties[v];
      if (props.scatter) {
        if ((props.clamp & CLAMP.X) === 0) {
          this.position[v * 3 + 0] += scatter(props.scatter);
        }
        if ((props.clamp & CLAMP.Y) === 0) {
          this.position[v * 3 + 1] += scatter(props.scatter);
        }
        if ((props.clamp & CLAMP.Z) === 0) {
          this.position[v * 3 + 2] += scatter(props.scatter);
        }
      }
    }
  }

}
