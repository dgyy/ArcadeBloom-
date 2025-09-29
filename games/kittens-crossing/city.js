AFRAME.registerComponent("city", {
  schema: {  },
 
  init: function () {
    this.mesh = City.mesh; 
    this.el.setObject3D('mesh', this.mesh);

    //this.navMesh = NavMeshExtracter.getNavMesh(this.mesh);
    //this.el.setObject3D('navMesh', this.navMesh);
  }  
});

class City {
  static mesh = null;

  // Main sizes (all the statics should have a # infront of them for private , but lifthrasiir.github.io/roadroller/ does not allow that)
  static SIZE = 13;  // 13
  static BLOCK = 21; 
  static SCALE = 0.5;
  static HEIGHT = 3;  // 3
  static CENTER = Math.floor(this.SIZE / 2);
  static grid = null;
  static voxels = null;
  
  // Ground floors definitions
  static GROUNDFLOORCOUNT = 5;
  static GROUNDFLOORHEIGHT = 12;
  static GROUNDFLOORS = new VoxelMatrix(11, 60, 11, '22S66-33B11A22S7(3B4-B3-)22B11A22S81-7A11-11A22S61-2(A10-)5A11-11A22S3B6(5-6B)5-25B11A22S-5(3B8-)3B7-33B11A22S4B6(3WB2W5B)3WB2W23B11A22S81-7A11-11A22S6-7(A10-)5A11-11A22S3B6(2WB2W6B)2WB2W25B11A22S-5(3B8-)3B7-33B11A22S99B11A22S2-6(5B6-)2(9B2-)9B11A22S2-7(5B6-)9B2-9B11A22S99B11A22S-5(3B8-)3B7-33B11A22S7(-10W)22B11A22S6(2-5B3WB)3(2-9B)11A22S2-6(5B6-)2(9B2-)9B11A22S7(-10W)22B11A22S66-33B11A22S7(-10W)22B11A22S7(2-9B)11A2-9B11A22S6(2-5B3WB)3(2-9B)11A22S7(-10W)22B11A22S66-33B11A22S7(-10W)22B11A22S7(2-9B)11A2-9B11A22S9(2-9B)11A22S6(-10B)-32B11A22S6-5B4(6-B3WB)6-38B11A22S7(-10W)22B11A22S7(2-9B)11A2-9B11A22S5(-A9B)3(2A9B)2-9B11A22S7(-10W)22B11A22S6(7-4W)33B11A22S99B11A22S6(3-8W)2(2-9B11A)22S6(4-7W)3-8B11A2-9B11A22S7(-10W)22B2(11A22S6(7-4W)33B11A22S7(-10W)22B11A22S6(3-8W)2(2-9B11A)22S6(4-7W)3-8B11A2-9B11A22S99B)11A22S5(7-4B)7-37B11A22S6(-10B)-32B11A22S6(3-8B)2(2-9B11A)22S6(4-7B)3-8B11A2-9B11A22S99B11A');

  // Floors definitions
  static FLOORCOUNT = 8;
  static FLOORHEIGHT = 8;
  static FLOORS = new VoxelMatrix(11, 64, 11, '11A24B3(5-B3-2B)5-B3-11B11A11-11A44-11B2(11A3-2B5-B)4(3-2B5-B)11A24B3(8-3B)8-12B11A11-11A3(10-B)10-12B11A2B8-B11A2B4(8-3B)8-4B2(8A3B8-3B)3(8-3B)8-11A13B4(3-B4-3B)3-B4-12B11A24B3(5WB3W2B)5WB3W11B11A7-4BA6-B3A4(7-B3W)11B11A-10B11A5(-2W2B5WB)11A24B3(8W3B)8W12B11A-10B11A3(-B8WB)-B8W12B11A11B11A2B4(8W3B)8W37B4(8W3B)8W11A13B4(3WB4W3B)3WB4W12B11A22B4(-10W)11B11A7-4BA6-B3A3(7-4B)7-15B11A-10B11A-W9B4(-10W)11A22B2(4(-10W)11B11A-10B11A)5(-10W)88B11A11B5(-10W)11B11A22B4(-10W)11B11A7-4BA6-B3A3(7-4B)7-15B11A11B11A55B11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A11B5(-10W)11B11A22B4(-10W)11B11A-B4W5BAB4WB4A3(-B4W5B)-B4W16B11A11B11A55B11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A11B5(-10W)11B11A22B2(4(-10W)11B11A-10B11A)-W9B4(-10W)11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A77B11A22B2(4(-10W)11B11A-10B11A)-W9B4(-10W)11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A11B5(-10W)11B11A77B2(11A-10B)2(-10B)-21B11A-10B11A2(-W9B4(-10W)11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A11B5(-10W)11B11A22B2(4(-10W)11B11A-10B11A))-W9B4(-10W)11A22B2(4(-10W)11B11A-10B11A)5(-10W)11A-10B11A5(-10W)11A11B5(-10W)11B11A22B4(-10W)11B11A-10B11A4(-10W)2(11B11A)55B11A77B11A-10B11A55B11A11B11A55B11A-10B11A5(-10W)11A77B');

  // Parks defintions
  static PARKCOUNT = 4;
  static PARKHEIGHT = 12;
  static CITYPARKS = new VoxelMatrix(11, 48, 11, '5(11G121-)11G-10D-10F99-3(11G121-)11G-10D-10F99-11G2-9H110-2(11G121-)11G-2D9-2F107-3G8J2-H118-2(11G121-)11G-2D9-2F107-3GJ7I2-H118-2(11G121-)11G-2D2-6H-2F107-3GJ3I2J2I2-H118-2(11G121-)11G-2D2-6H-2F3-5H99-3GJ6IJ2-H118-11G6-5H110-11G121-11G-2D2-2H4J-2F3-H103-3G2(JI)J2IJ2-H118-7G4D6-H67-3K2(7-4F)8-3F11-11G121-11G-2D2-2HJ3I-2F3-H103-3GJI2(J2I)2-H118-7G4D6-H57-2D7-4K3(7-4F)9-2F11G121-11G-2D2-2H2(JI)-2F3-H103-3GJ7I2-H118-7G3DG6-H3-4(E10-)E8-3D7-4K3(7-4F)8-3F11G121-11G-2D2-2H2(JI)-2F3-H103-3G2(J2I)2J2-H118-7G2D2G6-H2-4(2E9-)2E8-3D7-4K3(7-4F)8-3F');

  static PARKLAYOUT = [
    [3,2,3],
    [0,1,0],
    [3,2,3]
  ];

  // Road definition index --> N=1, E=2, S=4, W=8
  static ROAD = VoxelMatrix.decodeRLE('4S13R4S4(P3R)P8S13R4S8P5R8P4S13R29S6RQ6R8S4(P3R)P4S13R3(29S6RQ6R)8S13R4S4(P3U)P8S13R4SPV2(5RP)5RVP4S13R29S6RQ6R8S4(P3U)P4S13R3(29S6RQ6R)8S13R4S4(P3R)P8S13R4SPV2(5RP)5RVP4S13R19SX9S6RQ6R8S4(P3R)P4S13R14SX14S6RQ6R9SX19S6RQ6R14SX14S6RQ6R7S15R3S4(P3R)PR7S6RQ7R3SPV2(5RP)5RVP4S6RQ6R29S7Q7R6SR4(P3R)P3S7RQ6R28S2R6Q7R27S2R6Q6R28S2R6Q7R3S8P5R9P4(3RP)4R4S6RQ10R8P5R8P4S6RQ6R10S15R4S21R4(P3R)P10RQ6R4S57R6S17R4S17RQ24RPV2(5RP)5RV2P4(3RP)4R4S6RQ10RPV2(5RP)5RVP4S6RQ6R9S16R4S13RQ7R4(P3R)P10RQ6RSZ2S8R5Q25RQ19R5S17R4S17RQ20RQ3RPV5RP3RQRP5RV2P4(3RP)4R4S6RQ10RPV2(5RP)5RVP4S13R8S17R4S13RQ7R4(P3R)P10RQ6R4S38RQ20R2(4S17R)Q20RQ3RPV5RP3RQRP5RV18P4R4S6RQ10RPV2(5RP)5RVP4S13R8S17R4S13RQ7R17P10RQ6R4S8R5Q25RQ20R2(4S17R)Q20RQ3R8P3RQR8P21R4S17R8PR3QR8P4S6(RQ)R8S17R4S13RQ41R4S38RQ20R2(4S17R)Q20RQ3RPV5RPR3QRP5RVP8R4Q9R4S17RPV5RP2(RQ)RP5RVP4S6(RQ)R8S17R4S13RQ9R7Q25R4S8R5Q25RQ20R2(4S17R)Q20RQ3RPV5RP2(RQ)RP5RVP8RQ2RQ9R4S9R5Q3RPV5RP2(RQ)RP5RVP2SZS6(RQ)RSZ6S9R5Q3R2SZS13R4Q9RQ2RQ11R5Q9R4S3R3Q9R3Q3R4Q13R4Q3R5Q9R4S4Q13RSZ2S4Q13R8Q13R4QPV5RP2(RQ)RP5RVP8R7Q6R4S17RPV5RPR3QRP5RVP4S6(RQ)R8S17R4S26R4Q25R4S8R5Q11RQ34R4S3RQ13R4S3RQ20RQ17R8PR3QR8P21R4S17R8PRQ3R8P4S6(RQ)R8S17R4S55R4S24RQ34R4S3RQ13R4S3RQ20RQ17RPV2(5RP)5RV18P4R4S17RPV5RPRQ3RP5RVP4S13R8S6RQ10R4S21R17P17R4S8R5Q11RQ27RQ6R4S3RQ13R4S3RQ20RQ17RPV2(5RP)5RV2P4(3RP)4R4S17RPV5RPRQ3RP5RVP4S13R8S6RQ10R4S21R4(P3R)P17R4S24RQ27RQ6R4S3RQ13R4S3RQ20RQ17RPV2(5RP)5RV2P4(3RP)4R5S16RPV2(5RP)5RVP4S6RQ6R6SZS6RQ10R4S21R4(P3R)P16R5S8R5Q11RQ27RQ6RSZ2S3RQ13R4S3RQ20RQ17R8P5R9P4(3RP)4R6S15R8P5R8P4S6RQ6R8S6RQ10R4S21R4(P3R)P15R6S24RQ27RQ6R4S17R4S42RPV2(5RP)5RV2P4(3RP)R27S15R7S6RQ6R8S6RQ7R7S6R6Q2R6SR4(P3R)P66S7RQ6R7S7R7Q7S7R6Q2R6S7R6Q2R3SPV2(5RP)5RV2P4(3RP)29S3(13R8S)6RQ6R8S4(P3R)P5SX25SX20SX14S13R3(8S6RQ6R)4SPV2(5RP)5RV2P4(3UP)29S3(13R8S)6RQ6R8S4(P3U)P67S13R3(8S6RQ6R)4S8P5R9P4(3RP)29S3(13R8S)6RQ6R8S4(P3R)P67S13R3(8S6RQ6R)4S');

  static DIRECTION = {
    N: 1 << 0,
    E: 1 << 1,
    S: 1 << 2,
    W: 1 << 3
  };

  static generate() {
    // Create multiple layouts until you find a version where all roads are connected.
    // For larger sizes (e.g. 25), this could take thousands of tries (but still very fast)
    // But for small sizes (e.g. 13) this typically takes less than 10 tries
    let grid = null;

    while (!grid) {
      grid = this.createCityLayout();
      grid = this.cleanupCityLayout(grid);
    }

    this.classifyRoads(grid);
    this.classifyBuildings(grid);
    this.determinBuildingObstructions(grid);

    const voxels = this.generateVoxels(grid);

    this.grid = grid;

    const model = this.createSvoxModel(voxels);
    
    // The voxels are used instead of a nav mesh
    this.voxels = new VoxelModel(model).voxels;

    return model;
  }

  static createCityLayout() {
    const grid = []

    for (let z = 0; z < this.SIZE; z++) {
      grid[z] = [];
      for (let x = 0; x < this.SIZE; x++) {
        const rand = Math.random();
        const gridPoint = x % 2 < 1 && z % 2 < 1;
        const connection = rand > 0.4 && (x % 2 < 1 || z % 2 < 1);
        const park = (x >= this.CENTER - 1 && z >= this.CENTER - 1 && x <= this.CENTER + 1 && z <= this.CENTER + 1);
        const building = (x < this.CENTER - 2 || z < this.CENTER - 2 || x > this.CENTER + 2 || z > this.CENTER +  2) &&
                        ((x === 0 || z === 0 || x === this.SIZE - 1 || z === this.SIZE - 1) || (!gridPoint && !connection));

        if (park) {
          grid[z][x] = {
            type: 'Park',
            parkIndex: this.PARKLAYOUT[z-(this.CENTER-1)][x-(this.CENTER-1)]
          };
        }
        else if (building) {
          grid[z][x] = {
            type: 'Building'
          };          
        }
        else if (gridPoint) {
          grid[z][x] = {
            type: 'Road'
          };
        }
        else if (rand > 0.4 && connection) {
          grid[z][x] = {
            type: 'Road'
          };
        }
        else {
          grid[z][x] = {
            type: 'Road',
            parkIndex: Math.floor(Math.random() * this.PARKCOUNT)
          };
        }
      }
    }

    return grid;
  }

  static cleanupCityLayout(grid) {

    function findConnectedRoads(x, z, groupId) {
      const cell = grid[z][x];
      if (cell.type === 'Road' && cell.group === undefined) {
        cell.group = groupId;
        findConnectedRoads(x - 1, z, groupId);
        findConnectedRoads(x + 1, z, groupId);
        findConnectedRoads(x, z - 1, groupId);
        findConnectedRoads(x, z + 1, groupId);
      }
    }

    let groupId = 0;
    for (let z = 0; z < this.SIZE; z++) {
      for (let x = 0; x < this.SIZE; x++) {
        const cell = grid[z][x];
        if (cell.type === 'Road' && cell.group === undefined) {
          findConnectedRoads(x, z, groupId++);
        }
      }
    }

    if (groupId > 1) {
      // There are multiple groups of unconnected roads, try again
      return null;
    }
    return grid;
  }

  static classifyRoads(grid) {
    for (let z = 0; z < this.SIZE; z++) {
      for (let x = 0; x < this.SIZE; x++) {
        const cell = grid[z][x];
        if (cell.type === 'Road') {
          cell.x = x;
          cell.z = z;

          let definition = 0;
          definition += grid[z - 1][x].type === 'Road' ? this.DIRECTION.N : 0;
          definition += grid[z][x + 1].type === 'Road' ? this.DIRECTION.E : 0;
          definition += grid[z + 1][x].type === 'Road' ? this.DIRECTION.S : 0;
          definition += grid[z][x - 1].type === 'Road' ? this.DIRECTION.W : 0;
          cell.definition = definition;
        }
      }
    }
  }

  static classifyBuildings(grid) {

    function randomBuildingMaterial() {
      const postfixes = 'abcdefghijklmno';
      const randomIndex = Math.floor(Math.random() * postfixes.length);
      return 'C' + postfixes.charAt(randomIndex);
    }

    for (let z = 0; z < this.SIZE; z++) {
      for (let x = 0; x < this.SIZE; x++) {
        const cell = grid[z][x];
        if (cell.type === 'Building') {
          // Fill in all relevant data for the buidling in this cell
          cell.x = x;
          cell.z = z;

          cell.groundFloorIndex = Math.floor(Math.random() * this.GROUNDFLOORCOUNT);
          cell.floorIndex = Math.floor(Math.random() * this.FLOORCOUNT);

          cell.groundFloorColors = { S: 'S', A: randomBuildingMaterial(), B: randomBuildingMaterial(), W: 'W', '-': '-' };
          cell.floorColors = { S: 'S', A: cell.groundFloorColors.B, B: cell.groundFloorColors.A, W: 'W', '-': '-' };

          const maxFloors = Math.floor((this.HEIGHT * this.BLOCK - this.GROUNDFLOORHEIGHT) / this.FLOORHEIGHT);
          const centerDistance = Math.max(Math.abs(x-this.CENTER), Math.abs(z-this.CENTER)) / this.CENTER;
          cell.height = this.GROUNDFLOORHEIGHT + this.FLOORHEIGHT * (Math.floor(Math.random() * maxFloors * centerDistance));  
        }
      }
    }
  }

  static determinBuildingObstructions(grid) {
    for (let z = 0; z < this.SIZE; z++) {
      for (let x = 0; x < this.SIZE; x++) {
        const cell = grid[z][x];
        if (cell.type === 'Building') {

          let obstructedHeight = [];
          obstructedHeight[this.DIRECTION.N] = z === 0 ? 999 : grid[z - 1][x].type === 'Building' ? grid[z - 1][x].height : 0;
          obstructedHeight[this.DIRECTION.E] = x === this.SIZE - 1 ? 999 : grid[z][x + 1].type === 'Building' ? grid[z][x + 1].height : 0;
          obstructedHeight[this.DIRECTION.S] = z === this.SIZE - 1 ? 999 : grid[z + 1][x].type === 'Building' ? grid[z + 1][x].height : 0;
          obstructedHeight[this.DIRECTION.W] = x === 0 ? 999 : grid[z][x - 1].type === 'Building' ? grid[z][x - 1].height : 0;
          cell.obstructedHeight = obstructedHeight;
        }
      }
    }
  }

  static generateVoxels(grid) {
    let voxString = '';
    for (let z = 0; z < this.SIZE * this.BLOCK; z++) {
      const vz = Math.floor(z / this.BLOCK);
      const cz = z % this.BLOCK;
      for (let y = 0; y < this.HEIGHT * this.BLOCK; y++) {
        const vy = Math.floor(y / this.BLOCK);
        const cy = y % this.BLOCK;
        for (let x = 0; x < this.SIZE * this.BLOCK; x++) {
          const vx = Math.floor(x / this.BLOCK);
          const cx = x % this.BLOCK;

          const cell = grid[vz][vx];
          switch (cell.type) {

            case 'Road':
              if (y <= 13) {
                const offset = (cell.definition - 1) * this.BLOCK;
                const vox = this.ROAD[cx + offset + cz * this.BLOCK * 15];
                const voxNX = this.ROAD[cx + 1 + offset + cz * this.BLOCK * 15];
                const voxPX = this.ROAD[cx - 1 + offset + cz * this.BLOCK * 15];
                const voxNZ = this.ROAD[cx + offset + (cz-1) * this.BLOCK * 15];
                const voxPZ = this.ROAD[cx + offset + (cz+1) * this.BLOCK * 15];
                if (vox === 'X' || vox === 'Z') voxString += 'Y';
                else if (voxNX === 'X' || voxPX === 'X') voxString += y<=1 ? 'S' : y === 12 ? 'Z' : y === 13 ? 'Y' : '-';
                else if (voxNZ === 'Z' || voxPZ === 'Z') voxString += y<=1 ? 'S' : y === 12 ? 'Z' : y === 13 ? 'Y' : '-';
                //else if (voxNZ === 'Z') voxString += y>=5 ? 'Z' : y<=1 ? 'S' : '-';
                //else if (voxPZ === 'Z') voxString += y>=5 ? 'Z' : y<=1 ? 'S' : '-';
                else if (y > 1) voxString += '-';
                else if (vox == 'S') voxString += Math.random() < 0.75 ? 'S' : 'T';
                else if (vox === 'U' || vox === 'V') voxString += vox;
                else if (y == 1) voxString += '-';
                else voxString += vox;
              }
              else {
                voxString += '-';
              }
              break;

            case 'Park':
              if (y === 0) {
                voxString += 'S';
              }
              else if (y < this.PARKHEIGHT + 1) {
                const parkIndex = cell.parkIndex;
                // Mirror the quarter park to all quarters
                let vox = this.CITYPARKS.getVoxel(cx < 11 ? cx : 20 - cx, (parkIndex * this.PARKHEIGHT) + y - 1, cz < 11 ? cz : 20 - cz);
                if (vox === 'G') {
                  voxString += Math.random() < 0.66 ? 'G' : 'C';
                }
                else {
                  voxString += vox ?? '-';
                }
              }
              else {
                voxString += '-';
              }
              break;

            case 'Building':
              const allSidesObstructed = cell.obstructedHeight[this.DIRECTION.N] >= y &&
                cell.obstructedHeight[this.DIRECTION.E] >= y &&
                cell.obstructedHeight[this.DIRECTION.S] >= y &&
                cell.obstructedHeight[this.DIRECTION.W] >= y;
              const border = x === 0 || z === 0 || x === this.SIZE * this.BLOCK - 1 || z === this.SIZE * this.BLOCK - 1;

              if (allSidesObstructed || (y < this.GROUNDFLOORHEIGHT && border)) {
                voxString += cell.groundFloorColors['B'];
              }
              else if (y < this.GROUNDFLOORHEIGHT) {
                const groundFloorIndex = cell.groundFloorIndex;
                // Mirror the quarter groundfloor to all quarters
                let vox = this.GROUNDFLOORS.getVoxel(cx < 11 ? cx : 20 - cx, (groundFloorIndex * this.GROUNDFLOORHEIGHT) + y, cz < 11 ? cz : 20 - cz);
                if (vox === 'S') voxString += Math.random() < 0.75 ? 'S' : 'T';
                else voxString += cell.groundFloorColors[vox ?? '-'];
              }
              else if (y <= cell.height) {
                const floorIndex = cell.floorIndex;
                // Mirror the quarter floors to all quarters
                let vox = this.FLOORS.getVoxel(cx < 11 ? cx : 20 - cx, (floorIndex * this.FLOORHEIGHT) + (y - this.GROUNDFLOORHEIGHT) % this.FLOORHEIGHT, cz < 11 ? cz : 20 - cz);
                if (!vox) {
                  if (cz < this.BLOCK / 2 && cx > 0 && cx < this.BLOCK - 1 && cell.obstructedHeight[this.DIRECTION.N] >= y - 1) vox = 'B';
                  else if (cx > this.BLOCK / 2 && cz > 0 && cz < this.BLOCK - 1 && cell.obstructedHeight[this.DIRECTION.E] >= y - 1) vox = 'B';
                  else if (cz > this.BLOCK / 2 && cx > 0 && cx < this.BLOCK - 1 && cell.obstructedHeight[this.DIRECTION.S] >= y - 1) vox = 'B';
                  else if (cx < this.BLOCK / 2 && cz > 0 && cz < this.BLOCK - 1 && cell.obstructedHeight[this.DIRECTION.W] >= y - 1) vox = 'B';
                }
                voxString += cell.floorColors[vox ?? '-'];
              }
              else {
                voxString += '-';
              };
              break;

            default:
              voxString += 'Error';
          }
        }
        voxString += ' ';
      }
      voxString += '\r\n';
    }

    return voxString;
  }

  static createSvoxModel(voxels) {
    // The full svox model for the city with all materials
    return {
      size: { x: this.SIZE * this.BLOCK, y: this.HEIGHT * this.BLOCK, z: this.SIZE * this.BLOCK },
      scale: this.SCALE,
      skip: SKIP.NX | SKIP.PX | SKIP.NY | SKIP.PY | SKIP.NZ | SKIP.PZ,
      lighting: {
        ambient: 0.5,
        direction: { x: 0.5, y: 1, z: 0.5 },
        color: '#FC9',
        ao: 0.2
      },
      meshMaterial: {
        material: 'Basic',
      },
      materials: [
        // Roads
        {
          deform: 10, clamp: CLAMP.Y,
          P: '#FB0', // Parking lines on the road
          Q: '#DDD', // Lines on the road
          R: '#444', // Road
        },
        // Sidewalk
        {
          deform: 3, clamp: CLAMP.Y,
          S: '#888', // Sidewalk
          T: '#999', // Sidewalk lighter
        },
        // Street lights
        {
          deform: 2, 
          Y: '#AAA' // Pole
        },
        {
          deform: 3,
          ao: false,
          Z: '#FFF' // Light
        },
        // Parkings
        {
          deform: 3, clamp: CLAMP.X,
          U: '#DDD'  // Parking wheel stop
        },
        {
          deform: 3, clamp: CLAMP.Z,
          V: '#DDD'  // Parking wheel stop
        },
        // City Parks
        {
          deform: 5, scatter: 0.4, clamp: CLAMP.Y, fade:true,
          G:'#0C0', // Grass
          C:'#0B0'  // Grass dark
        },
        {
          deform: 5, clamp: CLAMP.Y,
          H:'#FDB', // Water rim
          E:'#960'  // Tree trunk
        },
        {
          deform: 2, scatter: 0.2, fade:true, ao: false,
          I:'#38C', // Water 
          J:'#49D'  // Water highlight
        },
        {
          deform: 2, scatter: 0.5, fade:true, ao: false,
          F:'#0A0', // Light Foliage
          K:'#070', // Medium foliage
          D:'#040', // Dark foliage
        },
    
        // Buildings
        { 
          A: '#222', // A = Building beam
          B: '#444', // B = Building wall

          Ca: '#321', // Replace A & B by one of these colors (multi char to prevent eating up many voxel ID's)
          Cb: '#654',
          Cc: '#987',
          Cd: '#CBA',
          Ce: '#FED',
          Cf: '#C88',
          Cg: '#CAA',
          Ch: '#CB8',
          Ci: '#DC9',
          Cj: '#8C8',
          Ck: '#BCB',
          Cl: '#AAC',
          Cm: '#BCD',
          Cn: '#456',
          Co: '#789',

          W: '#234', // Windows 
        }
      ],
      voxels
    };
  }

  static getGroundLevel(worldPosition) {
    // Convert world postion to voxel position
    let x = Math.floor(worldPosition.x * 2 + ((City.CENTER + 0.5) * City.BLOCK));
    let z = Math.floor(worldPosition.z * 2 + ((City.CENTER + 0.5) * City.BLOCK));

    if (this.voxels.getVoxel(x, 2, z)) {
      // Building 
      return -1;
    }
    else if (this.voxels.getVoxel(x, 1, z)) {
      // Sidewalk
      return 0.5;
    }
    // Road
    return 0;
  }
}

