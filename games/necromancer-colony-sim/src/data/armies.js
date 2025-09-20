// indices
export const name = 0;
export const description = 1;
export const health = 2;
export const defense = 3;
export const attack = 4;
export const advantage = 5;
export const upk = 6;  // upk is a calculated value (see notes)
export const capacity = 7;
export const trained = 8;
export const visible = 9;

export const militia = 0;
export const archers = 1;
export const infantry = 2;
export const cavalry = 3;

const armies = [];
export default armies;

export function initArmies() {
  armies.push(
    // 0
    [
      'Militia',
      'Unarmed and unarmored Skeletons. Weak vs everything.',
      40,
      0,
      5,
      [],
      22,
      1
    ],

    // 1
    [
      'Archers',
      'Skeletons with Bows. Good vs Infantry.',
      75,
      14,
      9,
      // index = army index
      [.25, .75],
      11,
      2
    ],

    // 2
    [
      'Infantry',
      'Armed and armored Skeletons. Good vs Cavalry.',
      100,
      25,
      15,
      [.25,,, .5],
      6,
      4
    ],

    // 3
    [
      'Cavalry',
      'Skeletons on horses. Good vs Archers.',
      150,
      40,
      25,
      [.25,, .5],
      4,
      8
    ]
  )
}


/*
Notes:

Unit strength vs other units:

# MILITIA (M)

## vs militia

40 (M: hp + def) / 5 (M: atk) = 8 militia needed to kill 1 militia

## vs infantry

125 / 5 = 25

## vs archers

89 / 5 = 17.8

## vs cavalry

190 / 5 = 38

AVERAGE: 22.2 (units needed to kill 1 other unit)



# INFANTRY (I)

## vs militia

40 / (15 * 1.25) (I: R value vs militia) = 2.13

## vs infantry

125 / 15 = 8.33

## vs archers

89 / 15 = 5.93

## vs cavalry

190 / (15 * 1.5) = 8.4

AVERAGE: 6.2



# ARCHERS

## vs militia

40 / (9 * 1.25) = 3.5

## vs infantry

125 / (9 * 1.75) = 7.94

## vs archers

89 / 9 = 9.8

## vs cavalry

190 / 9 = 21.1

AVERAGE: 10.585



# CALVARY

## vs militia

40 / (25 * 1.25) = 1.33

## vs infantry

125 / 25 = 5

## vs archers

89 / (25 * 1.5) = 2.373

## vs cavalry

190 / 25 = 7.6

AVERAGE: 4.07


militia  = 22.2 units per kill (upk)
archers  = 10.59
infantry = 6.2
cavalry  = 4.07

archers are x2.096 better than militia
infantry are x1.71 better than archers
cavalry are x1.52 better than infantry

mana cost guide:
militia (base)
archers x2 militia
infantry x1.7 archers
cavalry x1.5 infantry

mana cost:
militia  = 50
archers  = 100
infantry = 175
cavalry  = 250

reanimate amount (each unit type should get closer to 1)
militia  = x10 (22.2 upk / 10) = 2.22
archers  = x6  (10.59 upk / 6) = 1.765
infantry = x5  (6.2 upk / 5)   = 1.24
cavalry  = x4  (4.07 upk / 4)  = 1.0175

*/