// Uncomment the line below to create the main.bundle.css file
// import './main.css';

// Define the default game card data
const defaultGameCard = [
  {
    key: 'u1',
    type: 'uncommon',
    text: 'Adds an item with a large amount of time',
    rate: '★',
    price: 32,
  },
  {
    key: 'u2',
    type: 'uncommon',
    text: 'Adds an item with a large number of coins',
    rate: '★',
    price: 32,
  },
  {
    key: 'r1',
    type: 'rare',
    text: 'Increases maximum time over 60',
    rate: '★★',
    price: 64,
  },
  {
    key: 'r2',
    type: 'rare',
    text: 'Increases the probability of finding a coin',
    rate: '★★',
    price: 64,
  },
  {
    key: 'e1',
    type: 'epic',
    text: 'Adds an item with a random effect',
    rate: '★★★',
    price: 128,
  },
  {
    key: 'e2',
    type: 'epic',
    text: 'Gives a critical hit chance for each item',
    rate: '★★★',
    price: 128,
  },
  {
    key: 'l1',
    type: 'legendary',
    text: 'Increases maximum number of airdrops',
    rate: '★★★★',
    price: 256,
  },
];

// Define the default game items data
window.defaultGameItems = [
  {
    probability: 9,
    isActive: true,
    rank: 'common',
    name: "+1",
    coin: +1,
    style: {
      width: 70,
      height: 70,
      background: "linear-gradient(#5F8AFA, #4FD1D9)",
      fontSize: 25
    },
  },
  {
    probability: 7,
    isActive: true,
    rank: 'common',
    name: "+2",
    coin: +2,
    style: {
      width: 60,
      height: 60,
      fontSize: 22,
      background: "linear-gradient(#6B6EF9, #4FD1D9)",
    },
  },
  {
    key: 'u2',
    probability: 4,
    isActive: false,
    rank: 'uncommon',
    name: "+4",
    coin: +4,
    style: {
      width: 60,
      height: 60,
      fontSize: 22,
      background: "linear-gradient(#6B6EF9, #4FD1D9)",
    },
  },
  {
    probability: 3,
    isActive: true,
    rank: 'common',
    name: "T+1",
    time: +10,
    style: {
      width: 40,
      height: 40,
      fontSize: 16,
      background: "linear-gradient(#E3935B, #FFC860)",
    },
  },
  {
    rank: 'common',
    isActive: true,
    probability: 4,
    name: "T-1",
    time: -10,
    style: {
      width: 60,
      height: 60,
      fontSize: 22,
      background: "linear-gradient(#E3935B, #FFC860)",
    },
  },
  {
    key: 'u1',
    isActive: false,
    probability: 2,
    name: "T+2",
    time: 20,
    style: {
      width: 50,
      height: 50,
      fontSize: 18,
      background: "linear-gradient(#E3935B, #FFC860)",
    },
  },
  {
    key: 'e1',
    isActive: false,
    probability: 3,
    name: "�",
    style: {
      width: 50,
      height: 50,
      fontSize: 20,
      background: "linear-gradient(to right, #485563, #29323c)",
    },
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const MAX_FIRST_AIRDROP = 3;
  const MAX_AIRDROP = 2;
  const INITIAL_CRIT = false;

  // Select the 'coin' element in the DOM
  const fieldCoin = document.querySelector('.coin');

  // Filter active items from defaultGameItems
  window.activeItems = window.defaultGameItems.filter((item) => item.isActive);

  // Retrieve saved 'coin' value from local storage
  const savedCoin = localStorage.getItem('coin');

  // Parse and initialize 'purchasedCards' from local storage or an empty array
  const purchasedCards = JSON.parse(localStorage.getItem('purchasedCards')) || [];

  // Initialize 'coin' with the saved value or 0 if not found
  window.coin = savedCoin ? parseInt(savedCoin) : 0;

  // Update the 'coin' element with the current 'coin' value
  fieldCoin.innerText = window.coin;

  // Initialize game cards with a 'disabled' status
  window.gameCards = defaultGameCard.map((gameCard) => {
    return { ...gameCard, status: 'disabled' };
  });

  // Initialize 'crit', 'maxAirdrop', and 'items' variables
  window.crit = INITIAL_CRIT;
  window.maxAirdrop = MAX_AIRDROP;
  const items = [];
  window.maxAirdrop = MAX_AIRDROP;

  // Function to add log messages for items
  const addLog = (item) => {
    const { coin, time } = item;

    // Add log logic here...

    return logMessage; // Return the log message
  };

  // Function to set the 'coin' value and update the UI
  window.setCoin = (coinValue) => {
    window.coin += coinValue;

    // Update the 'coin' element with the new 'coin' value
    fieldCoin.innerText = window.coin;

    // Update market card statuses based on 'coin' value
    document.querySelectorAll('.market__card').forEach((fieldCard) => {
      const cardPrice = fieldCard.querySelector('.card__price');
      const cardPriceValue = cardPrice.innerHTML;

      if (window.coin >= cardPriceValue && !fieldCard.classList.contains('active')) {
        fieldCard.classList.remove('disabled');
      }
      if (cardPriceValue > window.coin && !fieldCard.classList.contains('active')) {
        fieldCard.classList.add('disabled');
      }
    });
  };

  // Function to set the time for an item
  const setTime = (atTime) => {
    const seconds = atTime * 1000;
    window.endTime += seconds;
  };

  // Get the fieldTag element and set wrapper dimensions
  const fieldTag = document.querySelector('.field');
  let wrapperWidth = document.body.offsetWidth;
  let wrapperHeight = document.body.offsetHeight - 200;

  if (fieldTag) {
    wrapperWidth = fieldTag.clientWidth;
    wrapperHeight = fieldTag.clientHeight;
  }

  // Function to start the game
  const startGame = () => {
    if (!window.gameStarted) {
      window.gameStarted = true;
      const newItems = getNewItems(MAX_FIRST_AIRDROP, 0, wrapperWidth, wrapperHeight);
      items.push(...newItems);
      startTime();
      newItems.forEach((item) => {
        newElement(item);
      });
    }
  };

  // Add a click event listener to the 'start' button
  const start = document.getElementById('start');
  start.addEventListener('click', startGame);

  // Function to create a new element for an item
  function newElement(atItem) {
    const fieldItem = document.createElement('div');
    fieldItem.className = 'field__item';
    fieldItem.innerHTML = atItem.name;

    document.querySelector('.field').appendChild(fieldItem);

    fieldItem.style.cssText = `
      background: ${atItem.style.background};
      top: ${atItem.style.top}px;
      left: ${atItem.style.left}px;
      width: ${atItem.style.width}px;
      height: ${atItem.style.height}px;
      font-size: ${atItem.style.fontSize}px;
    `;

    fieldItem.addEventListener('click', (itemTag) => {
      const critStrike = window.crit ? critStrikeValue() : 1;

      const onCrit = (value) => (window.crit ? value * critStrikeValue() : value);
      atItem.time ? setTime(onCrit(atItem.time)) : setCoin(onCrit(atItem.coin));

      // Add logic for handling 'crit' and other actions...

      itemTag.target.remove();

      items.splice(items.indexOf(items.find((f) => f.id === itemTag.id)), 1);

      const newItems = getNewItems(window.maxAirdrop, items.length, wrapperWidth, wrapperHeight);
      items.push(...newItems);

      newItems.forEach((item) => newElement(item));
    });
  }
});

// Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
  // Function to generate the card HTML template
  const cardTemplate = (cardData) => (
    `<div class="card__rate">${cardData.rate}</div>
    <div class="card__text">${cardData.text}</div>
    <div class="card__price">${cardData.price}</div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 602" class="card__border">
      <g><path d="M339 365V237h1v128Zm-2-349.91L317 3h-76l-10.35 4H110.36L100 3H23L3 15.09V69H0V14h.39L0 13.33 22 0h295.74L340 13.36l-.37.64h.37v55h-3ZM1 365H0V237h1Zm1 1H0V237h1Zm1.64-234L16 153.26V449L2.67 471 0 469.49 13 448V154L0 132.51Zm228 464 10.36 4H100l10.36-4ZM340 469.49l-2.66 1.5L324 449V153.26L337.36 131l2.63 1.5L327 154v294ZM3 586.91 23 599h294l20-12.09V533h3v55h-.38l.37.64L317.74 602H22L0 588.67l.39-.67H0v-55h3Z" data-name="Layer 1" style="fill-rule:evenodd"/></g>
    </svg>`
  );

  // Function to handle card activation
  const onActiveCard = (fieldCard) => {
    fieldCard.classList.remove("disabled");
    fieldCard.classList.add("active");
  };

  // Loop through game cards and create market cards
  window.gameCards.forEach((gameCard) => {
    const { key, type, text, rate, price, status } = gameCard;
    const newCard = document.createElement('div');
    newCard.className = `market__card ${type} ${status}`;

    newCard.innerHTML = cardTemplate(gameCard);

    const cardPrice = newCard.querySelector('.card__price');

    // Event listener for clicking on card price
    cardPrice && cardPrice.addEventListener('click', (elem) => {
      const fieldCard = elem.target.closest(".market__card");
      fieldCard.classList.add("active");
      setCoin(-price);

      if (window.coin > gameCard.price) {
        newCard.classList.remove('disabled');
      }
      if (key === 'l1') {
        window.maxAirdrop++;
      }
      if (key === 'r1') {
        window.maxTime *= window.maxTime;
      }
      if (key === 'r2') {
        window.activeItems.forEach((gameItems) => {
          gameItems.coin && gameItems.probability++;
        });
      }
      if (key === 'e2') {
        window.crit = true;
      }
    });

    // Append the card to the market
    window.market.appendChild(newCard);
  });
});

// Define the maximum end time and initialize maxTime and gameStarted
let MAX_END_TIME = 60;
window.maxTime = MAX_END_TIME;
window.gameStarted = false;

// Store the clock element to avoid repeated DOM queries
const clock = document.getElementById('timer');

// Function to handle the game over scenario
const gameOver = () => {
  const node = document.querySelector(".field");
  node.innerHTML = "";
  window.gameStarted = false;
  localStorage.setItem('coin', window.coin.toString());
  localStorage.setItem('purchasedCards', JSON.stringify(purchasedCards));
};

// Configure timer updating settings
const timerUpdatingPeriod = 70;
const startTimeBallance = 60;

// Initialize timer-related variables
window.timerInterval = null;
const getSeconds = (end) => (end - Date.now()) / 1000;
const startingTimeLeft = startTimeBallance * 1000;

window.endTime = Date.now() + startingTimeLeft;
window.seconds = getSeconds(window.endTime);
window.pausedTimeBallance = null;

// Function to start the game timer
const startTime = () => {
  window.pausedTimeBallance = null;
  window.seconds = startTimeBallance;
  window.endTime = Date.now() + startingTimeLeft;

  window.timerInterval = setInterval(() => {
    if (window.pausedTimeBallance) {
      clearInterval(window.timerInterval);
      window.timerInterval = null;
      return;
    }

    const timeLeft = getSeconds(window.endTime);
    if (timeLeft > 0) {
      if (timeLeft > window.maxTime) {
        window.endTime = Date.now() + startingTimeLeft;
      }
      if (timeLeft < window.maxTime) {
        window.seconds = timeLeft;
        clock.innerHTML = `${seconds}`;
      }
    } else {
      console.log("Game Over");

      window.seconds = 0;
      clock.innerHTML = window.seconds;
      clearInterval(window.timerInterval);
      window.timerInterval = null;
      gameOver();
    }
  }, timerUpdatingPeriod);
};

// Function to generate a random integer within a specified range
const randomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

// Function to determine the critical strike value (1 or 2)
const critStrikeValue = () => randomInteger(-2, 2) === 2 ? 2 : 1;

// Function to select a random element from an array
const randomFromArray = (array) => {
  return array[randomInteger(0, array.length - 1)];
}

// Function to get a random position within a specified area
const getRandomPosition = (wrapperWidth, wrapperHeight, width, height) => {
  return {
    top: randomInteger(0, wrapperHeight - height),
    left: randomInteger(0, wrapperWidth - width),
  };
}

// Function to generate a new item with random properties
const getNewItem = (width, height) => {
  const itemType = randomFromArray(getProbability(window.activeItems));
  const position = getRandomPosition(
    width,
    height,
    itemType.style.width,
    itemType.style.height
  );
  const item = {
    id: (Date.now() + Math.random() * 1000).toString(),
    ...itemType,
    style: {
      ...itemType.style,
      ...position,
    },
    handler: () => { },
  };
  return item;
};

// Function to generate a specified number of new items
const getNewItems = (max, qty, width, height) => {
  const count = randomInteger(qty > 0 ? 0 : 1, max);
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(getNewItem(width, height));
  }
  return items;
};

// Function to calculate the probability distribution of items
const getProbability = (items) => {
  const entity = [];
  items.forEach((item) => {
    for (let i = 0; i < item.probability; i++) {
      entity.push(item);
    }
  });
  return entity;
};

// Get a reference to the market element in the DOM
window.market = document.querySelector('.market');
