// list of possible names

export const names = [
    "William", "Richard", "Henry", "Walter", "Geoffrey", "Peter", "James",
     "Simon", "Roger", "Stephen", "Matthew", "Nicholas", "Gilbert", "Alan", "Philip", "David", "Hugh",
     "Andrew", "Martin", "Adam", "Ralph", "Lawrence", "Reginald", "Edmund", "Gilbert", "Jordan",
     "Osbert", "Godfrey", "Eustace", "Raymond", "Roland", "Cuthbert", "Hubert", "Abelard", "Baldwin", "Benedict",
     "Conrad", "Frederick", "Godwin", "Harold", "Ingram", "Lancelot", "Maurice", "Odo", "Piers", "Reynold"
];

// list of emojis which can be used for the workers
export const emojiYoung = ['🧒', '👦'];
export const emojiOld = ['🧑', '👱', '🧔️', '👨‍🦰', '👨‍🦲', '🧑‍🦱'];

const helpText = 'Monitor your workers\' performance by reviewing the balance in the yearbook.\n\n' +
    'To manage your workers, click on the worker symbol (right). If they underperformed, fire them. '+
    'Replace workers promptly when they die.';


export const helpTexts = [
    'Purchase iron for the smithy and stone for the masonry.\n\nBe aware, though, that market prices fluctuate annually.',
    'Hire skilled workers for your bakery, smithy, and masonry.\n\nEach year, workers come and go.',
    'Annually, the bishop grants funding for your cathedral project.',
    'Your bakers produce bread for your smiths and masons.\n\n' + helpText,
    'Your smiths will forge tools for the masons using iron.\n\n' + helpText,
    'Your masons will use stone and tools to construct the cathedral.\n\n' + helpText
];