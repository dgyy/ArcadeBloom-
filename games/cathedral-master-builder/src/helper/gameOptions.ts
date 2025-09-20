export const gameOptions = {

    // tick system parameters
    yearLength: 10,         // length of an in-game year in second

    // game width and height TODO: Should be taken with "getCanvas()" however when I try to take it this way it is not initialized yet
    gameWidth: 0,
    gameHeight: 0,

    // minimum, maximum and variation numbers (where applicable)
    wage: [10, 30, 5],

    marketPriceMatrix: [
        [15, 25],                       // 0: price for 10 iron
        [5, 15]                         // 1: price for 10 stone
    ],

    fontTitlePictures: {
        font: '80px Arial',
        color: 'white',
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
    },

    fontButtonProgress: {
        font: '48px Arial',
        color: 'White',
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
    },

    fontYearbook: {
        font: '20px Arial',
        color: 'black'
    },

    fontSubtitles: {
        font: '32px Arial',
        color: 'white',
        textAlign: 'center'
    }

}