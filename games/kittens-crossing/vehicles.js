
const VEHICLEMODELS = new VoxelMatrix(53, 9, 16, '107-5(6A3-)6A2-5(AQ2AQA3-)AQ2AQA2-5(6A3-)6A214-2(5(T4-T3-)T4-T2-)2(5(6B3-)6B2-)5(6B3-)6B38-A4WA3-A4WA161-2(5(T4-T3-)T4-T2-)2(5(6B3-)6B2-)5(6B3-)6B38-6A3-6A2(38-A4WA3-A4WA)55-2(5(T4-T3-)T4-T2-)2(5(6B3-)6B2-)3(6B3-)6B2-2(8A-8A36-)8A-8A37-6A3-6A38-6A3-6A2(2-5(T4-T3-)T4-T)3(2-5(6B3-)6B)2-4(A4WA3-)3(6W3-6W38-)6A3-6A108-3(5(6B3-)6B2-)4(6A3-)6W3-6W2-4(A4WA3-)6W3-6W11-6A12-A4WA2(3-6W)38-6A3-6A108-5(6B3-)6B2-5(6B3-)6B4(-8A)2-6B3-6B4(-8A)2-6A3-2(6A2-)8A2-6A2-8A2-A4WA3-A4WA2-5(6A3-)6A29-2(6A3-)6A108-5(6B3-)6B2-2(3(6B3-)6B20-)2(3(6W3-)6W20-)3(6A3-)6W47-6A126-5(6B3-)6B2-C4BC3(3-6B)3-C4BC3-6B2-4(6B3-)6C3-6C2-4(6W3-)6C3-6C2-3(6W3-)6W12-6C2-2(6B3-)6A3-6W12-6C2-3S3R3-3S3R12-6A12-6C108-5(6B3-)6B2-C4BC3(3-6B)3-6C3-6B2-4(6B3-)C4-C3-6C2-4(6A3-)C4-C3-6C2-3(6A3-)6A12-6C2-2(6B3-)6A3-6A12-6C2-3S3R3-3S3R12-6A12-6C108-5(6B3-)6B2-C4BC3(3-6B)3-6C3-6B2-4(6B3-)C4-C3-6C2-2(6W3-6A3-)C4-C3-6C2-6W3-6A3-6W3-6A12-6C2-3(6A3-)6A12-6C29-6A12-6C2(2-5(T4-T3-)T4-T)2-5(6B3-)6B2-C4BC3(3-6B)3-6C3-6B2-4(6B3-)C4-C3-6C2-2(6W3-6C3-)C4-C3-6C2-6W3-6A3-6W3-6C12-6C2-3(6A3-)6C12-6C29-6A12-6C2(2-5(T4-T3-)T4-T)2-5(6B3-)6B2-C4BC3(3-6B)3-6C3-6B2-6B3-6C2(3-6B)3-C4-C3-6C2-2(6W3-6C3-)C4-C3-6C2-6W3-6C3-6W3-6A12-6C2-3(6A3-)6C12-6C29-6A12-6C2(2-5(T4-T3-)T4-T)2-5(6B3-)6B2-4(6B3-)6C3-6B2-4(6B3-)C4-C3-6C2-2(6A3-6C3-)C4-C3-2(6C2-3(6A3-)6C12-)6C29-6A12-6C2(2-5(T4-T3-)T4-T)2-5(6B3-)6B2-4(6B3-)6C3-6B2-4(6B3-)C4-C3-6C2-4(6A3-)C4-C3-6C2-A4WA3-6A3-A4WA3-6A12-6C11-2(6A12-)6C29-6A12-6C108-5(6A3-)6A2-4(2R2A2R3-)2R2C2R3-2R2A2R2-4(6A3-)6C3-6C2-2(A4WA3-6A3-)6C3-2(6C11-2(6A12-))6C29-6A12-6C-');

function generateCar(index, color1, color2) {
  let voxels = '';
  const offset = index * 9;
  for (let z = 0; z < 16; z++) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 8; x++) {
        voxels += VEHICLEMODELS.getVoxel(offset + x, y, z) ?? '-';
      }
    }
  }

  return {
    size: { x: 8, y: 9, z: 16 },
    scale: 0.25,
    meshMaterial: {
      material: 'Lambert',
      //wireframe: true,
    },
    materials: [
      { B: color1, C: color2 }, // Body
      {
        deform: 3, clamp: CLAMP.X, // Smooth front and back of the Body 
        A: color1
      },
      { deform:2, clamp: CLAMP.X,
        Q: '#FC0', R: '#F00', S: '#03C' // Lights
      }, 
      {
        deform: 3, clamp: CLAMP.X, // Windows
        W: '#234'
      },
      {
        deform: 4, clamp: CLAMP.X, // Tires
        T: '#222'
      }
    ],
    voxels
  }
}

SVOX.models.PoliceCar = generateCar(0, '#CCC', '#00F');
SVOX.models.Ambulance = generateCar(1, '#CCC', '#C00');
SVOX.models.FireTruck = generateCar(1, '#D21', '#D21');
SVOX.models.CarRed = generateCar(2, '#A00', '#A00');
SVOX.models.CarGreen = generateCar(2, '#482', '#482');
SVOX.models.CarBlue = generateCar(2, '#59A', '#59A');
SVOX.models.CarGrey = generateCar(2, '#667', '#667');
SVOX.models.CarTan = generateCar(2, '#987', '#987');
SVOX.models.Van = generateCar(3, '#CCC', '#048');
SVOX.models.PickupTruck = generateCar(4, '#CCC', '#840');
SVOX.models.Truck = generateCar(4, '#CCC', '#482');

const NSIDE = 0;
const WSIDE = 0;
const SSIDE = 1;
const ESIDE = 1;

const NLANE = 0.33;
const WLANE = NLANE;
const SLANE = 1 - NLANE;
const ELANE = 1 - WLANE;
const MLANE = 0.5;
const PARKING = 0.5;

// Northwards to Northwards (i.e. enter south, exit north)
const NTON = [{ x: ELANE, z: SSIDE }, { x: ELANE, z: NSIDE }];
const ETOE = [{ x: WSIDE, z: SLANE }, { x: SSIDE, z: SLANE }];
const STOS = [{ x: WLANE, z: NSIDE }, { x: WLANE, z: SSIDE }];
const WTOW = [{ x: ESIDE, z: NLANE }, { x: WSIDE, z: NLANE }];

// Northwards to Eastwards (i.e. enter south, exist east)
const NTOE = [{ x: ELANE, z: SSIDE }, { x: ELANE, z: SLANE }, { x: ESIDE, z: SLANE }];
const ETON = [{ x: WSIDE, z: SLANE }, { x: MLANE, z: MLANE }, { x: ELANE, z: NSIDE }];
const ETOS = [{ x: WSIDE, z: SLANE }, { x: WLANE, z: SLANE }, { x: WLANE, z: SSIDE }];
const STOE = [{ x: WLANE, z: NSIDE }, { x: MLANE, z: MLANE }, { x: ESIDE, z: SLANE }];
const STOW = [{ x: WLANE, z: NSIDE }, { x: WLANE, z: NLANE }, { x: WSIDE, z: NLANE }];
const WTOS = [{ x: ESIDE, z: NLANE }, { x: MLANE, z: MLANE }, { x: WLANE, z: SSIDE }];
const WTON = [{ x: ESIDE, z: NLANE }, { x: ELANE, z: NLANE }, { x: ELANE, z: NSIDE }];
const NTOW = [{ x: ELANE, z: SSIDE }, { x: MLANE, z: MLANE }, { x: WSIDE, z: NLANE }];


const PARK  = 10.5/21;
const PARKN =  2.5/21;
const PARKS = 18.5/21;
const PARKE = PARKS;
const PARKW = PARKN;

// Southwards to Park on the West side to Northwards
const STOPWTON = [{ x: WLANE, z: NSIDE }, { x: MLANE, z: PARK }, { x: PARKW, z: PARK, dir: 90}, 
                  { x: MLANE, z: PARK, dir: 90 }, { x: ELANE, z: NSIDE, dir:0 }];
const STOPETON = [{ x: WLANE, z: NSIDE }, { x: MLANE, z: PARK }, { x: PARKE, z: PARK, dir: -90}, 
                  { x: MLANE, z: PARK, dir: -90 }, { x: ELANE, z: NSIDE, dir:0 }];
const WTOPNTOE = [{ x: ESIDE, z: NLANE }, { x: PARK, z: MLANE }, { x: PARK, z: PARKN, dir: 0 }, 
                  { x: PARK, z: MLANE, dir: 0 }, { x: ESIDE, z: SLANE, dir: -90 }];
const WTOPSTOE = [{ x: ESIDE, z: NLANE }, { x: PARK, z: MLANE }, { x: PARK, z: PARKS, dir: 180 }, 
                  { x: PARK, z: MLANE, dir: 180 }, { x: ESIDE, z: SLANE, dir: -90 }];
const NTOPETOS = [{ x: ELANE, z: SSIDE }, { x: MLANE, z: PARK }, { x: PARKE, z: PARK, dir: -90}, 
                  { x: MLANE, z: PARK, dir: -90 }, { x: WLANE, z: SSIDE, dir: 180 }];
const NTOPWTOS = [{ x: ELANE, z: SSIDE }, { x: MLANE, z: PARK }, { x: PARKW, z: PARK, dir: 90}, 
                  { x: MLANE, z: PARK, dir: 90 }, { x: WLANE, z: SSIDE, dir: 180 }];
const ETOPTOW = [{ x: WSIDE, z: SLANE }, { x: PARKING, z: SLANE },
                 { x: PARKING, z: NLANE }, { x: WSIDE, z: NLANE }];
const ETOPSTOW = [{ x: WSIDE, z: SLANE }, { x: PARK, z: MLANE }, { x: PARK, z: PARKS, dir: 180 }, 
                  { x: PARK, z: MLANE, dir: 180 }, { x: WSIDE, z: NLANE, dir: 90 }];
const ETOPNTOW = [{ x: WSIDE, z: SLANE }, { x: PARK, z: MLANE }, { x: PARK, z: PARKN, dir: 0 }, 
                  { x: PARK, z: MLANE, dir: 0 }, { x: WSIDE, z: NLANE, dir: 90 }];

const VEHICLEMOVEMENTS = [
  // 0 = Building
  {},
  // 1  = N___
  { S: [STOPWTON, STOPETON ] },
  // 2  = _E__
  { W: [WTOPNTOE, WTOPSTOE ] },
  // 3  = NE__
  { S: [STOE], W: [WTON] },
  // 4  = __S_
  { N: [NTOPETOS, NTOPWTOS ] },
  // 5  = N_S_
  { N: [NTON], S: [STOS] },
  // 6  = _ES_
  { N: [NTOE], W: [WTOS] },
  // 7  = NES_
  { S: [STOS, STOE], N: [NTON, NTOE], W: [WTOS, WTON] },
  // 8  = ___W
  { E: [ETOPSTOW, ETOPNTOW] },
  // 9  = N__W
  { S: [STOW], E: [ETON] },
  // 10 = _E_W
  { E: [ETOE], W: [WTOW] },
  // 11 = NE_W
  { E: [ETOE, ETON], W: [WTOW, WTON], S: [STOE, STOW] },
  // 12 = __SW
  { N: [NTOW], E: [ETOS] },
  // 13 = N_SW
  { N: [NTON, NTOW], S: [STOS, STOW], E: [ETON, ETOS] },
  // 14 = _ESW
  { E: [ETOE, ETOS], W: [WTOW, WTOS], N: [NTOE, NTOW] },
  // 15 = NESW
  { N: [NTON, NTOW, NTOE], S: [STOS, STOE, STOW], W: [WTOW, WTOS, WTON], E: [ETOE, ETON, ETOS] }
];

const VEHICLESTEPLENGTH = 1500;
const VEHICLES = [];

AFRAME.registerComponent("vehicle", {
  schema: { type: 'string' },
  init: function () {
    this.pickRandomPosition();
  },

  tick(time, timeDelta) {
    this.stepTime += timeDelta / VEHICLESTEPLENGTH;
    let overTime = this.stepTime > 1 ? this.stepTime - Math.floor(this.stepTime) : 0;
    this.stepTime = this.stepTime > 1 ? 1 : this.stepTime;
    let newPosition = this.handleStep();
    if (overTime) {
      this.stepTime = overTime;
      this.startNextStep(newPosition, time);
      this.handleStep();
    }
  },

  pickRandomPosition() {
    this.cell = null;
    while (!this.cell) {
      const x = Math.floor(Math.random() * City.SIZE);
      const z = Math.floor(Math.random() * City.SIZE);
      if (City.grid[z][x].type === 'Road' && !City.grid[z][x].occupied) {
        this.cell = City.grid[z][x];
        City.grid[z][x].occupied = true;
        this.position = { x: (x - City.SIZE / 2), z: (z - City.SIZE / 2) };
        this.direction = 0;
        this.movement = null;
        while (!this.movement) {
          let direction = 'NESW'[Math.floor(Math.random()*4)];
          this.movement = VEHICLEMOVEMENTS[this.cell.definition]?.[direction]?.[0];
        }
        this.stepTime = 0;
        this.handleStep();
        this.el.object3D.position.x = this.position.x * City.BLOCK * 0.5;
        this.el.object3D.position.z = this.position.z * City.BLOCK * 0.5;
      }
    }
  },

  handleStep() {
    const segmentTransformationsBack = this.calculatePosition(this.movement, this.stepTime - 0.2);
    const segmentTransformations = this.calculatePosition(this.movement, this.stepTime);
    const segmentTransformationsFront = this.calculatePosition(this.movement, this.stepTime + 0.2);

    const deltaX = segmentTransformationsFront.x - segmentTransformationsBack.x;
    const deltaZ = segmentTransformationsFront.z - segmentTransformationsBack.z;
    let rotationY = Math.atan2(deltaX, deltaZ) + Math.PI;
    if (segmentTransformations.dir != undefined) {
      rotationY = segmentTransformations.dir / 180 * Math.PI;
    }

    const position = this.el.object3D.position;
    position.x = (position.x * 9 + (this.position.x + segmentTransformations.x) * City.BLOCK * 0.5)/10;
    position.z = (position.z * 9 + (this.position.z + segmentTransformations.z) * City.BLOCK * 0.5)/10;
    const rotation = this.el.object3D.rotation;

    let diff = rotationY - rotation.y;
    if (diff > Math.PI) diff -= 2*Math.PI;
    if (diff < -Math.PI) diff += 2*Math.PI;
    rotation.y = ((rotation.y + diff / 10) + 2 * Math.PI) % (2 * Math.PI);

    return segmentTransformations;
  },

  startNextStep(newPosition, time) {
    let movements = null;
    let nextCell = null;
    let direction = null;
    
    if (newPosition.x < 0.1) {
      nextCell = City.grid[this.cell.z][this.cell.x - 1];
      direction = 'W';
    }
    else if (newPosition.x > 0.9) {
      nextCell = City.grid[this.cell.z][this.cell.x + 1];
      direction = 'E';
    }
    else if (newPosition.z < 0.1) {
      nextCell = City.grid[this.cell.z - 1][this.cell.x];
      direction = 'N';
    }
    else if (newPosition.z > 0.9) {
      nextCell = City.grid[this.cell.z + 1][this.cell.x];
      direction = 'S';
    }

    let directionCount = nextCell.definition.toString(2).split('1').length - 1;
    if (!nextCell.occupied
        || directionCount === 1 
        || (directionCount === 2 && nextCell.occupied !== direction)
        || (this.maxDelay && this.maxDelay < time)) {
      this.cell.occupied = false;
      nextCell.occupied = direction;
      this.cell = nextCell;
      let movements = VEHICLEMOVEMENTS[nextCell.definition]?.[direction];
      this.position = { x: (nextCell.x - City.SIZE / 2), z: (nextCell.z - City.SIZE / 2) };
      let randomMovement = Math.floor(Math.random() * movements.length);
      this.movement = movements[randomMovement];
      this.maxDelay = null;
    }
    else if (this.maxDelay) {
      this.stepTime = 1;
    }
    else if (!this.maxDelay) {
      this.stepTime = 1;
      this.maxDelay = time + VEHICLESTEPLENGTH + Math.random()*VEHICLESTEPLENGTH;
    }
  },

  calculatePosition(movement, stepTime) {
    // Clamp stepTime to the valid range [0, 1]
    stepTime = Math.max(0, Math.min(1, stepTime));

    const numSegments = movement.length - 1;

    if (numSegments <= 0) {
      // If there is only one or zero steps, return the first step or a default
      return movement[0] || { x: 0, z: 0 };
    }

    // Calculate the index of the current segment
    const segmentIndex = Math.floor(stepTime * numSegments);

    // Get the start and end points of the current segment
    const startPoint = movement[segmentIndex];
    const endPoint = movement[Math.min(segmentIndex + 1, numSegments)];

    // Calculate the local progress within the current segment
    const localStepTime = (stepTime * numSegments) - segmentIndex;

    // Linear interpolation function
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    // Calculate the interpolated position
    const currentX = lerp(startPoint.x, endPoint.x, localStepTime);
    const currentZ = lerp(startPoint.z, endPoint.z, localStepTime);

    return { x: currentX, z: currentZ, dir:endPoint.dir };
  }
});

