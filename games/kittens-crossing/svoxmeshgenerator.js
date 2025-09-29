var FACECOUNT = 0;
var MERGECOUNT = 0;

class SvoxMeshGenerator {

  static generate(modelName, model) {
    if (!model) {
      throw `Unknown model '${modelName}'`;
    }

    const voxelModel = new VoxelModel(model);
    const svoxModel = new SvoxModel(voxelModel);

    const positionIndexMap = new Map();

    function getOrAddPosition(x, y, z, material, clamped, position, color) {
      const key = `${x},${y},${z},${material.fade ? '' : material.color},${clamped}`;
      let index = position.length / 3;
      if (!positionIndexMap.has(key)) {
        positionIndexMap.set(key, index);
        position.push(x, y, z);

        const rgb = material.rgbColor;
        color.push(rgb.r, rgb.g, rgb.b);

      } else {
        index = positionIndexMap.get(key);
      }
      return index;
    }

    function generateGeometry(svoxModel, position, color, index) {
      const {
        size,
        scale,
        position: svoxPosition,
        face,
        faceClamped,
        faceMaterial,
      } = svoxModel;

      let vCurrent = null;
      let xDiffBottom = 0;
      let yDiffBottom = 0;
      let zDiffBottom = 0;
      let xDiffTop = 0;
      let yDiffTop = 0;
      let zDiffTop = 0;

      // Loop over all voxel faces (one material per face)
      // Explicitly <= faceMaterial.length so we do one extra loop
      for (let fi = 0; fi <= faceMaterial.length; fi++) {

        FACECOUNT++;

        let vNext = [];
        if (fi != faceMaterial.length) {
          const material = faceMaterial[fi];
          const clamped = faceClamped[fi];

          // Get the four vertex positions for the corners and recreate them in the mesh
          for (let i=0; i<4; i++) {
            const svoxPositionIndex = face[fi*4+i] * 3;
            vNext[i] = getOrAddPosition(
              (svoxPosition[svoxPositionIndex + 0] - size.x / 2) * scale,
              (svoxPosition[svoxPositionIndex + 1]             ) * scale,
              (svoxPosition[svoxPositionIndex + 2] - size.z / 2) * scale,
              material,
              clamped,
              position,
              color
            );
          }

          if (vCurrent && //!material.deform &&
              vNext[0] === vCurrent[1] && vNext[3] === vCurrent[2] &&
              Math.abs((position[vCurrent[1]*3+0] + xDiffBottom) - position[vNext[1]*3+0]) < 0.001 &&
              Math.abs((position[vCurrent[1]*3+1] + yDiffBottom) - position[vNext[1]*3+1]) < 0.001 &&
              Math.abs((position[vCurrent[1]*3+2] + zDiffBottom) - position[vNext[1]*3+2]) < 0.001 &&
              Math.abs((position[vCurrent[2]*3+0] + xDiffTop) - position[vNext[2]*3+0]) < 0.001 &&
              Math.abs((position[vCurrent[2]*3+1] + yDiffTop) - position[vNext[2]*3+1]) < 0.001 &&
              Math.abs((position[vCurrent[2]*3+2] + zDiffTop) - position[vNext[2]*3+2]) < 0.001 &&
              color[vNext[0]*3+0] === color[vCurrent[0]*3+0] && color[vNext[0]*3+1] === color[vCurrent[0]*3+1] && color[vNext[0]*3+2] === color[vCurrent[0]*3+2] &&
              color[vNext[1]*3+0] === color[vCurrent[0]*3+0] && color[vNext[1]*3+1] === color[vCurrent[0]*3+1] && color[vNext[1]*3+2] === color[vCurrent[0]*3+2] &&
              color[vNext[2]*3+0] === color[vCurrent[3]*3+0] && color[vNext[2]*3+1] === color[vCurrent[3]*3+1] && color[vNext[2]*3+2] === color[vCurrent[3]*3+2] &&
              color[vNext[3]*3+0] === color[vCurrent[3]*3+0] && color[vNext[3]*3+1] === color[vCurrent[3]*3+1] && color[vNext[3]*3+2] === color[vCurrent[3]*3+2]) {
            vCurrent[1] = vNext[1];
            vCurrent[2] = vNext[2];
            MERGECOUNT++;
            continue;
          } 
        }

        if (vCurrent) {
          // Create the two triangles for the voxel face, rotating them so the
          // diagonal connects the lowest contrast to prevent blocky shadows
          let c0 = vCurrent[0]*3; let c1 = vCurrent[1]*3; let c2 = vCurrent[2]*3; let c3 = vCurrent[3]*3;
          let dif02 = Math.abs((color[c0+0]+color[c0+1]+color[c0+2]) - (color[c2+0]+color[c2+1]+color[c2+2]));
          let dif13 = Math.abs((color[c1+0]+color[c1+1]+color[c1+2]) - (color[c3+0]+color[c3+1]+color[c3+2]));
          
          if (dif02 > dif13) {
            index.push(vCurrent[1], vCurrent[2], vCurrent[3], vCurrent[3], vCurrent[0], vCurrent[1]);
          }
          else {
            index.push(vCurrent[0], vCurrent[1], vCurrent[2], vCurrent[2], vCurrent[3], vCurrent[0]);
          }
        }

        if (fi != faceMaterial.length) {
          vCurrent = vNext;
          xDiffBottom = position[vCurrent[1]*3+0] - position[vCurrent[0]*3+0];
          yDiffBottom = position[vCurrent[1]*3+1] - position[vCurrent[0]*3+1];
          zDiffBottom = position[vCurrent[1]*3+2] - position[vCurrent[0]*3+2];
          xDiffTop = position[vCurrent[2]*3+0] - position[vCurrent[3]*3+0];
          yDiffTop = position[vCurrent[2]*3+1] - position[vCurrent[3]*3+1];
          zDiffTop = position[vCurrent[2]*3+2] - position[vCurrent[3]*3+2];
        }
      }
    }

    const position = [];
    const color = [];
    const index = [];
    generateGeometry(svoxModel, position, color, index);

    let materials = [];
    const materialClass = `Mesh${svoxModel.meshMaterial?.material ?? 'Standard'}Material`;
    // Ensure THREE is globally available or imported
    if (typeof THREE !== 'undefined' && THREE[materialClass]) {
      let properties = {
        vertexColors: true
      };
      properties = {
        ...properties,
        ...(svoxModel.meshMaterial ?? {})
      };
      delete properties.material;

      const materialConstructor = THREE[materialClass];
      materials.push(new materialConstructor(properties));
    } else {
      console.error(`Bad material or THREE not defined: ${materialClass}`);
    }

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
    geometry.setIndex(index);

    // Add the triangle groups for each material (only) on, so one group for all triangles
    geometry.addGroup(0, index.length, 0);

    // Let Three.js do some of the heavy lifting
    // Standard normals work because vertices are only reused for deformed and non clamped faces
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    let mesh = new THREE.Mesh(geometry, materials);

    return mesh;
  }

}