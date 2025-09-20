var canvas = null;
var ctx = null;
const worldWidth = 16;
const worldHeight = 16;

var spritesheet = null;
var spritesheetLoaded = false;

var world = [[]];
var tileWidth = 32;
var tileHeight = 32;
var interval;

var pathStart = [worldWidth / 2, worldHeight / 2];
var pathEnd = [0, 0];
var currentPath = [];
var playerHiddenLocation = -1;

var enemyImg = new Image();
var friendsImg;
var charactersImg;
var bloodImg;
var nameImg

let timeouts = [];

let isMoving = false;

let enemy = {
  pathStart: [],
  currentPath: [],
  pathEnd: [],
  isMoving: false,
  color: "#3a4c64",
  isReturning: false,
  spot: -1,
};

let friends = []

const defaultFriends = [
  {
    pathStart: [],
    currentPath: [],
    pathEnd: [],
    isMoving: false,
    color: "#3a4c64",
  },
  {
    pathStart: [],
    currentPath: [],
    pathEnd: [],
    isMoving: false,
    color: "#909e8d",
  },
  {
    pathStart: [],
    currentPath: [],
    pathEnd: [],
    isMoving: false,
    color: "#c19e7e",
  },
  {
    pathStart: [],
    currentPath: [],
    pathEnd: [],
    isMoving: false,
    color: "#393124",
  },
];

let hiddingSpots = []

const defaultHiddingSpots = [
  {
    pos: [5, 5],
    occupied: false,
    taken: false,
    w: 43,
    h: 32,
    off: [-5, 0],
    hidden: -1,
    image: 1,
  },
  {
    pos: [2, 11],
    occupied: false,
    taken: false,
    hidden: -1,
    image: 2,
    w: 32,
    h: 32,
  },
  {
    pos: [4, 7],
    occupied: false,
    taken: false,
    hidden: -1,
    image: 3,
    w: 32,
    h: 32,
  },
  {
    pos: [2, 4],
    occupied: false,
    taken: false,
    hidden: -1,
    image: 4,
    w: 32,
    h: 32,
  },
  {
    pos: [10, 10],
    occupied: false,
    taken: false,
    hidden: -1,
    image: 5,
    off: [-8, 0],
    w: 48,
    h: 30,
  },
];

var ac = new AudioContext(),
  // get the current Web Audio timestamp (this is when playback should begin)
  when = ac.currentTime,
  // set the tempo
  tempo = 132,
  // initialize some vars
  sequence1,
  sequence2,
  sequence3,
  // create an array of "note strings" that can be passed to a sequence
  //   'w' is a whole note
  // 'h' is a half note
  // 'q' is a quarter note
  // 'e' is an eighth note
  // 's' is a sixteenth note
  lead = [
    "G4  e",
    "-   e",
    "G3  e",
    "-   e",
    "F4  e",
    "-   e",
    "G#4  e",
    "-   e",
    "G4  e",
    "-   e",

    "G3  e",
    "-   e",
    "F4  e",
    "-   e",
    "G#4  e",
    "-   e",
    "G4  e",
    "-   e",

    "G3  e",
    "-   e",
    "F4  e",
    "-   e",
    "G#4  e",
    "-   e",
    "G4  e",
    "-   e",

    "G4  e",
    "-   e",
    "F4  e",
    "-   e",
    "G#4  e",
    "-   e",
  ],
  harmony = [
    "D4  e",
    "D3  e",
    "D4  e",
    "D3  e",
    "F4  e",
    "D3  e",
    "F4  e",
    "D3  e",
    "D4  e",
    "D3  e",
    "D4  e",
    "D3  e",
    "F4  e",
    "D3  e",
    "F4  e",
    "D3  e",
  ],
  // harmony = [
  //   'B3  s',
  //   'B2  s',
  //   'F#3 s',
  //   'B2  s',
  //   'B3  s',
  //   'B2  s',
  //   'F#3 s',
  //   'B2  s',

  //   'G2  e',
  //   'A2  e',
  //   'Bb2 e',
  //   'A2  e',

  //   'B3  s',
  //   'B2  s',
  //   'F#3 s',
  //   'B2  s',
  //   'B3  s',
  //   'B2  s',
  //   'F#3 s',
  //   'B2  s',

  //   'G2  e',
  //   'A2  e',
  //   'Bb2 e',
  //   'A2  e',
  // ],
  bass = [
    "D3  q",
    "-   h",
    "D3  q",

    "A2  q",
    "-   h",
    "A2  q",

    "Bb2 q",
    "-   h",
    "Bb2 q",

    "F2  h",
    "A2  h",
  ];

// create 3 new sequences (one for lead, one for harmony, one for bass)
sequence1 = new TinyMusic.Sequence(ac, tempo, lead);
sequence2 = new TinyMusic.Sequence(ac, tempo, harmony);
sequence3 = new TinyMusic.Sequence(ac, tempo, bass);

// set staccato and smoothing values for maximum coolness
sequence1.staccato = 0.55;
sequence2.staccato = 0.55;
sequence3.staccato = 0.05;
sequence3.smoothing = 0.4;

// adjust the levels so the bass and harmony aren't too loud
sequence1.gain.gain.value = 0.3;
sequence2.gain.gain.value = 0.2;
sequence3.gain.gain.value = 0.1;

// apply EQ settings
sequence1.mid.frequency.value = 800;
sequence1.mid.gain.value = 3;
sequence2.mid.frequency.value = 1200;
sequence3.mid.gain.value = 3;
sequence3.bass.gain.value = 6;
sequence3.bass.frequency.value = 80;
sequence3.mid.gain.value = -6;
sequence3.mid.frequency.value = 500;
sequence3.treble.gain.value = -2;
sequence3.treble.frequency.value = 1400;

if (typeof console == "undefined") var console = { log: function () {} };

function generateHiddingSpots() {
  hiddingSpots.forEach((hs, i) => {
    let hiddingSpotPos = [-1, -1];
    while (hiddingSpotPos[0] == -1 && hiddingSpotPos[1] == -1) {
      const hiddingSpotX = getRandomInt(2, 13);
      const hiddingSpotY = getRandomInt(2, 13);
      if (world[hiddingSpotX][hiddingSpotY] === 0) {
        hiddingSpotPos = [hiddingSpotX, hiddingSpotY];
        world[hiddingSpotX][hiddingSpotY] = -1;
      }
    }
    hs.pos = hiddingSpotPos;
  });
  return true;
}

var image1;
var image2;
var image3;
var image4;
var image5;

function loadImages() {
  image1 = new Image();
  image1.src = "./assets/tent.png"

  image2 = new Image();
  image2.src = `./assets/bush1.png`;

  image3 = new Image();
  image3.src = `./assets/log.png`;

  image4 = new Image();
  image4.src = `./assets/bush2.png`;

  image5 = new Image();
  image5.src = `./assets/log2.png`;

  bloodImg = new Image();
  bloodImg.src = `./assets/blood.png`;

  nameImg = new Image()
  nameImg.src = `./assets/name.png`;
}

function onload() {
  console.log("Page loaded.");
  canvas = document.getElementById("gameCanvas");
  canvas.width = worldWidth * tileWidth;
  canvas.height = worldHeight * tileHeight;
  canvas.addEventListener("click", canvasClick, false);
  if (!canvas) alert("Blah!");
  ctx = canvas.getContext("2d");
  if (!ctx) alert("Hmm!");
  ctx.imageSmoothingEnabled = false;
  loadImages();
  hiddingSpots = JSON.parse(JSON.stringify(defaultHiddingSpots))
  friends = JSON.parse(JSON.stringify(defaultFriends))
  spritesheet = new Image();
  spritesheet.src = "./assets/enemy.png";
  spritesheet.onload = loaded;
}

function loaded() {
  console.log("Spritesheet loaded.");
  spritesheetLoaded = true;
  enemyImg.src = "./assets/enemy.png";
  createWorld();
}

function clearWorld() {
  for (var x = 0; x < 16; x++) {
    world[x] = [];

    for (var y = 0; y < 16; y++) {
      world[x][y] = 0;
    }
  }
}

function createWorld() {
  console.log("Creating world...");

  clearWorld()

  generateHiddingSpots();

  currentPath = [];
  generateFriends();
  startMovingFriends();

  interval = setInterval(() => {
    update();
  }, 500);
}

function drawBlood(x, y) {
  ctx.globalAlpha = 0.4;
  ctx.drawImage(bloodImg, x, y, tileWidth, tileHeight);
  ctx.globalAlpha = 1;
}

function redraw() {
  if (!spritesheetLoaded) return;

  console.log("redrawing...");

  var spriteNum = 0;

  //ctx.fillStyle = "#000000";
  ctx.fillStyle = "rgba(165,193,80, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var x = 0; x < worldWidth; x++) {
    for (var y = 0; y < worldHeight; y++) {
      if (world[x][y] === -11) {
        ctx.drawImage(image1, x * tileWidth - 5, y * tileHeight, 43, 32);
        drawBlood(x * tileWidth, y * tileHeight);
      } else if (world[x][y] === -12) {
        ctx.drawImage(
          image2,
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
        drawBlood(x * tileWidth, y * tileHeight);
      } else if (world[x][y] === -13) {
        ctx.drawImage(
          image3,
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
        drawBlood(x * tileWidth, y * tileHeight);
      } else if (world[x][y] === -14) {
        ctx.drawImage(
          image4,
          x * tileWidth,
          y * tileHeight,
          tileWidth,
          tileHeight
        );
        drawBlood(x * tileWidth, y * tileHeight);
      }
      if (world[x][y] === -15) {
        ctx.drawImage(image5, x * tileWidth - 8, y * tileHeight, 48, 30);
        drawBlood(x * tileWidth, y * tileHeight);
      }
    }
  }

  const getImage = (index) => {
    switch (index) {
      case 1:
        return image1;
      case 2:
        return image2;
      case 3:
        return image3;
      case 4:
        return image4;
      case 5:
        return image5;
    }
  };

  hiddingSpots.forEach((hs) => {
    ctx.fillStyle = hs.taken ? "white" : "grey";
    const xOffset = hs.off ? hs.off[0] : 0;
    const yOffset = hs.off ? hs.off[1] : 0;
    ctx.drawImage(
      getImage(hs.image),
      hs.pos[0] * tileWidth + xOffset,
      hs.pos[1] * tileHeight + yOffset,
      hs.w,
      hs.h
    );
  });

  drawPlayer();

  if (state === STATES.HIDDING) {
    drawFriends();
  } else {
    drawEnemy();
  }
}

function canvasClick(e) {
  if (state === STATES.GAME_START) {
    //start the lead part immediately
    sequence1.play(when);
    // delay the harmony by 16 beats
    sequence2.play(when); //+ ( 60 / tempo ) * 16 );
    // start the bass part immediately
    //sequence3.play( when );
    state = STATES.HIDDING;
  } else if (state === STATES.HIDDING) {
    if (isMoving) return;

    var x;
    var y;

    if (e.pageX != undefined && e.pageY != undefined) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    var cell = [Math.floor(x / tileWidth), Math.floor(y / tileHeight)];

    console.log("we clicked tile " + cell[0] + "," + cell[1]);

    //pathStart = pathEnd;
    pathEnd = cell;

    currentPath = findPath(world, pathStart, pathEnd);
    isMoving = true;
    // move()
    // redraw();
  }
}

function findPath(world, pathStart, pathEnd) {
  var abs = Math.abs;
  var max = Math.max;
  var pow = Math.pow;
  var sqrt = Math.sqrt;

  var maxWalkableTileNum = 0;

  var worldSize = worldWidth * worldHeight;

  var distanceFunction = DiagonalDistance;
  var findNeighbours = DiagonalNeighboursFree;

  //var distanceFunction = ManhattanDistance;
  //var findNeighbours = function(){}; // empty
  /*

	// alternate heuristics, depending on your game:

	// diagonals allowed but no sqeezing through cracks:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighbours;

	// diagonals and squeezing through cracks allowed:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighboursFree;

	// euclidean but no squeezing through cracks:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighbours;

	// euclidean and squeezing through cracks allowed:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighboursFree;

	*/

  function ManhattanDistance(Point, Goal) {
    return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
  }

  function DiagonalDistance(Point, Goal) {
    return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
  }

  function EuclideanDistance(Point, Goal) {
    return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
  }

  function Neighbours(x, y) {
    var N = y - 1,
      S = y + 1,
      E = x + 1,
      W = x - 1,
      myN = N > -1 && canWalkHere(x, N),
      myS = S < worldHeight && canWalkHere(x, S),
      myE = E < worldWidth && canWalkHere(E, y),
      myW = W > -1 && canWalkHere(W, y),
      result = [];
    if (myN) result.push({ x: x, y: N });
    if (myE) result.push({ x: E, y: y });
    if (myS) result.push({ x: x, y: S });
    if (myW) result.push({ x: W, y: y });
    findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
    return result;
  }

  function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result) {
    if (myN) {
      if (myE && canWalkHere(E, N)) result.push({ x: E, y: N });
      if (myW && canWalkHere(W, N)) result.push({ x: W, y: N });
    }
    if (myS) {
      if (myE && canWalkHere(E, S)) result.push({ x: E, y: S });
      if (myW && canWalkHere(W, S)) result.push({ x: W, y: S });
    }
  }

  function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result) {
    myN = N > -1;
    myS = S < worldHeight;
    myE = E < worldWidth;
    myW = W > -1;
    if (myE) {
      if (myN && canWalkHere(E, N)) result.push({ x: E, y: N });
      if (myS && canWalkHere(E, S)) result.push({ x: E, y: S });
    }
    if (myW) {
      if (myN && canWalkHere(W, N)) result.push({ x: W, y: N });
      if (myS && canWalkHere(W, S)) result.push({ x: W, y: S });
    }
  }

  function canWalkHere(x, y) {
    return (
      world[x] != null &&
      world[x][y] != null &&
      world[x][y] <= maxWalkableTileNum
    );
  }

  function Node(Parent, Point) {
    var newNode = {
      Parent: Parent,
      value: Point.x + Point.y * worldWidth,
      x: Point.x,
      y: Point.y,
      f: 0,
      g: 0,
    };

    return newNode;
  }

  function calculatePath() {
    var mypathStart = Node(null, { x: pathStart[0], y: pathStart[1] });
    var mypathEnd = Node(null, { x: pathEnd[0], y: pathEnd[1] });
    var AStar = new Array(worldSize);
    var Open = [mypathStart];
    var Closed = [];
    var result = [];
    var myNeighbours;
    var myNode;
    var myPath;
    var length, max, min, i, j;
    while ((length = Open.length)) {
      max = worldSize;
      min = -1;
      for (i = 0; i < length; i++) {
        if (Open[i].f < max) {
          max = Open[i].f;
          min = i;
        }
      }
      myNode = Open.splice(min, 1)[0];
      if (myNode.value === mypathEnd.value) {
        myPath = Closed[Closed.push(myNode) - 1];
        do {
          result.push([myPath.x, myPath.y]);
        } while ((myPath = myPath.Parent));
        AStar = Closed = Open = [];
        result.reverse();
      } else {
        myNeighbours = Neighbours(myNode.x, myNode.y);
        for (i = 0, j = myNeighbours.length; i < j; i++) {
          myPath = Node(myNode, myNeighbours[i]);
          if (!AStar[myPath.value]) {
            myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
            myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
            Open.push(myPath);
            AStar[myPath.value] = true;
          }
        }
        Closed.push(myNode);
      }
    }
    return result;
  }

  return calculatePath();
}

function generateFriend(i) {
  let hiddingSpot = null;
  let friendCurrentPath = [];
  while (hiddingSpot == null) {
    const hiddingSpotIndex = getRandomInt(0, hiddingSpots.length - 1);
    hiddingSpot = hiddingSpots[hiddingSpotIndex];
    if (!hiddingSpot || hiddingSpot.occupied) [(hiddingSpot = null)];
  }

  hiddingSpot.occupied = true;

  let friendPathStartX;
  let friendPathStartY;
  let friendPathStart;

  friendPathStartX = i + 5;
  friendPathStartY = 0;
  friendPathStart = [friendPathStartX, friendPathStartY];
  world[(friendPathStartX, friendPathStartY)] = 0;
  friendCurrentPath = findPath(world, friendPathStart, hiddingSpot.pos);

  return { friendPathStart, friendCurrentPath, hiddingSpot };
}

function generateFriends() {
  friends.forEach((friend, i) => {
    const { friendPathStart, friendCurrentPath, hiddingSpot } =
      generateFriend(i);

    friend.pathStart = friendPathStart;
    friend.currentPath = friendCurrentPath;
    friend.pathEnd = hiddingSpot.pos;
  });
}

function startMovingFriends() {
  friends.forEach((friend) => (friend.isMoving = true));
}

function generateEnemy(isEntering = true) {
  if (isEntering) {
    const hiddingSpotIndex = getRandomInt(0, hiddingSpots.length - 1);
    const hiddingSpot = hiddingSpots[hiddingSpotIndex];
    const hiddingSpotPos = [hiddingSpot.pos[0] - 1, hiddingSpot.pos[1]];

    const enemyPathStart = [7, 1];

    const enemyCurrentPath = findPath(world, enemyPathStart, hiddingSpotPos);
    console.log(enemyCurrentPath);
    enemy.spot = hiddingSpotIndex;
    enemy.currentPath = enemyCurrentPath;
    enemy.pathEnd = hiddingSpotPos;
    enemy.pathStart = enemyPathStart;
    enemy.isMoving = true;
    enemy.isReturning = !isEntering;
  } else {
    const enemyPathEnd = [7, 0];

    const enemyCurrentPath = findPath(world, enemy.pathStart, enemyPathEnd);
    enemy.currentPath = enemyCurrentPath;
    enemy.pathEnd = enemyPathEnd;
    enemy.isMoving = true;
    enemy.isReturning = !isEntering;
  }
}

function cleanHiddingSpots() {
  hiddingSpots.forEach((hs) => {
    world[hs.pos[0]][hs.pos[1]] = 0;
    hs.hidden = -1;
  });
}

function move() {
  if (isMoving) {
    const hiddenSpot = hiddingSpots.filter(
      (hs) => hs.pos[0] === currentPath[0][0] && hs.pos[1] === currentPath[0][1]
    );
    if (hiddenSpot.length) {
      console.log(hiddenSpot[0].hidden);
      if (hiddenSpot[0].hidden != -1) {
        pathStart = pathStart;
        currentPath = pathStart;
        pathEnd = pathStart;
        isMoving = false;
        return;
      }
    }
    if (currentPath.length == 1) {
      isMoving = false;
      pathStart = currentPath[0];
    } else {
      pathStart = currentPath.shift();
    }
    playerHiddenLocation = isHidden();
    if (playerHiddenLocation !== -1) {
      hiddingSpots[playerHiddenLocation].occupied = true;
    }
  }
}

function isHidden() {
  return hiddingSpots.findIndex((hs) => {
    const x = pathStart[0];
    const y = pathStart[1];

    return hs.pos[0] === x && hs.pos[1] === y;
  });
}

function moveEnemy() {
  if (enemy.isMoving) {
    if (enemy.currentPath.length == 1) {
      enemy.isMoving = false;
      enemy.pathStart = enemy.currentPath[0];
      if (enemy.isReturning) {
        state = STATES.HIDDING;
        sequence1.play(when);
        sequence2.play(when); //+ ( 60 / tempo ) * 16 );
        tick = TICK_START;
        pathStart = [worldWidth / 2, worldHeight / 2];
        startMovingFriends();
      }
    } else {
      enemy.pathStart = enemy.currentPath.shift();
    }
  }
}

function drawEnemy() {
  drawPerson(
    enemy.pathStart[0] * tileWidth,
    enemy.pathStart[1] * tileHeight,
    "white"
  );
  const x = enemy.pathStart[0] * tileWidth;
  const y = enemy.pathStart[1] * tileHeight;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(x + 26, y + 17);
  ctx.lineTo(x + 30, y);
  ctx.lineTo(x + 28, y + 17);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function moveFriends() {
  friends.forEach((friend, i) => {
    if (friend.isMoving) {
      if (friend.currentPath.length == 1) {
        friend.isMoving = false;
        friendPathStartX = i + 5;
        friendPathStartY = 0;
        friend.pathStart = [friendPathStartX, friendPathStartY];
        const hiddenSpot = hiddingSpots.filter(
          (hs) =>
            hs.pos[0] === friend.currentPath[0][0] &&
            hs.pos[1] === friend.currentPath[0][1]
        );
        if (hiddenSpot && hiddenSpot.length) {
          if (!hiddenSpot[0].taken) {
            hiddenSpot[0].hidden = i;
          } else {
            const { friendPathStart, friendCurrentPath, hiddingSpot } =
              generateFriend(friend);

            friend.pathStart = friendPathStart;
            friend.currentPath = friendCurrentPath;
            friend.pathEnd = hiddingSpot.pos;
            friend.isMoving = true;
          }
        }
        return;
      }

      let path = friend.currentPath.shift();
      friend.pathStart = path;

      if (playerHiddenLocation !== -1) {
        const hsPos = hiddingSpots[playerHiddenLocation].pos;
        if (friend.pathEnd[0] === hsPos[0] && friend.pathEnd[1] === hsPos[1]) {
          console.log(hiddingSpots);
          const hiddingSpot = hiddingSpots.filter(
            (hs) => hs.occupied === false
          )[0];
          friendCurrentPath = findPath(world, path, hiddingSpot.pos);
          friend.currentPath = friendCurrentPath;
          playerHiddenLocation = -1;
          //generateFriend(friend)
        }
      }
    }
  });
}

function drawFriends() {
  friends.forEach((friend) => {
    if (!friend.isMoving) return;
    if (!friend.pathStart) return;
    drawPerson(
      friend.pathStart[0] * tileWidth,
      friend.pathStart[1] * tileHeight,
      friend.color
    );
  });
}

var TICK_START = 20;
var tick = TICK_START;
var enemyTick = 5;
var gameOverTick = 0;
var canMoveFriends = false;
var STATES = {
  HIDDING: "HIDDING",
  TRANSITION: "TRANSITION",
  ATTACK: "ATTACK",
  GAME_OVER: "GAME_OVER",
  YOU_WIN: "YOU_WIN",
  GAME_START: "GAME_START",
};
var state = STATES.GAME_START;

function updateDebug() {
  const debugDiv = document.getElementById("debug");
  debugDiv.innerHTML = `TICK: ${tick}`;
  debugDiv.innerHTML += `\nENEMY CPATH: ${enemy.currentPath.length}`;
  debugDiv.innerHTML += `\nENEMY TICK: ${enemyTick}`;
}

function update() {
  //updateDebug();
  if (state === STATES.GAME_OVER) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(enemyImg, 25, 75, canvas.width - 50, canvas.height - 75);

    if (gameOverTick > 6) {
      state = STATES.GAME_START;
      gameOverTick = 0;
    } else if (gameOverTick > 3) {
      ctx.font = "bold 32px serif";
      ctx.fillStyle = "white";
      const TEXT = "No one survived that night";
      const textSize = ctx.measureText(TEXT).width;
      ctx.fillText(TEXT, canvas.width / 2 - textSize / 2, 100);
      clearWorld()
      hiddingSpots = JSON.parse(JSON.stringify(defaultHiddingSpots))
      friends = JSON.parse(JSON.stringify(defaultFriends))

      generateHiddingSpots();
      currentPath = [];
      generateFriends();
    }
    gameOverTick++;
  } else if (state === STATES.GAME_START) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(nameImg, tileWidth * 2, 64, tileWidth * 12, 4 * tileHeight)

    ctx.font = "bold 32px serif";
    ctx.fillStyle = "white";
    const TEXT = "This is what happened that night";
    const textSize = ctx.measureText(TEXT).width;
    ctx.fillText(TEXT, canvas.width / 2 - textSize / 2, 300);
    ctx.font = "bold 24px serif";
    const TEXT2 = "Use the mouse to hide before he gets you";
    const textSize2 = ctx.measureText(TEXT2).width;
    ctx.fillText(TEXT2, canvas.width / 2 - textSize2 / 2, 350);
  } else if (state === STATES.YOU_WIN) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 32px serif";
    ctx.fillStyle = "white";
    const TEXT = "You were the only survivor.";
    const textSize = ctx.measureText(TEXT).width;
    ctx.fillText(TEXT, canvas.width / 2 - textSize / 2, 100);
    if (gameOverTick > 6) {
      state = STATES.GAME_START;
      gameOverTick = 0;
    }
    gameOverTick++;
  } else if (state === STATES.HIDDING) {
    if (!friends.length) {
      state = STATES.YOU_WIN;
      return;
    }
    move();

    if (tick <= TICK_START - 1) {
      moveFriends();
    }

    tick--;
    if (tick === 10) {
      generateEnemy();
      enemyTick = 5;
    }
    if (tick === 0) {
      tick = TICK_START;
      zzfx(
        ...[, , 432, 0.01, , 0.42, , 4, , , , , , , 80, 0.1, , 0.65, 0.01, 0.32]
      ); // Random 33
      sequence1.stop();
      sequence2.stop();
      state = STATES.ATTACK;
    }
    redraw();
  } else if (state === STATES.ATTACK) {
    playerHiddenLocation = isHidden();
    if (playerHiddenLocation === -1) {
      if (pathStart[1] < 15)
        enemy.currentPath = [
          enemy.currentPath[0],
          [pathStart[0], pathStart[1] + 1],
        ];
      else
        enemy.currentPath = [
          enemy.currentPath[0],
          [pathStart[0], pathStart[1] - 1],
        ];
      enemyTick--;
      if (enemyTick == 3) {
        handleAttack();
      }
    }
    if (!enemy.isMoving) {
      enemyTick--;
      if (enemyTick == 3) {
        handleAttack();
      }
      if (enemyTick == 1) {
        cleanHiddingSpots();
        generateFriends();
        console.log(friends);
      }
      if (enemyTick == 0) {
        generateEnemy(false);

        enemyTick = 5;
      }
    }
    moveEnemy();
    redraw();
  }
}

// TODO: GET MICROFONE

onload();

function handleAttack() {
  zzfx(
    ...[
      1.3,
      ,
      129,
      0.02,
      0.03,
      0.04,
      4,
      2.6,
      4,
      ,
      ,
      ,
      ,
      0.5,
      ,
      0.5,
      ,
      0.51,
      0.01,
    ]
  ); // Hit 22
  playerHiddenLocation = isHidden();
  if (playerHiddenLocation === -1) {
    state = STATES.GAME_OVER;
    return;
  }
  if (hiddingSpots[enemy.spot].hidden == -1) {
    zzfx(
      ...[
        1.1,
        ,
        403,
        ,
        0.35,
        0.18,
        4,
        3.8,
        4,
        ,
        -40,
        0.01,
        ,
        ,
        20,
        0.7,
        ,
        0.78,
        ,
        0.1,
        185,
      ]
    );
    zzfx(
      ...[
        2,
        ,
        403,
        ,
        0.35,
        0.18,
        4,
        3.8,
        4,
        ,
        -40,
        0.01,
        ,
        ,
        20,
        0.7,
        ,
        0.78,
        ,
        0.1,
        185,
      ]
    );
    gameOverTick = 0;
    state = STATES.GAME_OVER;
  } else {
    friends.splice(hiddingSpots[enemy.spot].hidden, 1);
    const x = hiddingSpots[enemy.spot].pos[0];
    const y = hiddingSpots[enemy.spot].pos[1];
    world[x][y] = -10 - hiddingSpots[enemy.spot].image;
    hiddingSpots.splice(enemy.spot, 1);
    hiddingSpots.forEach((hs) => {
      hs.occupied = false;
      hs.taken = false;
    });
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawPlayer() {
  const x = pathStart[0] * tileWidth;
  const y = pathStart[1] * tileHeight;
  drawPerson(x, y, "black");
}

function drawPerson(x, y, color) {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.beginPath();
  //HEAD
  ctx.fillStyle = color;
  ctx.arc(x + tileWidth / 2 - 1, y, 3, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  //BODY
  ctx.moveTo(x + 12, y + 4);
  ctx.lineTo(x + 8, y + 6);
  ctx.lineTo(x + 4, y + 18);
  ctx.lineTo(x + 10, y + 10);
  ctx.lineTo(x + 10, y + 18);
  ctx.lineTo(x + 19, y + 18);
  ctx.lineTo(x + 19, y + 12);
  ctx.lineTo(x + 24, y + 18);
  ctx.lineTo(x + 20, y + 6);
  ctx.lineTo(x + 16, y + 4);

  //LEGS
  ctx.fillStyle = "black";
  ctx.moveTo(x + 10, y + 18);
  ctx.lineTo(x + 11, y + tileHeight);
  ctx.lineTo(x + 14, y + 18);
  ctx.moveTo(x + 15, y + 18);
  ctx.lineTo(x + 18, y + tileHeight);
  ctx.lineTo(x + 19, y + 18);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}
