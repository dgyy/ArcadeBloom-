# TimeRush Game

TimeRush is an exciting web-based game where you can collect various items, control time, and maximize your earnings. In this README, we provide an overview of the code and functionality of the game.

## Getting Started

Clone this repository to your local computer and open it in your preferred code editor. To start playing the game, open the index.html file in a web browser.

```bash
git clone https://github.com/your-username/TimeRush.git
cd TimeRush
```

# Game Description

This Markdown document provides an overview of a simple web-based game implemented in JavaScript. The game includes elements such as coins, cards, and items. Players can interact with the game by clicking on items, purchasing cards, and managing their in-game currency.

## Game Setup

The game is initialized with the following default data:

### Default Game Card Data

- Uncommon Cards (★)
  - Adds an item with a large amount of time (Price: 32)
  - Adds an item with a large number of coins (Price: 32)

- Rare Cards (★★)
  - Increases maximum time over 60 (Price: 64)
  - Increases the probability of finding a coin (Price: 64)

- Epic Cards (★★★)
  - Adds an item with a random effect (Price: 128)
  - Gives a critical hit chance for each item (Price: 128)

- Legendary Cards (★★★★)
  - Increases maximum number of airdrops (Price: 256)

### Default Game Items Data

- Common Items
  - "+1" (Coin: +1)
  - "+2" (Coin: +2)
  - "T+1" (Time: +10)

- Uncommon Item
  - "+4" (Coin: +4)

- Special Item
  - "T-1" (Time: -10)
  - "T+2" (Time: +20)
  - "�" (Special Effect)

## Game Elements

### Coin

Players collect coins throughout the game. The initial coin balance is 0.

### Cards

Players can purchase cards from the market. Cards are categorized as uncommon (★), rare (★★), epic (★★★), and legendary (★★★★). Each card has a specific price and effect. For example, rare cards can increase the maximum time or the probability of finding a coin.

### Items

Items appear in the game field, and players can click on them to gain benefits. Items have different effects, such as increasing coins or time. Some items have special effects, and there is a chance for critical hits.

## Game Mechanics

- Players start with no coins.
- Players can click the "Start" button to begin the game.
- Items appear in the game field, and players can click on them to gain rewards.
- Players can purchase cards from the market using their coins.
- Cards have various effects that enhance the gameplay.
- The game ends when the timer reaches zero.

## Game Logic

The game logic is implemented in JavaScript. It handles item interactions, card purchases, and game mechanics. The game includes a timer, critical hit mechanics, and the ability to purchase cards from the market.

The game also stores player progress, including the coin balance and purchased cards, in local storage to allow for continued play.

This Markdown document provides an overview of the game setup, elements, and mechanics. The actual implementation details and code can be found in the accompanying JavaScript file.

## Unlocking the Power of Blockchain

In TimeRush Game, players can collect various items, manipulate time, and maximize their profits. What sets this game apart is the ability for players to create and develop tokens within a blockchain ecosystem. Dive into the world of TimeRush and experience the thrill of both gaming and blockchain innovation.
