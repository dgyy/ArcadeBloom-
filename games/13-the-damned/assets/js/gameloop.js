let { init, Sprite, Text, Grid, GameLoop, track, initPointer, initKeys, onKey, Button } = kontra;

let { canvas, context } = init();
initPointer();
initKeys();

const card_colours = ['heart', 'diamond', 'club', 'spade'];

let gameboard_height = 3;
let gameboard_width  = 4;
let game_state = 'menu';
let game_points_multiplier = 0;
let number_of_returned_cards = 0;
let current_picked_cards = [];
let cards_sum = 0;
let player_score = 0;
let player_name = '';
let is_name_entered = false;
let difficulty_level = 'easy'; // Difficulty level (easy,normal,hard)

bold_font = 'bold 20px Arial, sans-serif';
normal_font = '20px Arial, sans-serif';

let text_options = {
  color: 'white',
  font: normal_font
};

const MAXCARDS = gameboard_height * gameboard_width;
const THIRTEEN = 13;
const MAX_HIGH_SCORES = 5;
const EASYMULTIPLIER = 0.75; // Difficulty level multiplier
const NORMALMULTIPLIER = 1; // Difficulty level multiplier
const HARDMULTIPLIER = 2; // Difficulty level multiplier
let difficulty_multiplier = EASYMULTIPLIER;

onKey('r', function(e) {
  // return to the game menu
  console.log("r key pressed ! ");
  game_state = 'menu';
});

let card_figures = {
  heart: '♥️',
  spade: '♠️',
  diamond: '♦️',
  club: '♣️',
  jocker: '🃏'
};

function capitalize_first_letter(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

let generate_full_deck = function(){
  let data = {};
  for (let colorname of card_colours) {
    if (! data.hasOwnProperty(colorname)){
      data[colorname] = ['ace','two','three','four','five','six','seven','eight','nine','ten','jack','queen','king'];
    }
  };
  return data;
};
let full_deck = generate_full_deck();

let retrieve_card_value = function(cards_deck,card_color,card_figure){
  let card_index = cards_deck[card_color].indexOf(card_figure);
  let card_value = card_index + 1;
  return card_value;
}

function get_highscores() {
  // Retrieve scores from localStorage or return an empty array if not present
  return JSON.parse(localStorage.getItem('13_the_damned_highscores')) || [];
}

function save_highscore(new_score, player_name) {
  let highscores = get_highscores();
  const new_highscore = { score: new_score, name: player_name };

  // Add new score and sort the array in descending order
  highscores.push(new_highscore);
  highscores.sort((a, b) => b.score - a.score);

  // Limit the array to top MAX_HIGH_SCORES scores
  highscores.splice(MAX_HIGH_SCORES);

  // Save back to localStorage
  localStorage.setItem('13_the_damned_highscores', JSON.stringify(highscores));
}

// Function to generate table rows
function generate_score_table(highscores) {
  let text_objects = [];
  let start_y = 160; // Starting Y position for the first row
  let row_height = 40; // Space between each row
  let last_y_pos = start_y; // Used by text message proposing to restart a game

  // Column x positions for rank, name, and score
  const rankX = 200;
  const nameX = 300;
  const scoreX = 400;

  // Header row
  text_objects.push(Text({
    text: 'Rank',
    font: '20px Arial',
    color: 'white',
    x: rankX,
    y: start_y - 40,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  }));
  text_objects.push(Text({
    text: 'Name',
    font: '20px Arial',
    color: 'white',
    x: nameX,
    y: start_y - 40,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  }));
  text_objects.push(Text({
    text: 'Score',
    font: '20px Arial',
    color: 'white',
    x: scoreX,
    y: start_y - 40,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  }));

  // Loop through high scores and create Text objects for each entry
  highscores.forEach((entry, index) => {
    let y_pos = start_y + (index * row_height);
    last_y_pos = y_pos;

    text_objects.push(Text({
      text: `${index + 1}`.padStart(3,'0'),  // Rank
      font: '20px Arial',
      color: 'white',
      x: rankX,
      y: y_pos,
      anchor: {x: 0.5, y: 0.5},
      textAlign: 'center'
    }));

    text_objects.push(Text({
      text: entry.name,  // Player Name
      font: '20px Arial',
      color: 'white',
      x: nameX,
      y: y_pos,
      anchor: {x: 0.5, y: 0.5},
      textAlign: 'center'
    }));

    text_objects.push(Text({
      text: entry.score.toString().padStart(3,'0'),  // Player Score
      font: '20px Arial',
      color: 'white',
      x: scoreX,
      y: y_pos,
      anchor: {x: 0.5, y: 0.5},
      textAlign: 'center'
    }));
  });

  // Add a message to restart a game
  text_objects.push(Text({
    text: 'Press [r] to restart',
    font: 'bold 16px Arial',
    color: 'white',
    x: 300,
    y: last_y_pos + (row_height * 1.5),
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  }));

  return text_objects;
}

function new_banner(msg, colorname) {
  return Text({
    text: msg,
    font: '54px Arial',
    color: colorname,
    x: 300,
    y: 75,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  });
}

let game_title = new_banner('🎭 13 The Damned 🎭', 'yellow');
let highscores_title = new_banner('🏆 -= Highscore =- 🏆', 'gold');
let difficulty_level_title = new_banner('💪🏼 Select Difficulty 💪🏼', 'silver');

let game_over = Text({
  text: 'Game Over\n\nYour score: ' + player_score,
  font: 'italic 58px Arial',
  color: 'red',
  x: 300,
  y: 100,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center',
  update: function () {
    this.text = 'Game Over\nYour score: ' + player_score
  }
});

let game_won = Text({
  text: '🎉Congratulation🎉\n\nYour score: ' + player_score,
  font: 'italic 58px Arial',
  color: 'blue',
  x: 300,
  y: 100,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center',
  update: function () {
    this.text = '🎉Congratulation🎉\nYour score: ' + player_score
  }
});

// Difficulty level buttons
function option_button(text, xpos, ypos, colorname,ratio){
  return Text({
    text: capitalize_first_letter(text),
    font: '20px Arial',
    color: colorname,
    x: xpos,
    y: ypos,
    onDown() {
      difficulty_level = text;
      difficulty_multiplier = ratio;
      console.log('Difficulty set to ' + capitalize_first_letter(text));
    },
    onOver: function() {
      this.font = bold_font;
    },
    onOut: function() {
      this.font = normal_font;
    }
  });
}

let easy_button = option_button('easy', 150, 150, 'white', EASYMULTIPLIER);
let medium_button = option_button('medium', 200+easy_button.width, 150, 'white', NORMALMULTIPLIER);
let hard_button = option_button('hard', 300+medium_button.width, 150, 'white', HARDMULTIPLIER);

// Track these objects for pointer (mouse/touch) interaction
track(easy_button);
track(medium_button);
track(hard_button);

let start_again = Text({
  text: 'Press [r] to restart',
  font: 'bold 16px Arial',
  color: 'white',
  x: 300,
  y: 225,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center'
});

let title_widget = Text({
  text: '🎭 13 The Damned\n('+difficulty_level+')',
  font: 'bold 20px Arial',
  color: 'yellow',
  x: 500,
  y: 50,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center',
  update: function () {
    this.text = '🎭 13 The Damned\n('+difficulty_level+')'
  }
});

let cards_sum_widget = Text({
  text: 'Cards sum: ' + cards_sum,
  font: 'bold 20px Arial',
  color: 'white',
  x: 500,
  y: 150,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'left',
  update: function () {
    this.text = 'Cards sum: ' + cards_sum,
    this.textAlign = 'left'
  }
});

let score_widget = Text({
  text: 'Score : ' + player_score,
  font: 'bold 20px Arial',
  color: 'white',
  x: 500,
  y: 200,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'left',
  update: function () {
    this.text = 'Score: ' + player_score,
    this.textAlign = 'left'
  }
});

let bonus_widget = Text({
  text: 'Bonus \nX ' + game_points_multiplier,
  font: 'bold 20px Arial',
  color: 'white',
  x: 500,
  y: 250,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center',
  update: function () {
    this.text = 'Bonus \nX ' + game_points_multiplier
  }
});

let start = Text({
  text: 'Start',
  onDown: function() {
    // handle on down events on the sprite
    console.log("Clicked on Start");
    game_state = 'play';
    game_points_multiplier = 0;
    init_gameboard();
  },
  onOver: function() {
    this.font = bold_font;
  },
  onOut: function() {
    this.font = normal_font;
  },
  ...text_options
});

let difficulty = Text({
  text: 'Difficulty',
  onDown: function() {
    // handle on down events on the sprite
    console.log("Clicked on Difficulty");
    game_state = 'difficultychoice';
  },
  onOver: function() {
    this.font = bold_font;
  },
  onOut: function() {
    this.font = normal_font;
  },
  ...text_options
});

let highscore = Text({
  text: 'Highscore',
  onDown: function() {
    // handle on down events on the sprite
    console.log("Clicked on High Score");
    game_state = 'highscores';
  },
  onOver: function() {
    this.font = bold_font;
  },
  onOut: function() {
    this.font = normal_font;
  },
  ...text_options
});

let start_menu = Grid({
  x: 300,
  y: 250,
  anchor: {x: 0.5, y: 0.5},

  // add 15 pixels of space between each row
  rowGap: 15,

  // center the children
  justify: 'center',

  children: [start, difficulty, highscore]
});
track(start,difficulty,highscore);

let keep_button = Button({
  // sprite properties
  x: 500,
  y: 300,
  anchor: {x: 0.5, y: 0.5},

  // text properties
  text: {
    text: 'Keep Cards',
    color: 'white',
    font: '20px Arial, sans-serif',
    anchor: {x: 0.5, y: 0.5}
  },

  // button properties
  padX: 20,
  padY: 10,

  sprite: Sprite({
    x: this.x,
    y: this.y,
    width: 150,
    height: 40,
    color: 'blue',
    radius: 5,
    render: function() {
      this.context.fillStyle = this.color;
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.roundRect(0, 0, this.width, this.height, this.radius);
      this.context.fill();
      this.context.stroke();
    }
  }),
  onDown: function() {
    player_score += cards_sum * game_points_multiplier;
    cards_sum = 0;
    game_points_multiplier = 0;
    current_picked_cards = [];
    if (is_game_ended(number_of_returned_cards)){
      player_score = Math.ceil(player_score * difficulty_multiplier);
      console.log('final score: ' + player_score);
      game_state = 'gamewon';
    }
    // Reset pressed state after the action
    this.pressed = false;
  },
  render() {
    this.sprite.render();
    // focused by keyboard
    if (this.focused) {
      this.context.setLineDash([8,10]);
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'red';
      this.context.strokeRect(0, 0, this.width, this.height);
    }

    // pressed by mouse, touch, or enter/space on keyboard
    if (this.pressed) {
      this.textNode.color = 'yellow';
    }
    // hovered by mouse
    else if (this.hovered) {
      this.textNode.color = 'white';
      this.textNode.font = bold_font;
      canvas.style.cursor = 'pointer';
    }
    else  {
      this.textNode.color = 'white';
      this.textNode.font = normal_font;
      canvas.style.cursor = 'initial';
    }
  }
});

let endgame_button = Button({
  // sprite properties
  x: 495,
  y: 350,
  anchor: {x: 0.5, y: 0.5},

  // text properties
  text: {
    text: 'End Game',
    color: 'white',
    font: '20px Arial, sans-serif',
    anchor: {x: 0.5, y: 0.5}
  },

  // button properties
  padX: 20,
  padY: 10,

  sprite: Sprite({
    x: this.x,
    y: this.y,
    width: 150,
    height: 40,
    color: 'orange',
    radius: 5,
    render: function() {
      this.context.fillStyle = this.color;
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.roundRect(0, 0, this.width, this.height, this.radius);
      this.context.fill();
      this.context.stroke();
    }
  }),
  onDown: function() {
    console.log('final score: ' + cards_sum * game_points_multiplier);
    player_score += cards_sum * game_points_multiplier;
    player_score = Math.ceil(player_score * difficulty_multiplier);
    console.log('final score: ' + player_score);
    cards_sum = 0;
    game_points_multiplier = 0;
    current_picked_cards = [];
    game_state = 'gamewon';

    // Reset pressed state after the action
    this.pressed = false;
  },
  render() {
    this.sprite.render();
    // focused by keyboard
    if (this.focused) {
      this.context.setLineDash([8,10]);
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'red';
      this.context.strokeRect(0, 0, this.width, this.height);
    }

    // pressed by mouse, touch, or enter/space on keyboard
    if (this.pressed) {
      this.textNode.color = 'yellow';
    }
    // hovered by mouse
    else if (this.hovered) {
      this.textNode.color = 'white';
      this.textNode.font = bold_font;
      canvas.style.cursor = 'pointer';
    }
    else  {
      this.textNode.color = 'white';
      this.textNode.font = normal_font;
      canvas.style.cursor = 'initial';
    }
  }
});

let game_cards = [];
let card_pos_x = 10;
let card_pos_y = 10;
let card_width = (canvas.width / gameboard_width) - 60;
let card_height = card_width * 1.3;

class Card {
  constructor(x, y, width, height, color, card_color, card_figure, text_color) {
    this.card_color = card_color;
    this.card_figure = card_figure;
    this.color = color;
    this.returned = false;
    this.kept = false;
    this.lost = false;
    this.sprite = Sprite({
      x: x,
      y: y,
      width: width,
      height: height,
      color: this.color,
      onDown: this.on_pointer_down.bind(this),
      radius: 5,
      render: function() {
        this.context.fillStyle = this.color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.roundRect(0, 0, this.width, this.height, this.radius);
        this.context.fill();
        this.context.stroke();
      }
    });

    this.text = Text({
      text: capitalize_first_letter(card_figure) + '\n\n' + this.card_icon(),
      font: 'bold 16px Arial',
      color: text_color,
      x: x + width / 2,
      y: y + height / 2,
      anchor: { x: 0.5, y: 0.5 },
      textAlign: 'center',
      onDown: this.on_pointer_down.bind(this)
    });
    // Track pointer events on this sprite
    track(this.sprite, this.text);
  }

  show_card(){
    this.sprite.color = 'white';
    this.returned     = true;
  }

  is_pick(){
    return this.kept;
  }


  is_lost(){
    return this.lost;
  }

  pick_card(){
    this.kept = true;
  }

  add_card_value(){
    let card_value = retrieve_card_value(full_deck,this.card_color,this.card_figure);
    console.log('Card value = ' + card_value);
    cards_sum += card_value;
  }

  card_icon(){
    return card_figures[this.card_color];
  }

  is_damned(){
    let card_value = retrieve_card_value(full_deck,this.card_color,this.card_figure);
    if (this.returned && (card_value == THIRTEEN)){
      return true;
    } else {
      return false;
    }
  }

  discard_card(){
    this.kept = false;
    this.lost = true;
  }

  update(){
    if (this.is_lost()){
      this.sprite.color = 'gray';
    }
    this.sprite.update();
    this.text.update();
  }

  render(){
    if (this.returned){
      this.sprite.render();
      this.text.render();
    } else {
      this.text.render();
      this.sprite.render();
    }
  }

  // Handle the pointer down event
  on_pointer_down() {
    console.log(`Card with text "${this.text.text}" clicked!`);
    // Additional actions on click can be added here
    this.show_card();
    number_of_returned_cards += 1;
    this.add_card_value();
    current_picked_cards.push(this);
    game_points_multiplier += 1;
    console.log(game_cards)
    console.log('Current multiplier: ' + game_points_multiplier);
  }

  // Check if the card was clicked
  checkForClick() {
    if (this.sprite.collidesWithPointer()) {
      this.on_pointer_down();
    }
  }

}

function is_game_ended(returned_cards){
  if (returned_cards == MAXCARDS){
    return true;
  } else {
    return false;
  }
}

function filter_card_by_difficulty(color,level,number_of_king){
  let max_damned=0;
  let idx = Math.floor(Math.random() * game_deck[color].length);
  console.log(game_deck[color][idx])
  if (game_deck[color][idx] == 'king') {
    number_of_king += 1;
    console.log('number of king: ' + number_of_king);
  }
  switch (level) {
    case 'easy':
      console.log('difficulty easy')
      break;
    case 'normal':
      console.log('difficulty normal')
      max_damned=1;
      break;
    case 'hard':
      console.log('difficulty hard')
      max_damned=2;
      break;
  }
  console.log('damned number: ' + max_damned);
  while(number_of_king > max_damned){
    idx = Math.floor(Math.random() * game_deck[color].length);
    if (game_deck[color][idx] != 'king') {
      number_of_king -= 1;
    }
  }
  return idx; 
}

function init_gameboard(){
  game_cards = [];
  cards_sum = 0;
  player_score = 0;
  number_of_returned_cards = 0;
  let generate_random = function(){
    game_deck = JSON.parse(JSON.stringify(full_deck))
    console.log(game_deck);
    let random_cards = {};
    let number_of_king=0;
    for (let i = 1; i <= gameboard_height * gameboard_width; i++) {
      let card_color=card_colours[Math.floor(Math.random() * 4)]
      if (! random_cards.hasOwnProperty(card_color)){
        random_cards[card_color] = [];
      }
      //let card_idx=Math.floor(Math.random() * game_deck[card_color].length);
      let card_idx=filter_card_by_difficulty(card_color,difficulty_level,number_of_king);
      console.log('number of king: ' + number_of_king);
      random_cards[card_color].push(game_deck[card_color][card_idx]);
      game_deck[card_color].splice(card_idx,1);
    }
    return random_cards;
  }
  let picked_cards = generate_random();
  console.log(picked_cards);
  //console.log(game_deck);
  let cards_by_line_limit = gameboard_width;
  let cards_by_line = 0;
  let card_X = card_pos_x;
  let card_Y = card_pos_y;
  for (let card_color in picked_cards){
    console.log(card_color);
    console.log(picked_cards[card_color]);
    for (let card in picked_cards[card_color]){
      console.log(picked_cards[card_color][card]);
      if (cards_by_line < cards_by_line_limit){
        if (cards_by_line){
          card_X += card_width + 10;
        }
      } else {
        card_X = card_pos_x;
        card_Y += card_height + 10;
        cards_by_line = 0;
      }
      let card_text_color = ((card_color == 'heart') || (card_color  == 'diamond')) ? 'red' : 'black';
      let card_symbol = new Card(card_X, card_Y, card_width, card_height, 'blue', card_color, picked_cards[card_color][card],card_text_color);
      game_cards.push(card_symbol);
      cards_by_line += 1;
    }
  }
  console.log(game_cards)
}

function have_you_been_cursed(current_card){
  if (current_card.is_damned()){
    game_state = 'gameover'
  }
}

function check_cards_sum(){
  if (cards_sum >= THIRTEEN){
    console.log('You reached damned number');
    for (let card of current_picked_cards){
      card.discard_card();
      console.log(card.card_figure + ' - ' + card.is_lost());
    }
    cards_sum = 0;
    game_points_multiplier = 0;
    current_picked_cards = [];
  }
}
let scoreTable = [];
let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    let highscores = [];
    // Generate the high score table
    switch (game_state) {
      case 'menu':
        break;
      case 'difficultychoice':
        console.log('Difficulty_choose: ' + difficulty_level);
        break;
      case 'play':
        for (card in game_cards){
          //console.log(card);
          game_cards[card].update();
          have_you_been_cursed(game_cards[card]);
          title_widget.update();
          cards_sum_widget.update();
          bonus_widget.update();
          score_widget.update();
        }
        console.log('Current sum of selected cards: ' + cards_sum)
        check_cards_sum();
        break;
      case 'gameover':
        game_over.update();
        // Check if player made a high score
        highscores = get_highscores();
        break;
      case 'gamewon':
        game_won.update();
        // Check if player made a high score
        highscores = get_highscores();
        if (player_score > highscores[highscores.length - 1]?.score || highscores.length < MAX_HIGH_SCORES) {
          // Player has a high score, ask for their name
          let player_name = prompt('New High Score! Enter your nickname:');
          console.log('player_name: ['+player_name+']');
          let trimmed_player_name = player_name.substring(0, 3);
          console.log('trimmed_player_name: ['+trimmed_player_name+']');
          save_highscore(player_score, trimmed_player_name);
        }
        scoreTable = generate_score_table(get_highscores());
        game_state = 'highscores';
        break;
      case 'highscores':
        scoreTable = generate_score_table(get_highscores());
        break;
    }
  },
  render: function() { // render the game state
    switch (game_state) {
      case 'menu':
        game_title.render();
        start_menu.render();
        break;
      case 'difficultychoice':
        difficulty_level_title.render();
        easy_button.render();
        medium_button.render();
        hard_button.render();
        start_again.render();
        break;
      case 'play':
        for (card in game_cards){
          //console.log(card);
          game_cards[card].render();
          title_widget.render();
          cards_sum_widget.render();
          bonus_widget.render();
          score_widget.render();
          keep_button.render();
          endgame_button.render();
        }
        break;
      case 'gameover':
        game_over.render();
        start_again.render();
        break;
      case 'gamewon':
        game_won.render();
        start_again.render();
        break;
      case 'highscores':
        highscores_title.render()
        // Render the high score table
        scoreTable.forEach(row => row.render());
        break;
    }
  }
});

loop.start();    // start the game