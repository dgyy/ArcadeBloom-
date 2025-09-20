export const i = (i, p, c) => ({
    i, p, c
})

export const ns = (_i, notes) => notes.map(note => ({
    songData: [i(_i, [1], [{ n: [note], f: [] }])],
    rowLen: 5513,   // In sample lengths
    patternLen: 32,  // Rows per pattern
    endPattern: 0,  // End pattern
    numChannels: 1  // Number of channels
}))