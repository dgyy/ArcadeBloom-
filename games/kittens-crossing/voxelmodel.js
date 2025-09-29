/**
 * VoxelModel class
 * This class is responsible for decoding the Run-Length Encoded (RLE) voxel string.
 * It acts as a data parser and holds the VoxelMatrix instance for the decoded model.
 */
class VoxelModel {

  /**
   * Constructs a VoxelModel instance.
   * @param {object} model The model object containing size, colors, materials, and the RLE voxel string.
   */
  constructor(model) {
    // Copy all parameters except the raw voxels string
    Object.assign(this, {
      size: model.size,
      scale: model.scale,
      skip: model.skip,
      meshMaterial: model.meshMaterial,
      lighting: model.lighting,
      colors: model.colors,
      materials: this.flattenMaterials(model.materials ?? [])
    });

    // Create a new VoxelMatrix instance with the decoded data
    this.voxels = new VoxelMatrix(this.size.x, this.size.y, this.size.z, model.voxels);
  }

  // Converts the array of materials with multiple colors
  // to an object with color object members with the settings
  flattenMaterials(materials) {
    const result = {};
    for (const material of materials) {
      for (const color in material) {
        // Check if this is a color (all other properties start with a lower case)
        if (color[0] >= 'A' && color[0] <= 'Z') {
          result[color] = { color: material[color] };
          for (const property in material) {
            // Check if this is not a color but another property
            if (property[0] >= 'a' && property[0] <= 'z') {
              result[color][property] = material[property];
            }
          }
        }
      };
    }
    return result;
  }

}

/**
 * VoxelMatrix class
 * This class represents a 3D matrix of voxels and provides methods for
 * manipulation and access.
 */
class VoxelMatrix {

  constructor(x, y, z, modelString) {
    this.size = { x, y, z };

    // Obstructing parameters for the obstructed(x, y, z, face) function
    this.obstructing = [];
    this.obstructing[FACE.NX] = { dx: -1, dy:  0, dz:  0, ox: 0, oy: 1, oz: 1 };
    this.obstructing[FACE.PX] = { dx:  1, dy:  0, dz:  0, ox: 0, oy: 1, oz: 1 };
    this.obstructing[FACE.NY] = { dx:  0, dy: -1, dz:  0, ox: 1, oy: 0, oz: 1 };
    this.obstructing[FACE.PY] = { dx:  0, dy:  1, dz:  0, ox: 1, oy: 0, oz: 1 };
    this.obstructing[FACE.NZ] = { dx:  0, dy:  0, dz: -1, ox: 1, oy: 1, oz: 0 };
    this.obstructing[FACE.PZ] = { dx:  0, dy:  0, dz:  1, ox: 1, oy: 1, oz: 0 };

    // Decode the RLE string using the static decodeRLE method
    const decoded = VoxelMatrix.decodeRLE(modelString);

    // Validate the decoded string length against the expected size
    const expectedLength = this.size.x * this.size.y * this.size.z;
    if (decoded.length !== expectedLength) {
      throw new Error(`${decoded.length} instead of ${expectedLength} voxels found`);
    }

    this.createVoxelMatrix(decoded);
  }

  static decodeRLE(rleString) {
    // The regular expression tokenizes the string into individual components:
    // - \d* : An optional number, e.g. "", "1", "123", ...
    // - ([(]|-|[A-Z][a-z]*) : Followed by '(', '-' or a a voxel Id, e.g., "(", "-", "A", "Ab", "Abc", ...
    // - [)]: Or a closing parenthesis.
    const tokenize = /(\d*([(]|-|[A-Z][a-z]*)|[)])/gm;
    const tokenizer = rleString.matchAll(tokenize);

    // Start the recursive decoding process
    return decode();

    function decode() {
      let decoded = [];
      let token = tokenizer.next();

      // Loop until a closing parenthesis is found or the end of the string is reached
      while (token.value && token.value[0] !== ')') {
        const value = token.value[0];
        const repeat = parseInt(value) || 1; // Parse repeat count or default to 1
        let secondPart = value.replace(/^\d+/, ''); // Replace all digits to get the voxel ID or -

        if (secondPart === '(') {
          // If the chunk is an opening parenthesis, recursively call decode()
          // to handle the nested RLE string
          const chunk = decode();
          for (let i=0; i<repeat; i++) {
            for (let j=0; j<chunk.length;j++) {
              decoded.push(chunk[j]);
            }
          }
        }
        else {
          // Repeat the decoded chunk and append to the result
          for (let i=0; i<repeat; i++) {
            decoded.push(secondPart);
          }
        }
        token = tokenizer.next();
      }

      return decoded;
    }
  }

  // Fills the 3D voxel matrix from a flat string representation
  createVoxelMatrix(voxelArray) {
    let z = 0;
    let y = 0;
    let x = 0;
    this.voxels = [];
    for (const voxelId of voxelArray) {
      this.setVoxel(x, y, z, voxelId)

      x++;
      if (x >= this.size.x) {
        x = 0;
        y++;
        if (y >= this.size.y) {
          y = 0;
          z++;
        }
      }
    }
  }

  // Set the voxel at x,y,z. Out of bounds throws exception
  setVoxel(x, y, z, voxelId) {
    if (voxelId === null || voxelId === '-')
      return;

    if (this.outOfBounds(x, y, z))
      throw new Error("Out of bounds");

    // Store the voxels in 16x16x16 chunks
    let matrixId = (x >> 4) + ((y >> 4) << 10) + ((z >> 4) << 20);
    let matrix = this.voxels[matrixId];
    if (!matrix) {
      matrix = this.voxels[matrixId] = [];
    }
    let index = (x & 15) + ((y & 15) << 4) + ((z & 15) << 8);
    matrix[index] = voxelId;
  }

  // Get the voxel at x,y,z. Out of bounds returns null
  getVoxel(x, y, z) {
    if (this.outOfBounds(x, y, z))
      return null;

    let matrixId = (x >> 4) + ((y >> 4) << 10) + ((z >> 4) << 20);
    let matrix = this.voxels[matrixId];
    if (matrix) {
      let index = (x & 15) + ((y & 15) << 4) + ((z & 15) << 8);
      return matrix[index];
    }
    return null;
  }

  outOfBounds(x, y, z) {
    return (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y || z < 0 || z >= this.size.z);
  }

  faceOnBoundary(x, y, z, face) {
    const params = this.obstructing[face];

    // Check if the voxel next to this face is out of bounds
    return this.outOfBounds(x + params.dx, y + params.dy, z + params.dz);
  }

  faceObstructed(x, y, z, face) {
    const params = this.obstructing[face];

    // Check if the voxel next to this face is present
    return !!this.getVoxel(x + params.dx, y + params.dy, z + params.dz);
  }

  faceSemiObstructed(x, y, z, face) {
    const params = this.obstructing[face];

    // Check if one of the nine voxels in the plane next to a voxel face is present
    for (let vx = -1 * params.ox; vx <= 1 * params.ox; vx++) {
      for (let vy = -1 * params.oy; vy <= 1 * params.oy; vy++) {
        for (let vz = -1 * params.oz; vz <= 1 * params.oz; vz++) {
          if (this.getVoxel(x + params.dx + vx, y + params.dy + vy, z + params.dz + vz)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /*
  toString() {
    let output = '';
    for (let z = 0; z < this.size.z; z++) {
      for (let y = 0; y < this.size.y; y++) {
        for (let x = 0; x < this.size.x; x++) {
          output += this.getVoxel(x, y, z) ?? '-';
        }
        output += ' ';
      }
      output += '\r\n';
    }
    return output;
  }
  */
}
