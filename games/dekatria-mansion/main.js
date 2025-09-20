const TOOLTIP_DELAY = 300;
const DICE_ROLL_INTERVAL = 50;
const DICE_ROLL_DELAY = 500;
const MESSAGE_DURATION = 3000;
const roomCirclesRaw = [
  ...document.querySelectorAll(".R10_Center .circle"),
  ...document.querySelectorAll(".R11_Center .circle"),
  ...document.querySelectorAll(".R12_Center .circle"),
  ...document.querySelectorAll(".R14_Center .circle"),
  ...document.querySelectorAll(".R15_Center .circle"),
  ...document.querySelectorAll(".R16_Center .circle"),
];
const hallCirclesRaw = [
  ...document.querySelectorAll(".Hall1_Left .circle"),
  ...document.querySelectorAll(".Hall1_Right .circle"),
  ...document.querySelectorAll(".Hall2_Left .circle"),
  ...document.querySelectorAll(".Hall2_Right .circle"),
  ...document.querySelectorAll(".Hall3_Left .circle"),
  ...document.querySelectorAll(".Hall3_Right .circle"),
];

class ElementManager {
  constructor() {
    this.roomNumbers = [10, 11, 12, 14, 15, 16];
    this.hallNumbers = [1, 2, 3];

    this.roomSquares = this.roomNumbers.reduce((acc, num) => {
      acc[num] = this.getRoomSquares(num);
      return acc;
    }, {});

    this.roomCircles = this.roomNumbers.reduce((acc, num) => {
      acc[num] = this.getRoomCircles(num);
      return acc;
    }, {});

    this.hallCircles = this.hallNumbers.reduce((acc, num) => {
      acc[num] = this.getHallCircles(num);
      return acc;
    }, {});

    this.partyCircles = this.getElements(".circle-container .circle");
  }

  getElements(selector) {
    return document.querySelectorAll(selector);
  }

  getRoomSquares(roomNumber) {
    const sides = [10, 11, 12].includes(roomNumber) ? "Left" : "Right";
    return this.getElements(
      `.R${roomNumber}_Top .square, .R${roomNumber}_${sides} .square, .R${roomNumber}_Bot .square`
    );
  }

  getRoomCircles(roomNumber) {
    return this.getElements(`.R${roomNumber}_Center .circle`);
  }

  getHallCircles(hallNumber) {
    return this.getElements(
      `.Hall${hallNumber}_Left .circle, .Hall${hallNumber}_Right .circle`
    );
  }
}

class UIManager {
  constructor(game, elementManager) {
    this.game = game;
    this.elementManager = elementManager;

    this.startButton = document.getElementById("start-game-button");
    this.rollButton = document.querySelector(".roll-button");
    this.diceRes = document.querySelector(".dice-res");
    this.thirteenCounter = document.querySelector(".Room13R");

    this.characterSelectionArea = this.elementManager.getElements(
      ".CharSel_Char1 .circle, .CharSel_Char2 .circle"
    );

    this.messageElement = document.getElementById("selection-message");
    this.arrowElement = document.getElementById("arrow-char-sel");

    this.tooltipTimeout = null;

    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.setupAbilityClickListeners =
      this.setupAbilityClickListeners.bind(this);
    this.setupTooltipListeners = this.setupTooltipListeners.bind(this);
    this.handleTooltipEvent = this.handleTooltipEvent.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.moveTooltip = this.moveTooltip.bind(this);
    this.activateAbility = this.activateAbility.bind(this);
    this.handleMuscleJoeAbility = this.handleMuscleJoeAbility.bind(this);
    this.handleRollButtonClick = this.handleRollButtonClick.bind(this);
    this.updateTooltip = this.updateTooltip.bind(this);
    this.checkSelectedParty = this.checkSelectedParty.bind(this);
    this.toggleRollButton = this.toggleRollButton.bind(this);
    this.enableRollButton = this.enableRollButton.bind(this);
    this.disableCharacterSelection = this.disableCharacterSelection.bind(this);
    this.updateResult = this.updateResult.bind(this);
    this.updateThirteenCount = this.updateThirteenCount.bind(this);
    this.setupCharacterSelection = this.setupCharacterSelection.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.moveArrow = this.moveArrow.bind(this);
    this.breakThroughWalls = this.breakThroughWalls.bind(this);
    this.removeWallStroke = this.removeWallStroke.bind(this);
    this.updateWallDisplay = this.updateWallDisplay.bind(this);
    this.updateScoreDisplay = this.updateScoreDisplay.bind(this);
  }

  hideMessage() {
    if (this.messageElement) {
      this.messageElement.classList.remove("visible");
    }
  }

  hideArrow() {
    if (this.arrowElement) {
      this.arrowElement.style.display = "none";
    }
  }

  setupEventListeners() {
    if (this.rollButton) {
      this.rollButton.addEventListener("click", this.handleRollButtonClick);
    }
    this.setupAbilityClickListeners();
    this.setupTooltipListeners();
  }

  setupAbilityClickListeners() {
    const abilitiesCooldown = document.querySelector(".abilities-cooldown");
    if (abilitiesCooldown) {
      abilitiesCooldown.addEventListener("click", (event) => {
        if (event.target.classList.contains("ability")) {
          const ability = event.target;
          const cooldown = parseInt(ability.getAttribute("data-cooldown"), 10);
          if (cooldown === 0) {
            this.activateAbility(ability);
          } else {
            this.showMessage(`Ability on cooldown for ${cooldown} more rolls.`);
          }
        }
      });
    }
  }

  setupTooltipListeners() {
    const circleContainer = document.querySelector(".circle-container");
    if (circleContainer) {
      circleContainer.addEventListener("mouseover", this.handleTooltipEvent);
      circleContainer.addEventListener("mouseout", this.handleTooltipEvent);
      circleContainer.addEventListener("mousemove", this.handleTooltipEvent);
    }
  }

  handleTooltipEvent = (event) => {
    if (event.target.classList.contains("circle")) {
      switch (event.type) {
        case "mouseover":
          this.tooltipTimeout = setTimeout(() => {
            this.showTooltip(event);
          }, TOOLTIP_DELAY);
          break;
        case "mouseout":
          clearTimeout(this.tooltipTimeout);
          this.hideTooltip();
          break;
        case "mousemove":
          this.moveTooltip(event);
          break;
      }
    }
  };

  showTooltip = (event) => {
    const tooltip = document.getElementById("tooltip");
    const characterEmoji = event.target.textContent.trim();
    const character = this.game.characters.find(
      (char) => char.emoji === characterEmoji
    );

    tooltip.textContent = character
      ? character.description
      : "No description available";
    tooltip.style.display = "block";
    this.moveTooltip(event);
  };

  hideTooltip = () => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  };

  moveTooltip = (event) => {
    const tooltip = document.getElementById("tooltip");
    const offsetX = 10;
    const offsetY = 10;
    tooltip.style.left = `${event.pageX + offsetX}px`;
    tooltip.style.top = `${event.pageY + offsetY}px`;
  };

  activateAbility = (ability) => {
    const emoji = ability.textContent.trim();
    switch (emoji) {
      case "💪":
        this.handleMuscleJoeAbility();
        break;
      case "🔍":
        break;
      default:
        this.showMessage("Unknown ability.");
    }
  };

  hideMessage() {
    if (this.messageElement) {
      this.messageElement.classList.remove("visible");
    }
  }

  handleMuscleJoeAbility = () => {
    const rolledNumber = this.game.dice.total;
    const character = this.game.characters.find((char) => char.emoji === "💪");

    if (character && character.remainingCooldown === 0) {
      this.breakThroughWalls();
    } else if (character.remainingCooldown > 0) {
      this.showMessage(
        `Ability on cooldown for ${character.remainingCooldown} more rolls.`
      );
    }
  };

  breakThroughWalls() {
    const roomNumber = this.game.dice.total;
    console.log(`UIManager breaking walls for room ${roomNumber}`);
    const updatedWallState = this.game.breakThroughWalls(roomNumber);
    this.updateWallDisplay(updatedWallState, roomNumber);
  }

  removeWallStroke = (room, position) => {
    console.log("Removing wall stroke", room, position);
    const roomElement = document.querySelector(`.${room}`);
    if (roomElement) {
      roomElement.style[`border-${position}`] = "0";
    }
  };

  handleRollButtonClick = () => {
    const action = this.rollButton.textContent;
    if (action === "Start Game" && this.checkSelectedParty()) {
      this.game.startGame();
    } else if (action === "Roll Dice") {
      this.game.rollDice();
    }
  };

  updateTooltip = (e, visible) => {
    const tooltip = document.getElementById("tooltip");
    if (visible) {
      tooltip.textContent =
        e.target.dataset.description || "No description available";
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
      tooltip.classList.add("visible");
    } else {
      tooltip.classList.remove("visible");
    }
  };

  checkSelectedParty = () => {
    const filledSlots = Array.from(this.elementManager.partyCircles).filter(
      (circle) => circle.textContent !== ""
    );
    if (filledSlots.length === 5) {
      this.toggleRollButton("Start Game");
      return true;
    } else {
      this.toggleRollButton("Select Party First");
      return false;
    }
  };

  toggleRollButton = (label) => {
    if (this.rollButton) {
      this.rollButton.textContent = label;
    }
  };

  enableRollButton = () => {
    this.rollButton.disabled = false;
  };

  disableCharacterSelection = () => {
    this.characterSelectionArea.forEach((circle) => {
      circle.style.pointerEvents = "none";
    });
  };

  updateResult = (total) => {
    this.diceRes.textContent = total;
  };

  updateThirteenCount(count) {
    const thirteenCountElement = document.getElementById("thirteen-count");
    if (thirteenCountElement) {
      thirteenCountElement.textContent = `Thirteens: ${count} / 13`;
    }
  }

  setupCharacterSelection() {
    this.characterSelectionArea.forEach((circle, index) => {
      const character = this.game.characters[index];
      circle.textContent = character.emoji;
      circle.dataset.description = character.description;
      circle.setAttribute("draggable", true);

      circle.addEventListener("click", () => {
        if (!this.game.gameStarted && circle.textContent !== "") {
          this.game.moveToPartySelection(circle, index);
        }
      });

      circle.addEventListener("mouseover", this.handleTooltipEvent);
      circle.addEventListener("mouseout", this.handleTooltipEvent);
      circle.addEventListener("mousemove", this.handleTooltipEvent);
    });
  }

  showMessage = (message, duration = MESSAGE_DURATION) => {
    if (this.messageElement) {
      this.messageElement.textContent = message;
      this.messageElement.classList.add("visible");

      if (duration > 0) {
        setTimeout(() => {
          this.messageElement.classList.remove("visible");
        }, duration);
      }
    }
  };

  moveArrow = (targetId, message = "") => {
    const targetElement = document.getElementById(targetId);
    const arrowElement = document.getElementById("arrow-sel-party");
    if (targetElement && !targetElement.contains(this.arrowElement)) {
      targetElement.appendChild(this.arrowElement);
      if (message) {
        this.arrowElement.textContent = message;
      }
    }
  };

  updateWallDisplay(wallState, roomNumber) {
    console.log("Updating wall display:", wallState, "for room", roomNumber);
    if (wallState.r10wall) {
      this.removeWallStroke("R10_Bot", "bottom");
      this.removeWallStroke("R11_Top", "top");
    }
    if (wallState.r12wall) {
      this.removeWallStroke("R11_Bot", "bottom");
      this.removeWallStroke("R12_Top", "top");
    }
    if (wallState.r14wall) {
      this.removeWallStroke("R14_Bot", "bottom");
      this.removeWallStroke("R15_Top", "top");
    }
    if (wallState.r16wall) {
      this.removeWallStroke("R15_Bot", "bottom");
      this.removeWallStroke("R16_Top", "top");
    }
  }

  updateScoreDisplay(score) {
    const scoreElement = document.querySelector(".score");
    if (scoreElement) {
      scoreElement.textContent = `Score: ${score}`;
    }
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.maxScore = 18;
    this.dice = new Dice();
    this.elementManager = new ElementManager();
    this.uiManager = new UIManager(this, this.elementManager);
    this.board = new Board(this, this.elementManager, this.uiManager);
    this.thirteenCount = 0;
    this.isMasked = true;
    this.gameStarted = false;
    this.wallState = {
      r10wall: false,
      r12wall: false,
      r14wall: false,
      r16wall: false,
    };

    this.characters = this.initializeCharacters();
    this.rolledRoom = null;

    this.init();
  }

  initializeCharacters() {
    return [
      new Character(
        "Magnify Mark",
        "🔍",
        { type: "reveal", cooldown: 0 },
        "Magnify Mark - Can reveal all emojis in a room."
      ),
      new Character(
        "Muscle Joe",
        "💪",
        { type: "breakWall", cooldown: 3 },
        "Muscle Joe - Can break through walls. Only when rolled into the room."
      ),
      new Character(
        "Brain Brian",
        "🧠",
        { type: "completeTasks", cooldown: 5 },
        "Brain Brian - Increase the roll chance of the room by 10%"
      ),
      new Character(
        "Jester Chester",
        "🃏",
        { type: "completeEmoji", cooldown: 5 },
        "Jester Chester - Can complete a random emoji in a room."
      ),
      new Character(
        "Wrench Steve",
        "🔧",
        { type: "adjustDice", cooldown: 5 },
        "Wrench Steve - Can make the next roll a 16."
      ),
      new Character(
        "Magic Mike",
        "🪄",
        { type: "teleport", cooldown: 5, destination: ".R13_Center" },
        "Magic Mike - Can teleport to the opposite side room."
      ),
      new Character(
        "Ghost Casper",
        "👻",
        { type: "swap", cooldown: 5 },
        "Ghost Casper - Drag him over someone else to swap places."
      ),
      new Character(
        "Candle Cindy",
        "🕯️",
        { type: "protect", cooldown: 5, preventBasement: true },
        "Candle Cindy - Block the next 13 from rolling."
      ),
      new Character(
        "Bat Man",
        "🦇",
        { type: "escapeBasement", cooldown: 5 },
        "Bat Man - Can escape the basement to any room."
      ),
      new Character(
        "Pumpkin Cinderella",
        "🎃",
        { type: "freeAll", cooldown: 5 },
        "Pumpkin Cinderella - Can get everyone out of the basement."
      ),
    ];
  }

  init() {
    this.uiManager.setupEventListeners();
    this.uiManager.updateResult(this.dice.total);
    this.setupCharacterSelection();
  }

  updateScore() {
    this.score += 1;
    this.uiManager.updateScoreDisplay(this.score);
  }

  allowRoom13Entry = () => {
    const hallTopCircle = document.querySelector(".Hall1_Top .circle");
    hallTopCircle.classList.add("unlocked");
    hallTopCircle.addEventListener("drop", this.handleRoom13Drop);
  };

  setupCharacterSelection() {
    this.uiManager.setupCharacterSelection();
  }

  moveToPartySelection(circle, index) {
    const selectedPartySlot = Array.from(this.board.selectedParty).find(
      (slot) => slot.textContent === ""
    );

    if (circle.classList.contains("selected")) {
      circle.classList.remove("selected");
      const slotToRemove = Array.from(this.board.selectedParty).find(
        (slot) => slot.textContent === circle.textContent
      );
      if (slotToRemove) {
        slotToRemove.textContent = "";
      }
    } else if (selectedPartySlot) {
      selectedPartySlot.textContent = circle.textContent;
      selectedPartySlot.dataset.description = circle.dataset.description;
      circle.classList.add("selected");
    }

    this.uiManager.checkSelectedParty();
    this.board.updateGameMessage();
  }

  startGame() {
    this.gameStarted = true;
    this.uiManager.hideMessage();
    this.uiManager.hideArrow();
    this.uiManager.toggleRollButton("Roll Dice");
    this.uiManager.enableRollButton();
    this.board.populateRoomSquares(this.isMasked);
    this.uiManager.disableCharacterSelection();
    this.board.startGame();
    this.board.dragAndDropManager.setupDragAndDrop();
  }

  clearHistory() {
    document.querySelectorAll(".history .circle").forEach((circle) => {
      circle.textContent = "";
    });
  }

  clearCharacterSelectors() {
    document
      .querySelectorAll(".CharSel_Char1 .circle, .CharSel_Char2 .circle")
      .forEach((circle) => {
        circle.textContent = "";
        circle.classList.remove("selected");
      });
  }

  rollDice() {
    if (this.board.isHallwayEmpty() && this.hasCharactersInBasement()) {
      this.dice.total = 13;
      this.handleThirteenRoll();
      return;
    }

    let validRoll = false;
    let diceResults;

    while (!validRoll) {
      diceResults = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];

      const total = diceResults.reduce((sum, num) => sum + num, 0);

      if (total >= 10 && total <= 16) {
        validRoll = true;
        this.dice.total = total;
      }
    }

    this.uiManager.updateResult(0);

    const diceElements = [
      document.querySelector(".dice1"),
      document.querySelector(".dice2"),
      document.querySelector(".dice3"),
    ];

    diceElements.forEach((dice, index) => {
      setTimeout(() => {
        let rolling = setInterval(() => {
          dice.textContent = Math.floor(Math.random() * 6) + 1;
        }, DICE_ROLL_INTERVAL);

        setTimeout(() => {
          clearInterval(rolling);
          dice.textContent = diceResults[index];

          const currentTotal = diceResults
            .slice(0, index + 1)
            .reduce((sum, num) => sum + num, 0);
          this.uiManager.updateResult(currentTotal);

          if (index === diceElements.length - 1) {
            document.querySelectorAll(".action-taken").forEach((element) => {
              element.classList.remove("action-taken");
              element.style.backgroundColor = "";
              element.setAttribute("draggable", true);
            });

            if (this.dice.total === 13) {
              this.handleThirteenRoll();
            } else {
              this.board.moveToRoom(this.dice.total);
            }
          }
        }, DICE_ROLL_DELAY);
      }, index * DICE_ROLL_DELAY);
    });

    this.characters.forEach((character) => {
      if (character.remainingCooldown > 0) {
        character.remainingCooldown -= 1;
      }
    });

    this.rolledRoom = this.getRolledRoom();
  }

  hasCharactersInBasement() {
    const basementSlots = document.querySelectorAll(".Base_Char .circle");
    return Array.from(basementSlots).some((slot) => slot.textContent !== "");
  }

  handleThirteenRoll() {
    this.thirteenCount += 1;
    this.uiManager.updateThirteenCount(this.thirteenCount);

    if (this.board.isHallwayEmpty()) {
      this.board.moveBasementToParty();
    } else {
      this.board.moveHallwayToBasement();
    }
    this.checkWinCondition();
  }

  checkWinCondition() {
    if (this.thirteenCount >= 13) {
      alert("Count Dekatria has expelled you from the mansion!");
      location.reload();
    }
  }

  addHistory(emoji) {
    const historyCircles = document.querySelectorAll(".history .circle");
    const existingEmojis = Array.from(historyCircles).map(
      (circle) => circle.textContent
    );

    if (!existingEmojis.includes(emoji)) {
      const emptyCircle = Array.from(historyCircles).find(
        (circle) => circle.textContent === ""
      );
      if (emptyCircle) {
        emptyCircle.textContent = emoji;
      }
    }
  }

  getCurrentRoom(character) {
    return "Room11";
  }

  getRolledRoom() {
    return "Room11";
  }

  getAdjacentRoom(currentRoom, position) {
    const roomNumber = parseInt(currentRoom.match(/\d+/)[0], 10);
    let adjacentRoomNumber;

    switch (position) {
      case "top":
        adjacentRoomNumber = roomNumber - 1;
        break;
      case "bottom":
        adjacentRoomNumber = roomNumber + 1;
        break;
      default:
        return null;
    }

    return `Room${adjacentRoomNumber}`;
  }

  breakThroughWalls(roomNumber) {
    console.log(`Breaking walls for room ${roomNumber}`);
    let wallsBroken = false;
    if ((roomNumber === 10 || roomNumber === 11) && !this.wallState.r10wall) {
      this.wallState.r10wall = true;
      wallsBroken = true;
    }
    if ((roomNumber === 11 || roomNumber === 12) && !this.wallState.r12wall) {
      this.wallState.r12wall = true;
      wallsBroken = true;
    }
    if ((roomNumber === 14 || roomNumber === 15) && !this.wallState.r14wall) {
      this.wallState.r14wall = true;
      wallsBroken = true;
    }
    if ((roomNumber === 15 || roomNumber === 16) && !this.wallState.r16wall) {
      this.wallState.r16wall = true;
      wallsBroken = true;
    }
    console.log("Updated wall state:", this.wallState);
    this.uiManager.updateWallDisplay(this.wallState, roomNumber);
    return wallsBroken;
  }

  handleRoom13Drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);

    if (this.score < 13) {
      this.uiManager.showMessage(
        "Room 13 is locked! You need 13 points to access it."
      );
      return;
    }

    if (
      event.target.classList.contains("circle") &&
      event.target.closest(".Hall1_Top")
    ) {
      alert("Congratulations! You've slain Count Dekatria!");
      location.reload();
    } else if (event.target.closest(".Room13")) {
      if (
        event.target.classList.contains("circle") &&
        !event.target.textContent
      ) {
        event.target.textContent = draggedElement.textContent;
        draggedElement.textContent = "";
        this.uiManager.showMessage("Character placed in Room 13!");
      } else {
        this.uiManager.showMessage("Invalid drop location in Room 13.");
      }
    }
  }

  setupDragAndDrop() {
    const characters = document.querySelectorAll(".character");
    const dropTargets = document.querySelectorAll(".square, .circle");

    characters.forEach((character) => {
      character.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text", event.target.id);
      });
    });

    dropTargets.forEach((target) => {
      target.addEventListener("dragover", this.handleDragOver);
      target.addEventListener("drop", (event) => {
        if (
          event.target.closest(".Room13") ||
          event.target.closest(".Hall1_Top")
        ) {
          this.handleRoom13Drop(event);
        } else {
          this.handleDrop(event);
        }
      });
    });
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);

    if (event.target === draggedElement) {
      return;
    }

    if (
      event.target.classList.contains("circle") &&
      !event.target.textContent
    ) {
      event.target.textContent = draggedElement.textContent;
      draggedElement.textContent = "";
    } else {
      this.uiManager.showMessage("Invalid drop location.");
    }
  }
}

class Dice {
  constructor() {
    this.roll1 = 0;
    this.roll2 = 0;
    this.roll3 = 0;
    this.total = 0;
  }

  roll() {
    this.roll1 = Math.floor(Math.random() * 6) + 1;
    this.roll2 = Math.floor(Math.random() * 6) + 1;
    this.roll3 = Math.floor(Math.random() * 6) + 1;
    this.total = this.roll1 + this.roll2 + this.roll3;
  }

  rollDiceInRange(min, max) {
    do {
      this.roll();
    } while (this.total < min || this.total > max);
  }

  reset() {
    this.roll1 = 0;
    this.roll2 = 0;
    this.roll3 = 0;
    this.total = 0;
  }
}

class Ability {
  constructor(type, description, cooldown) {
    this.type = type;
    this.description = description;
    this.cooldown = cooldown;
    this.remainingCooldown = 0;
  }

  use(board, character, currentLocation) {
    if (this.remainingCooldown > 0) {
      board.game.uiManager.showMessage(
        `${character.name}'s ability is on cooldown.`
      );
      return;
    }

    switch (this.type) {
      case "reveal":
        this.revealAbility(board, currentLocation);
        break;
      case "move":
        this.moveAbility(board, currentLocation, character);
        break;
      default:
        console.log(`${character.name} has no defined ability.`);
    }
  }

  revealAbility(board, roomSquares) {
    roomSquares.forEach((square) => {
      if (square.textContent === "❓") {
        square.textContent = square.dataset.emoji;
        square.classList.add("revealed");
      }
    });
    board.game.uiManager.showMessage(
      `${this.name} revealed all emojis in the room!`
    );
  }
}

class ActivateAbilities {
  constructor() {
    this.cooldowns = {};
    this.init();
  }

  init() {
    document.querySelectorAll(".ability").forEach((ability) => {
      const cooldown = parseInt(ability.dataset.cooldown, 10);
      this.cooldowns[ability.id] = { cooldown, remaining: 0 };
      ability.addEventListener("click", () => this.activateAbility(ability.id));
    });
  }

  activateAbility(abilityId) {
    const ability = this.cooldowns[abilityId];
    if (ability.remaining === 0) {
      console.log(`Activating ability: ${abilityId}`);
      this.useAbility(abilityId);
      ability.remaining = ability.cooldown;
    } else {
      console.log(
        `Ability ${abilityId} is on cooldown. Remaining: ${ability.remaining}`
      );
    }
  }
}

class Board {
  constructor(game, elementManager, uiManager) {
    this.game = game;
    this.elementManager = elementManager;
    this.uiManager = uiManager;
    this.roomCircles = elementManager.roomCircles;
    this.roomSquares = elementManager.roomSquares;
    this.hallCircles = elementManager.hallCircles;
    this.selectedParty = elementManager.partyCircles;
    this.gameStarted = false;
    this.currentStep = 0;
    this.score = 0;
    this.dragAndDropManager = new DragAndDropManager(this, this.uiManager);
    this.finishSetup();
  }

  finishSetup() {
    this.dragAndDropManager.setupDragAndDrop();
  }

  areBasementSlotsFilled = () => {
    const basementSlots = document.querySelectorAll(".Base_Char .circle");
    return Array.from(basementSlots).every((slot) => slot.textContent !== "");
  };

  checkAllChecked = () => {
    const checkedCount = document.querySelectorAll(".checked").length;
    if (checkedCount === 18) {
      alert("All emojis checked! You can now enter Room 13.");
      this.game.allowRoom13Entry();
    }
  };

  moveHallwayToBasement = () => {
    const basementSlots = document.querySelectorAll(".Base_Char .circle");
    const movedCharacters = [];

    Object.values(this.hallCircles).forEach((hall) => {
      hall.forEach((hallCircle) => {
        if (hallCircle.textContent !== "") {
          const emptyBasementSlot = Array.from(basementSlots).find(
            (slot) => slot.textContent === ""
          );
          if (emptyBasementSlot) {
            emptyBasementSlot.textContent = hallCircle.textContent;
            movedCharacters.push(hallCircle.textContent);
            hallCircle.textContent = "";
          }
        }
      });
    });

    if (movedCharacters.length > 0) {
      this.game.uiManager.showMessage(
        `Characters moved to the basement: ${movedCharacters.join(", ")}`
      );
    }
  };

  populateRoomSquares(isMasked) {
    const selectedEmojis = Array.from(this.selectedParty)
      .map((squares) => squares.textContent)
      .filter(Boolean);
    if (selectedEmojis.length !== 5) return;
    this.game.uiManager.hideMessage();
    this.game.uiManager.hideArrow();
    Object.entries(this.roomSquares).forEach(([roomNumber, squares]) => {
      const shuffledEmojis = this.shuffleArray([...selectedEmojis]);
      squares.forEach((square, index) => {
        const emoji = shuffledEmojis[index % shuffledEmojis.length];
        square.dataset.emoji = emoji;
        square.textContent = isMasked ? "❓" : emoji;
      });
    });
  }

  moveToRoom = (diceResult) => {
    const { hallCircle, roomSlots, roomSquares, roomNumber } =
      this.getRoomElements(diceResult);
    if (!hallCircle || hallCircle.textContent === "") {
      this.game.uiManager.showMessage(
        `Room ${roomNumber} was opened but no one entered.`
      );
      return;
    }

    const moved = this.moveCharacterToRoom(
      hallCircle,
      roomSlots,
      roomSquares,
      roomNumber
    );
    if (!moved) {
      this.moveCharacterBackToParty(hallCircle);
    }

    this.checkAllChecked();
  };

  getRoomElements = (diceResult) => {
    let hallCircle, roomSlots, roomSquares, roomNumber;

    switch (diceResult) {
      case 10:
        hallCircle = document.querySelector(".Hall1_Left .circle");
        roomSlots = document.querySelectorAll(".R10_Center .circle");
        roomSquares = this.roomSquares[10];
        roomNumber = 10;
        break;
      case 11:
        hallCircle = document.querySelector(".Hall2_Left .circle");
        roomSlots = document.querySelectorAll(".R11_Center .circle");
        roomSquares = this.roomSquares[11];
        roomNumber = 11;
        break;
      case 12:
        hallCircle = document.querySelector(".Hall3_Left .circle");
        roomSlots = document.querySelectorAll(".R12_Center .circle");
        roomSquares = this.roomSquares[12];
        roomNumber = 12;
        break;
      case 14:
        hallCircle = document.querySelector(".Hall1_Right .circle");
        roomSlots = document.querySelectorAll(".R14_Center .circle");
        roomSquares = this.roomSquares[14];
        roomNumber = 14;
        break;
      case 15:
        hallCircle = document.querySelector(".Hall2_Right .circle");
        roomSlots = document.querySelectorAll(".R15_Center .circle");
        roomSquares = this.roomSquares[15];
        roomNumber = 15;
        break;
      case 16:
        hallCircle = document.querySelector(".Hall3_Right .circle");
        roomSlots = document.querySelectorAll(".R16_Center .circle");
        roomSquares = this.roomSquares[16];
        roomNumber = 16;
        break;
      default:
        return {};
    }

    return { hallCircle, roomSlots, roomSquares, roomNumber };
  };

  moveCharacterToRoom = (hallCircle, roomSlots, roomSquares, roomNumber) => {
    for (let i = 0; i < roomSlots.length; i++) {
      if (roomSlots[i].textContent === "") {
        roomSlots[i].textContent = hallCircle.textContent;
        hallCircle.textContent = "";

        const matched = this.checkForMatch(
          roomSlots[i],
          roomSquares,
          roomNumber
        );

        const characterEmoji = roomSlots[i].textContent.trim();
        const character = this.game.characters.find(
          (char) => char.emoji === characterEmoji
        );

        if (character) {
          character.useAbility(this, roomNumber);
        }

        if (!matched) {
          this.updateHistory(roomNumber, roomSlots[i].textContent);
          this.game.uiManager.showMessage(
            `${roomSlots[i].textContent} moved to room ${roomNumber} but did not score a point.`
          );
        }

        if (this.dragAndDropManager) {
          this.dragAndDropManager.setupDragEventListeners(
            roomSlots[i],
            `party-char-${characterEmoji}`
          );
        } else {
          console.error("dragAndDropManager is not initialized");
        }

        return true;
      }
    }
    return false;
  };

  moveCharacterFromRoom = (currentRoom, targetRoom, characterEmoji) => {
    const currentRoomNumber = parseInt(currentRoom.className.match(/\d+/)[0]);
    const targetRoomNumber = parseInt(targetRoom.className.match(/\d+/)[0]);
    const targetRoomSlots = targetRoom.querySelectorAll(".circle");
    const targetRoomSquares = this.roomSquares[targetRoomNumber];

    let moved = false;
    for (let i = 0; i < targetRoomSlots.length; i++) {
      if (targetRoomSlots[i].textContent === "") {
        targetRoomSlots[i].textContent = characterEmoji;

        const currentRoomSlot = Array.from(
          currentRoom.querySelectorAll(".circle")
        ).find((slot) => slot.textContent === characterEmoji);
        if (currentRoomSlot) {
          currentRoomSlot.textContent = "";
        }

        const matched = this.checkForMatch(
          targetRoomSlots[i],
          targetRoomSquares,
          targetRoomNumber
        );

        const character = this.game.characters.find(
          (char) => char.emoji === characterEmoji
        );
        if (character) {
          character.useAbility(this, targetRoomNumber);
        }

        if (!matched) {
          this.updateHistory(targetRoomNumber, characterEmoji);
          this.game.uiManager.showMessage(
            `${characterEmoji} moved to room ${targetRoomNumber} but did not score a point.`
          );
        }

        moved = true;
        break;
      }
    }

    if (!moved) {
      this.game.uiManager.showMessage("No empty slots in the target room.");
    }

    return moved;
  };

  checkForMatch = (roomSlot, roomSquares, roomNumber) => {
    for (let j = 0; j < roomSquares.length; j++) {
      if (
        roomSquares[j].dataset.emoji === roomSlot.textContent &&
        !roomSquares[j].classList.contains("checked")
      ) {
        roomSquares[j].textContent = roomSlot.textContent;
        roomSquares[j].classList.add("checked");
        this.updateScore(this.score + 1);
        this.game.uiManager.showMessage(
          `${roomSlot.textContent} matched in room ${roomNumber} and scored a point!`
        );
        return true;
      }
    }
    return false;
  };

  moveCharacterBackToParty = (hallCircle) => {
    const emptyPartySlot = Array.from(this.selectedParty).find(
      (slot) => slot.textContent === ""
    );
    if (emptyPartySlot) {
      emptyPartySlot.textContent = hallCircle.textContent;
      hallCircle.textContent = "";
    }
  };

  moveBasementToParty = () => {
    const basementChars = document.querySelectorAll(".Base_Char .circle");
    const movedCharacters = [];

    basementChars.forEach((char) => {
      if (char.textContent !== "") {
        const emptyPartySlot = Array.from(this.selectedParty).find(
          (slot) => slot.textContent === ""
        );
        if (emptyPartySlot) {
          const emoji = char.textContent.trim();
          emptyPartySlot.textContent = emoji;
          movedCharacters.push(emoji);
          char.textContent = "";

          const newId = `party-char-${emoji}`;
          this.dragAndDropManager.setupDragEventListeners(
            emptyPartySlot,
            newId
          );
        }
      }
    });

    if (movedCharacters.length > 0) {
      this.game.uiManager.showMessage(
        `All characters escaped from the basement: ${movedCharacters.join(
          ", "
        )}`
      );
    }
  };

  isHallwayEmpty = () => {
    return Object.values(this.hallCircles).every((hall) =>
      Array.from(hall).every((hallCircle) => hallCircle.textContent === "")
    );
  };

  isRoom13Occupied = () => {
    const room13Circle = document.querySelector(
      ".R13_Top .circle, .R13_Left .circle, .R13_Right .circle"
    );
    return room13Circle && room13Circle.textContent !== "";
  };

  clearBoard = () => {
    Object.values(this.roomSquares).forEach((squares) => {
      squares.forEach((square) => {
        square.textContent = "";
        square.classList.remove("checked");
      });
    });
    Object.values(this.hallCircles).forEach((hall) => {
      hall.forEach((circle) => (circle.textContent = ""));
    });
    this.selectedParty.forEach((circle) => (circle.textContent = ""));
  };

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  toggleMask = () => {
    Object.values(this.roomSquares).forEach((squares) => {
      squares.forEach((square) => {
        if (square.textContent === "❓") {
          square.textContent = square.dataset.emoji;
        } else {
          square.textContent = "❓";
        }
      });
    });
  };

  updateHistory = (roomNumber, emoji) => {
    let historyElement;

    switch (roomNumber) {
      case 10:
        historyElement = document.querySelector(".R10_BotRight .history");
        break;
      case 11:
        historyElement = document.querySelector(".R11_BotRight .history");
        break;
      case 12:
        historyElement = document.querySelector(".R12_BotRight .history");
        break;
      case 14:
        historyElement = document.querySelector(".R14_BotLeft .history");
        break;
      case 15:
        historyElement = document.querySelector(".R15_BotLeft .history");
        break;
      case 16:
        historyElement = document.querySelector(".R16_BotLeft .history");
        break;
      default:
        console.error("Unknown room number:", roomNumber);
        return;
    }

    if (!historyElement) {
      console.error("No history element found for room:", roomNumber);
      return;
    }

    const historyCircles = historyElement.querySelectorAll(".circle");
    const existingEmojis = Array.from(historyCircles).map(
      (circle) => circle.textContent
    );
    if (existingEmojis.includes(emoji)) {
      console.log(
        `Emoji ${emoji} is already in history for room ${roomNumber}`
      );
      return;
    }
    const emptyHistorySlot = Array.from(historyCircles).find(
      (circle) => circle.textContent === ""
    );

    if (emptyHistorySlot) {
      emptyHistorySlot.textContent = emoji;
    } else {
      console.log("No empty slot found in history.");
    }
  };

  updateGameMessage = () => {
    const filledSlots = Array.from(this.selectedParty).filter(
      (circle) => circle.textContent !== ""
    ).length;
    if (filledSlots < 5 && !this.game.gameStarted) {
      this.currentStep = 0;
      this.game.uiManager.showMessage("⬅️ Select 5 characters carefully");
      this.game.uiManager.moveArrow(
        "arrow-char-sel",
        "Click to select and deselect"
      );
    } else if (filledSlots === 5 && !this.game.gameStarted) {
      this.currentStep = 1;
      this.game.uiManager.showMessage("Click Start Game ➡️");
      this.game.uiManager.moveArrow(
        "arrow-dice",
        "⬇️ Click Start to randomize the ❓'s⬇️"
      );
      this.game.uiManager.checkSelectedParty();
    } else if (this.game.gameStarted && this.currentStep === 1) {
      this.currentStep = 2;
      this.game.uiManager.showMessage(
        "Drag characters to the hallway circles. Then roll the room number to get Characters into the room."
      );

      const arrowDice = document.getElementById("arrow-dice");
      if (arrowDice) {
        arrowDice.style.display = "none";
      }

      const arrowSelParty = document.getElementById("arrow-sel-party");
      if (arrowSelParty) {
        arrowSelParty.textContent = "⬇️ Get 13 points to open Room 13 ⬇️";
        arrowSelParty.style.display = "block";
      }

      this.game.uiManager.moveArrow("arrow-sel-party", "Drag to hallway");
    } else if (this.currentStep === 2) {
      const hallCircles = [...Object.values(this.hallCircles).flat()];

      const anyCharacterInHall = hallCircles.some(
        (circle) => circle.textContent && circle.textContent.trim() !== ""
      );

      if (!anyCharacterInHall) {
        this.game.uiManager.showMessage(
          "Drag characters to the hallway circles. Then roll the room number to get Characters into the room."
        );
        this.game.uiManager.moveArrow(
          "arrow-sel-party",
          "⬇️ Characters that enter a room and match a ❓ score a point ⬇️"
        );
        return;
      }
      this.currentStep = 3;
      this.game.uiManager.showMessage(
        "Roll the room number to get Characters into the room."
      );
      this.game.uiManager.moveArrow("arrow-dice", "Roll Dice");
    } else if (this.currentStep === 3) {
      this.game.uiManager.showMessage(
        `↙️ Get 13 points to open Door 13 { ${this.score} / 13 } - Roll to move characters from hall to rooms.`
      );
      this.game.uiManager.moveArrow("arrow-guide", "Get 13 points");
    }
  };

  nextStep = () => {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.updateGameMessage();
    }
  };

  startGame = () => {
    this.gameStarted = true;
    this.nextStep();
  };

  onCharacterDragged = () => {
    if (this.currentStep === 2) {
      this.nextStep();
    }
  };

  onRollButtonClick = () => {
    if (this.currentStep === 2) {
      this.currentStep = 3;
      this.updateGameMessage();
    } else if (this.currentStep === 3) {
      this.updateGameMessage();
    }
  };

  updateScore(newScore) {
    this.score = newScore;
    const scoreElement = document.getElementById("score-count");
    if (scoreElement) {
      scoreElement.textContent = `Score: ${this.score} / 13`;
    }
    if (this.score >= 13) {
      this.allowRoom13Entry();
    }
  }

  allowRoom13Entry = () => {
    const hallTopCircle = document.querySelector(".Hall1_Top .circle");
    hallTopCircle.classList.add("unlocked");
    hallTopCircle.addEventListener("drop", this.handleRoom13Drop);
  };

  handleRoom13Drop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);

    if (this.score < 13) {
      this.uiManager.showMessage(
        "Room 13 is locked! You need 13 points to access it."
      );
      return;
    }

    if (
      event.target.classList.contains("circle") &&
      event.target.closest(".Hall1_Top")
    ) {
      alert("Congratulations! You've won the game!");
      location.reload();
    } else if (event.target.closest(".Room13")) {
      if (
        event.target.classList.contains("circle") &&
        !event.target.textContent
      ) {
        event.target.textContent = draggedElement.textContent;
        draggedElement.textContent = "";
        this.uiManager.showMessage("Character placed in Room 13!");
      } else {
        this.uiManager.showMessage("Invalid drop location in Room 13.");
      }
    }
  };

  handleCharacterMove(character, targetRoom) {
    console.log(`Attempting to move ${character} to ${targetRoom.className}`);
    const roomNumber = parseInt(targetRoom.className.match(/\d+/)[0]);
    const roomSlots = targetRoom.querySelectorAll(".circle");
    const roomSquares = this.roomSquares[roomNumber];

    let emptySlotFound = false;
    for (let i = 0; i < roomSlots.length; i++) {
      console.log(`Checking slot ${i}: "${roomSlots[i].textContent}"`);
      if (roomSlots[i].textContent === "") {
        emptySlotFound = true;
        console.log(`Found empty slot at index ${i}`);
        roomSlots[i].textContent = character;

        const matched = this.checkForMatch(character, roomSquares, roomNumber);
        console.log(`Match result: ${matched}`);

        if (matched) {
          this.game.updateScore();
          this.game.uiManager.showMessage(
            `${character} matched in room ${roomNumber} and scored a point!`
          );
        } else {
          this.updateHistory(roomNumber, character);
          this.game.uiManager.showMessage(
            `${character} moved to room ${roomNumber} but did not score a point.`
          );
        }

        const characterObj = this.game.characters.find(
          (char) => char.emoji === character
        );
        if (characterObj) {
          console.log(`Triggering ability for ${characterObj.name}`);
          characterObj.useAbility(this, roomNumber);
        }

        if (this.dragAndDropManager) {
          console.log(`Setting up drag event listeners for ${character}`);
          this.dragAndDropManager.setupDragEventListeners(
            roomSlots[i],
            `party-char-${character}`
          );
        }

        console.log(`Move completed successfully`);
        return true;
      }
    }

    if (!emptySlotFound) {
      console.log(`No empty slots found in room ${roomNumber}`);
      console.log(
        "Final room slots content:",
        Array.from(roomSlots).map((slot) => slot.textContent)
      );
    }
    return false;
  }

  checkForMatch(character, roomSquares, roomNumber) {
    for (let square of roomSquares) {
      if (
        square.dataset.emoji === character &&
        !square.classList.contains("checked")
      ) {
        square.textContent = character;
        square.classList.add("checked");
        return true;
      }
    }
    return false;
  }

  updateHistory(roomNumber, emoji) {
    const historyElement = document.querySelector(
      `.R${roomNumber}_BotRight .history, .R${roomNumber}_BotLeft .history`
    );
    if (historyElement) {
      const emptyCircle = Array.from(
        historyElement.querySelectorAll(".circle")
      ).find((circle) => circle.textContent === "");
      if (emptyCircle) {
        emptyCircle.textContent = emoji;
      }
    }
  }
}

class Character {
  constructor(name, emoji, ability, description) {
    this.name = name;
    this.emoji = emoji;
    this.ability = ability;
    this.description = description;
    this.remainingCooldown = 0;
  }

  useAbility(board, roomNumber) {
    if (this.remainingCooldown > 0) {
      board.game.uiManager.showMessage(
        `${this.name}'s ability is on cooldown.`
      );
      return;
    }

    switch (this.ability.type) {
      case "reveal":
        this.revealAbility(board, roomNumber);
        break;
      case "breakWall":
        this.breakWallAbility(board, roomNumber);
        break;
    }
  }

  revealAbility(board, roomNumber) {
    const roomSquares = board.roomSquares[roomNumber];
    roomSquares.forEach((square) => {
      if (square.textContent === "❓") {
        square.textContent = square.dataset.emoji;
        square.classList.add("revealed");
      }
    });
    board.game.uiManager.showMessage(
      `${this.name} revealed all emojis in the room!`
    );
  }

  breakWallAbility(board, roomNumber) {
    console.log(
      `${this.name} is attempting to break walls for room ${roomNumber}`
    );
    const wallsBroken = board.game.breakThroughWalls(roomNumber);
    if (wallsBroken) {
      board.game.uiManager.showMessage(`${this.name} broke through the wall!`);
    } else {
      board.game.uiManager.showMessage(
        `${this.name} tried to break the wall, but it was already broken.`
      );
    }
  }
}

class DragAndDropManager {
  constructor(board, uiManager) {
    this.board = board;
    this.uiManager = uiManager;
    console.log("UIManager in DragAndDropManager:", this.uiManager);
  }

  setupDragAndDrop = () => {
    const hallCircles = hallCirclesRaw;
    const roomCircles = roomCirclesRaw;
    const partyCircles = Array.from(this.board.selectedParty);
    const room13Circles = Array.from(
      document.querySelectorAll(".Hall1_Top .circle")
    );

    const circles = [
      ...hallCircles,
      ...roomCircles,
      ...partyCircles,
      ...room13Circles,
    ];

    circles.forEach((circle) => {
      if (circle) {
        this.setupDragEventListeners(circle);
        this.setupDropEventListeners(circle);
      } else {
        console.error("Invalid element found:", circle);
      }
    });
  };

  setupDragEventListeners = (element) => {
    if (!element.id) {
      element.id = `circle-${Math.random().toString(36).substr(2, 9)}`;
    }
    element.addEventListener("dragstart", (e) => {
      if (this.board.game.gameStarted) {
        e.dataTransfer.setData("text/plain", e.target.id);
        console.log(
          `Drag started: ${e.target.id}, Character: ${e.target.textContent}`
        );
      } else {
        console.log("Cannot drag before the game starts.");
        e.preventDefault();
      }
    });

    element.setAttribute("draggable", true);
  };

  setupDropEventListeners = (element) => {
    element.addEventListener("dragover", (e) => e.preventDefault());
    element.addEventListener("drop", this.onDrop);
  };

  onDragStart = (e) => {
    if (e.target && e.target.id) {
      e.dataTransfer.setData("text/plain", e.target.id);
      console.log(
        `Drag started: ${e.target.id}, Character: ${e.target.textContent}`
      );
    } else {
      console.error("Dragged element has no ID:", e.target);
    }
  };

  highlightValidDropTargets = (draggedElement) => {
    document.querySelectorAll(".circle").forEach((circle) => {
      circle.classList.remove("valid-drop");
    });

    document.querySelectorAll(".circle").forEach((circle) => {
      if (this.isDropAllowed(draggedElement, circle)) {
        circle.classList.add("valid-drop");
      }
    });
  };

  isDropAllowed = (draggedElement, targetElement) => {
    const wallState = this.board.game.wallState;
    console.log("Current wall state in isDropAllowed:", wallState);
    const { r10wall, r12wall, r14wall, r16wall } = wallState;

    if (!draggedElement || !targetElement) {
      console.error("Dragged or target element is null.");
      return false;
    }

    const draggedFromRoom = draggedElement.closest(
      "[class^='R'][class$='_Center']"
    );
    const targetRoom = targetElement.closest("[class^='R'][class$='_Center']");

    console.log(
      `Dragged from: ${
        draggedFromRoom ? draggedFromRoom.className : "Not a room"
      }`
    );
    console.log(
      `Target room: ${targetRoom ? targetRoom.className : "Not a room"}`
    );

    if (!draggedFromRoom && targetRoom) {
      console.log(
        "Drop not allowed: Cannot move a non-room character into a room."
      );
      return false;
    }

    if (!targetRoom) return true;

    const currentRoomNumber = draggedFromRoom
      ? parseInt(draggedFromRoom.className.match(/\d+/)[0])
      : null;
    const targetRoomNumber = parseInt(targetRoom.className.match(/\d+/)[0]);

    console.log(
      `Attempting to move from Room ${currentRoomNumber} to Room ${targetRoomNumber}`
    );

    if (currentRoomNumber === targetRoomNumber) return true;

    const isAllowed =
      (currentRoomNumber === 10 && targetRoomNumber === 11 && r10wall) ||
      (currentRoomNumber === 11 && targetRoomNumber === 10 && r10wall) ||
      (currentRoomNumber === 11 && targetRoomNumber === 12 && r12wall) ||
      (currentRoomNumber === 12 && targetRoomNumber === 11 && r12wall) ||
      (currentRoomNumber === 14 && targetRoomNumber === 15 && r14wall) ||
      (currentRoomNumber === 15 && targetRoomNumber === 14 && r14wall) ||
      (currentRoomNumber === 15 && targetRoomNumber === 16 && r16wall) ||
      (currentRoomNumber === 16 && targetRoomNumber === 15 && r16wall);

    console.log(`Move allowed based on wall state: ${isAllowed}`);
    return isAllowed;
  };

  onDrop = (e) => {
    e.preventDefault();
    const draggedElementId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedElementId);

    if (!draggedElement) {
      console.error("Dragged element not found in the DOM:", draggedElementId);
      return;
    }

    if (draggedElement === e.target) {
      console.log("Cannot drop character on itself.");
      return;
    }

    if (e.target.textContent.trim() !== "") {
      console.log("Swapping characters.");
      const tempCharacter = draggedElement.textContent.trim();
      draggedElement.textContent = e.target.textContent.trim();
      e.target.textContent = tempCharacter;
      return;
    }

    const isAllowed = this.isDropAllowed(draggedElement, e.target);
    console.log(`Drop allowed: ${isAllowed}`);

    if (isAllowed) {
      const character = draggedElement.textContent.trim();
      const targetRoom = e.target.closest("[class^='R'][class$='_Center']");
      const currentRoom = draggedElement.closest(
        "[class^='R'][class$='_Center']"
      );

      console.log(`Attempting to move ${character} to room:`, targetRoom);

      if (targetRoom && currentRoom && targetRoom !== currentRoom) {
        console.log(
          `Moving ${character} from room ${currentRoom.className} to room ${targetRoom.className}`
        );
        const moved = this.board.moveCharacterFromRoom(
          currentRoom,
          targetRoom,
          character
        );
        console.log(`Move result: ${moved ? "Successful" : "Failed"}`);
        if (!moved) {
          this.board.game.uiManager.showMessage(
            "No empty slots in the target room."
          );
        }
      } else if (targetRoom) {
        console.log(
          `Moving ${character} within the same room: ${targetRoom.className}`
        );
        const moved = this.board.moveCharacterToRoom(
          character,
          targetRoom,
          draggedElement
        );
        console.log(`Move result: ${moved ? "Successful" : "Failed"}`);
        if (!moved) {
          this.board.game.uiManager.showMessage(
            "No empty slots in the target room."
          );
        }
      } else {
        console.log(
          `Moving ${character} to non-room target: ${e.target.className}`
        );
        e.target.textContent = character;
        draggedElement.textContent = "";
      }
    } else {
      this.board.game.uiManager.showMessage("Invalid move. Try again.");
    }

    document.querySelectorAll(".valid-drop").forEach((circle) => {
      circle.classList.remove("valid-drop");
    });
  };
}

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
