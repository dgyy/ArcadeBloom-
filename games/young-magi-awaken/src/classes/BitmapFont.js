import { Letter } from './Letter.js'

export class BitmapFont {
  constructor({ imagePath, charWidth, charHeight, charsPerRow }) {
    this.image = new Image()
    this.image.src = imagePath

    this.charWidth = charWidth
    this.charHeight = charHeight
    this.charsPerRow = charsPerRow

    this.isLoaded = false

    this.image.onload = () => {
      this.isLoaded = true
      this.init()
    }

    this.letters = []
    this.letterSequences = [] // To store arrays of letters for each text sequence
    this.currentSequence = 0 // To track which sequence is currently active

    this.FADE_SPEED = 0.02 // Adjust as necessary
    this.fadeState = null // can be "in", "out", or null
    this.fadeAlpha = 1.0
    this.scrollX = 0
    this.checkpoints = [
      {
        activationDistance: 1300,
        x: 1300,
        y: 140,
        text: 'THE KNIGHTS HAVE MAGIC BARRIERS THAT WILL SHRINK THE VOID',
        activated: false,
      },
      {
        activationDistance: 2100,
        x: 2400,
        y: 300,
        text: 'BEWARE KNIGHTS LARGER THAN YOUR VOID',
        activated: false,
      },

      {
        activationDistance: 3200,
        x: 3200,
        y: 100,
        text: 'CARVE YOUR PATH TO GREATNESS',
        activated: false,
      },
      {
        activationDistance: 7000,
        x: 7250,
        y: 100,
        text: 'IM TIRED AND NEED TO GO TO BED NOW',
        activated: false,
        shouldMagentize: false,
      },

      {
        activationDistance: 7000,
        x: 7250,
        y: 120,
        text: 'THANKS FOR PLAYING',
        activated: false,
        shouldMagentize: false,
      },
    ]
  }

  init() {
    this.letterSequences.push(this.createText('YOUNG MAGI AWAKEN', 425, 300))

    this.letterSequences.push(
      this.createText('WITH YOU LIES THE POWER OF VOID', 360, 300),
    )

    this.letterSequences.push(
      this.createText('DRAW YOUR WAND AND USE ITS POWER WISELY', 315, 300),
    )

    this.letterSequences.push(
      this.createText('CLICK AND DRAG TO MOVE THE VOID', 360, 300),
    )

    this.letterSequences.push(
      this.createText('USE THE W A S D KEYS TO MOVE', 660, 138),
    )
    this.letterSequences.push(
      this.createText('COLLECT ORBS TO GROW THE VOID', 1330, 308),
    )
    this.letterSequences.push(
      this.createText(
        'GROW THE VOID TO CONSUME SMALLER OBJECTS LIKE BOXES',
        700,
        148,
      ),
    )

    if (this.letterSequences[this.currentSequence]) {
      this.letters = [...this.letterSequences[this.currentSequence]]
    } else {
      console.warn(
        'Unexpected state: currentSequence does not point to a valid letter sequence.',
      )
    }
  }

  onImageLoad() {
    // This function will be overridden later if needed.
  }

  nextSequence() {
    this.currentSequence++
    if (this.currentSequence < this.letterSequences.length) {
      // Clear any checkpoint text before updating the sequence.
      this.letters = []
      this.letters.push(...this.letterSequences[this.currentSequence])

      // Reset any activated checkpoints.
      for (const checkpoint of this.checkpoints) {
        checkpoint.activated = false
      }
    } else {
      this.letters = []
    }
  }

  showCheckpointText(text, x, y, shouldMagentize) {
    const checkpointLetters = this.createText(text, x, y, true, shouldMagentize)
    this.letters.push(...checkpointLetters) // Append the checkpoint letters to the existing letters
  }

  updateScrollPosition(x) {
    this.scrollX = x

    for (const checkpoint of this.checkpoints) {
      if (x >= checkpoint.activationDistance && !checkpoint.activated) {
        checkpoint.activated = true
        this.showCheckpointText(
          checkpoint.text,
          checkpoint.x,
          checkpoint.y,
          checkpoint.shouldMagentize,
        )
      }
    }
  }

  createText(text, x, y, isCheckpoint = false, shouldMagentize = true) {
    if (!this.isLoaded) {
      console.warn('Bitmap font image not yet loaded.')
      this.onImageLoad = () => {
        this.createText(text, x, y)
      }
      return []
    }

    const letters = []
    const lines = text.split('\n')
    let delayIncrement = 2 // Define how many frames to wait between each letter's animation
    let currentDelay = 0 // Start with no delay for the first letter

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum]
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const charCode = char.charCodeAt(0) - 65

        // Ensure charCode is in the range [0, 25] for A-Z
        if (charCode < 0 || charCode > 25) {
          console.warn(`Unsupported character: ${char}`)
          continue
        }

        const col = charCode % this.charsPerRow
        const row = Math.floor(charCode / this.charsPerRow)

        const sourceX = col * this.charWidth
        const sourceY = row * this.charHeight

        const letter = new Letter({
          char,
          x: x + i * this.charWidth,
          y: y + lineNum * this.charHeight - 20, // Adjust for initial translateY (offset)
          image: this.image,
          sourceX,
          sourceY,
          width: this.charWidth,
          height: this.charHeight,
          delay: currentDelay, // Add delay for staggered animation
          isCheckpoint,
          shouldMagentize,
        })

        letters.push(letter)
        currentDelay += delayIncrement // Increase the delay for the next letter
      }
    }
    return letters
  }
}
