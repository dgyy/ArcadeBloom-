/**
 * Randomly shuffle given array
 * 
 * @param {Array} arr 
 */
function shuffle(arr) {
    for (let i = arr.length - 1; i >= 1; i--) {
        let index = randIntFromZero(i);
        let tmp = arr[index];
        arr[index] = arr[i];
        arr[i] = tmp;
    }
}

/**
 * Generate random number between 0 (inclusive)
 * and max (exclusive)
 * 
 * @param {number} max 
 */
function randIntFromZero(max) {
    return Math.floor(Math.random() * max);
}