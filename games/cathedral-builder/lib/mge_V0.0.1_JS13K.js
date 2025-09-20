const mge = {
//!//!//!//!//!//!//!//!
//! Commented the keyboaord
//! and sprite collisions
//! becauses not needed for this game
//!//!//!//!//!//!//!//!
//!    TITLE:'Mini Game Engine',
//!    VERSION:'V0.0.1',

    // Libraries
    _audio:{},
    _canvas:{},
    _game:{},
    _loop:{},
    _mouse:{},
//!    _keyboard:{},
    _sequencer:{}
}
///////////////////////////
// Audio API
///////////////////////////
mge.audio = {
    
    ////////////////
    // Properties
    ////////////////
    // Current audio time
    get currentAudioTime () {
        return mge._audio._audioContext.currentTime
    },
    // Global Audio volume
    get volume() {
        return mge._audio._volume
    },
    set volume(_value) {
        mge._audio._setVolume(_value)
    },

    ////////////////
    // Methods
    ////////////////
    playSound: function(_synthConfig,_frequency,_startTime,_duration,_volume) {
        mge._audio._playSound(_synthConfig, mge._audio._audioGain, _frequency, _startTime, _duration, _volume)
    }
}


///////////////////////////
// Sequencer API
///////////////////////////
mge.sequencer = {

    ////////////////    
    // Properties
    ////////////////
    get bpm() {
        return mge._sequencer._bpm
    },
    set bpm(_value) {
        mge._sequencer._bpm = _value
    },
    
    ////////////////
    // Methods
    ////////////////
    createTrack: function (_bars, _instrument, _volume) {
        return mge._sequencer._createTrack (_bars, _instrument, _volume)
    },
    start: function() {
        mge._sequencer._start()
    },
    stop: function() {
        mge._sequencer._stop()
    },
    reset: function() {
        mge._sequencer._create()
    }
    
    
}
///////////////////////////
// Game API
///////////////////////////
mge.game = {
    
    ////////////////
    // Properties
    ////////////////
    // Game size
    get width() {
        return mge._canvas._renderCanvas.width
    },
    set width(_value) {
        mge._canvas._renderCanvas.width = _value
    },
    get height() {
        return mge._canvas._renderCanvas.height
    },
    set height(_value) {
        mge._canvas._renderCanvas.height = _value
    },
    // Frames per second
    get fps() {
        return mge._loop._fps
    },
    // Number of clones
    get clonesNb() {
        return mge._game._getClonesNb()
    },

    ////////////////
    // Methods
    ////////////////
    start: function(_scene) {
        mge._game._start(_scene)
    },
    changeScene: function(_scene) {
        mge._game._sceneChange(_scene)
    },
    createSprite: function() {
        return mge._game._createSprite()
    }
}
///////////////////////////
// Keyboard API
///////////////////////////
//!mge.keyboard = {
    ////////////////
    // Properties
    ////////////////
//!    get keysPressed() {
//!        return mge._keyboard._keyPressed
//!    },
    
    ////////////////
    // Methods
    ////////////////
//!    isKeyPressed: function (_key) {
//!        return mge._keyboard._isKeyPressed(_key)
//!    }
//!}
///////////////////////////
// Mouse API
///////////////////////////
mge.mouse = {

    ////////////////
    // Properties
    ////////////////
    get isClicked () {
        return mge._mouse._isClicked
    },
    get x() {
        return mge._mouse._x
    },
    get y() {
        return mge._mouse._y
    }

}
// API on sprite objects    
mge._sprite = {
    ////////////////
    // Properties
    ////////////////
    // Draw function
    set drawFunction(_value) {
        this._drawFunction = _value
    },
    // width
    get width() {
        return this._width
    },
    set width(_value) {
        this._width = _value
    },
    // height
    get height() {
        return this._height
    },
    set height(_value) {
        this._height = _value
    },
    // x
    get x() {
        return this._x
    },
    set x(_value) {
        this._x = _value
    },
    // y
    get y() {
        return this._y
    },
    set y(_value) {
        this._y = _value
    },
    // scaleX
    get scaleX() {
        return this._scaleX
    },
    set scaleX(_value) {
        this._scaleX = _value
    },
    // scaleY
    get scaleY() {
        return this._scaleY
    },
    set scaleY(_value) {
        this._scaleY = _value
    },
    // isVisible
    get isVisible() {
        return this._isVisible
    },
    set isVisible(_value) {
        this._isVisible = _value
    },
    // drawBoundaries
    get drawBoundaries() {
        return this._drawBoundaries
    },
    set drawBoundaries(_value) {
        this._drawBoundaries = _value
    },
     // is touched by mouse
    get isTouched() {
        return this._isTouched(mge._mouse._x, mge._mouse._y)
    },   
     // is clicked
     get isClicked() {
        return this._isClicked(mge._mouse._x, mge._mouse._y, mge._mouse._isClicked)
    },  
    
    ////////////////
    // Methods
    ////////////////
    draw : function () {
        this._draw()
    },
//!    isColliding : function(_spriteToCheck) {
//!        return this._isColliding(_spriteToCheck)
//!    },
    cloneCreate : function() {
        return this._cloneCreate()
    },
    cloneDelete : function() {
        this._cloneDelete()
    },
    cloneDeleteAll : function() {
        this._cloneDeleteAll()
    },
    cloneExecuteForEach : function(_method) {
        return this._cloneExecuteForEach(_method)
//!    },
//!    listCollisionsWithClones : function(_sprite) {
//!        return this._listCollisionsWithClones(_sprite)
    }
}
///////////////////////////
// Apply an ADSR envelopp
// to a given audio param
///////////////////////////
mge._audio._applyADSR = function (_envelop, _audioParam, _startTime, _duration) {

    // Get parameters
    let a = _envelop.a || 0.0001
    let d = _envelop.d || 0.0001
    let s = _envelop.s || 0.0001
    let r = _envelop.r || 0.0001
    let _minValue = _envelop.minValue || 0.0001
    let _maxValue = _envelop.maxValue || 1

    // Case 1: duration < attack
    if (_duration <= a) {
        // Attack
        _audioParam.setValueAtTime(_minValue, _startTime)
        _audioParam.exponentialRampToValueAtTime(_maxValue*_duration/a, _startTime+_duration)
        // Release
        _audioParam.exponentialRampToValueAtTime(_minValue, _startTime+_duration+r) 
    } 
    // Case 2: duration < attack + decay
    else if (_duration <= a + d) {
        // Attack
        _audioParam.setValueAtTime(_minValue, _startTime)
        _audioParam.exponentialRampToValueAtTime(_maxValue, _startTime+a)
        // Decay
        _audioParam.exponentialRampToValueAtTime(_maxValue*s*d/_duration, _startTime+_duration)
        // Release
        _audioParam.exponentialRampToValueAtTime(_minValue, _startTime+_duration+r) 

    }
    // Case 3: normal case
    else {
        // Attack
        _audioParam.setValueAtTime(_minValue, _startTime)
        _audioParam.exponentialRampToValueAtTime(_maxValue, _startTime+a)
        // Decay
        _audioParam.exponentialRampToValueAtTime(_maxValue*s, _startTime+a+d)
        // Sustain
        _audioParam.setValueAtTime(_maxValue*s, _startTime+_duration)
        // Release
        _audioParam.exponentialRampToValueAtTime(_minValue, _startTime+_duration+r)         
    }
}
///////////////////////////
// Create an audio context
///////////////////////////
mge._audio._create = function () {

    // Properties
    this._audioContext = ''
    this._audioGain = ''
    this._volume = 1

    // Create the audio context, a gain node and connect it to speakers
    this._audioContext = new (window.AudioContext||window.webkitAudioContext)()
    this._audioGain = this._audioContext.createGain()
    this._audioGain.connect(this._audioContext.destination)

}
///////////////////////////
// Plays a sound given
///////////////////////////
mge._audio._playSound = function (_synthConfig,_outputNode,_frequency,_startTime,_duration,_volume) {

    // Shortcuts
    let _applyADSR = this._applyADSR
    let _context = this._audioContext

    // Parameters
    let _oscType = _synthConfig.oscType || 'sine'
    let _filterType = _synthConfig.filterType || 'lowpass'
    let _volumeADSR = _synthConfig.volumeADSR || {a:0, d:0, s:1, r:0, minValue:1, maxValue: 1}
    let _pitchADSR = _synthConfig.pitchADSR || {a:0, d:0, s:1, r:0, minValue:_frequency, maxValue: _frequency}
    let _detuneADSR = _synthConfig.detuneADSR || {a:0, d:0, s:1, r:0, minValue:0, maxValue: 0}
    let _filterFreqADSR = _synthConfig.filterFreqADSR || {a:0, d:0, s:1, r:0, minValue:20000, maxValue: 20000}
    let _filterQADSR = _synthConfig.filterQADSR || {a:0, d:0, s:1, r:0, minValue:1, maxValue: 1}

    // Osc
    let _osc = ''
    if (_oscType == 'noise') {
        _osc = _context.createBufferSource()
        let buffer = _context.createBuffer(1, _context.sampleRate * (_duration+_volumeADSR.r), _context.sampleRate)
        let noiseOutput = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
            noiseOutput[i] = Math.random() * 2 - 1
        }
        osc.buffer = buffer
    } else {
        _osc = _context.createOscillator()
        _osc.type = _oscType
        _applyADSR(_pitchADSR, _osc.frequency, _startTime, _duration)
        _applyADSR(_detuneADSR, _osc.detune, _startTime, _duration)
    }
    _osc.start(_startTime)
    _osc.stop(_startTime+_duration+_volumeADSR.r)

    // Gain ADSR
    let _oscGainADSR = _context.createGain()
    _applyADSR(_volumeADSR, _oscGainADSR.gain, _startTime, _duration)

    // Volume
    let _oscVolume = _context.createGain()
    _oscVolume.gain.setValueAtTime(mge._audio._volumeToGain(_volume) * 0.04, _startTime)

    // Filter
    let _filter = _context.createBiquadFilter()
    _filter.type = _filterType
    _applyADSR(_filterFreqADSR, _filter.frequency, _startTime, _duration)
    _applyADSR(_filterQADSR, _filter.Q, _startTime, _duration)

    // Connections
    _osc.connect(_filter)
    _filter.connect(_oscGainADSR)
    _oscGainADSR.connect(_oscVolume)
    _oscVolume.connect(_outputNode)
}
///////////////////////////
// Set the general volume
// of the game
///////////////////////////
mge._audio._setVolume = function (_volume) {

    // Update  mge._audio._volume 
    if (_volume <= 0) {
        mge._audio._volume = 0
    } 
    else if (_volume >= 1) {
        mge._audio._volume = 1
    } 
    else {
        mge._audio._volume = _volume
    }

    // Change gain value
    mge._audio._audioGain.gain.setValueAtTime(mge._audio._volumeToGain(mge._audio._volume), mge.audio.currentAudioTime)
}





///////////////////////////
// Convert a volume to
// a gain
///////////////////////////
mge._audio._volumeToGain = function (_volume) {

    // DB reduction max
    let _maxDBReduction = 30

    // Return the gain
    if (_volume <= 0) {
        return 0
    } else if (_volume >= 1) {
        return 1
    } else {
        return Math.pow(10,(_volume - 1) * _maxDBReduction / 10)
    }
}


///////////////////////////
// Create a canvas
///////////////////////////
mge._canvas._create = function(_width,_height,_id) {

    // Properties
    this._renderCanvas = ''
    this._renderContext = ''

    // Define html element for the canvas
    this._renderCanvas = document.getElementById(_id)

    // Remove html canvas if already exists
    if (this._renderCanvas) {
        this._renderCanvas.remove()
    } 

    // Create new html canvas
    this._renderCanvas = document.createElement('canvas')
    this._renderCanvas.id = _id
    this._renderCanvas.width = _width
    this._renderCanvas.height = _height
    document.body.appendChild(this._renderCanvas)

    // Get context
    this._renderContext = this._renderCanvas.getContext('2d')

}

///////////////////////////
// Resize the canvas html
// component in order
// to fill the screen
///////////////////////////
mge._canvas._fitToScreen = function() {

    // Shortcuts
    let _HtmlCanvas = this._renderCanvas

    // Get scale ratio
    let _scaleX = (window.innerWidth - 10) / _HtmlCanvas.width
    let _scaleY = (window.innerHeight - 10) / _HtmlCanvas.height
    let _scale = Math.min(_scaleX, _scaleY)

    // Modify the canvas style
    _HtmlCanvas.style.transformOrigin = '0 0'
    _HtmlCanvas.style.transform = 'scale(' + _scale + ')'
    _HtmlCanvas.display = 'block'
}
///////////////////////////
// Create the game
///////////////////////////
mge._game._create = function (_width, _height) {

    // Properties
    this._curScene = ''
    this._nextScene = ''
    this._spritesList = []

    // Dependencies
    let _canvas = mge._canvas
    let _audio = mge._audio
    let _loop = mge._loop
    let _mouse = mge._mouse
    let _keyboard = mge._keyboard
    let _sequencer = mge._sequencer

    // Create main canvas to render the game
    _canvas._create(_width,_height,'GAME_RENDER_CANVAS')

    // Create mouse
    _mouse._create(_canvas._renderCanvas)

    // Create keyboard
//!    _keyboard._create()

    // Create the audio context
    _audio._create()

    // Create the audio sequencer
    _sequencer._create()

    // Create the game loop
    _loop._create()

}

mge._game._createSprite = function () {

    // Dependencies
    let _sprite = mge._sprite
    let _canvas = mge._canvas
    let _game = mge._game

    // Shortcuts
    let _renderContext = _canvas._renderContext

    // Create the sprite
    let _newSprite = Object.create(_sprite)
    _newSprite._create(_renderContext)

    // Add it to the list of game sprites
    _game._spritesList.push(_newSprite)

    // And return the sprite 
    return _newSprite
}
///////////////////////////
// Get the number of clones
// in the game
///////////////////////////

mge._game._getClonesNb = function () {
    
    // Initialize the number of clones to 0
    let _clonesNb = 0

    // For each sprite, count the number of clones and sum it
    this._spritesList.forEach(_sprite => {
        _clonesNb += _sprite._clonesList.length
    })

    // Return the result
    return _clonesNb

}
///////////////////////////
// Change the scene
///////////////////////////

mge._game._sceneChange = function (_scene) {

    // Create empty start function if not exists
    if (!_scene.start) {
        _scene.start = function () {}
    }

    // Create update start function if not exists
    if (!_scene.update) {
        _scene.update = function () {}
    }

    // Create draw start function if not exists
    if (!_scene.draw) {
        _scene.draw = function () {}
    }

    // Defin this scene as the next scene to run 
    this._nextScene = _scene

}

///////////////////////////
// Start the game
///////////////////////////

mge._game._start = function (_scene) {

    // Dependencies
    let _loop = mge._loop

    // Change scene and start the game loop
    this._sceneChange(_scene)
    _loop._start()

}


///////////////////////////
// Check if a key is pressed
///////////////////////////
//!mge._keyboard._isKeyPressed = function(_key) {

//!    if (this._keyPressed.indexOf(_key) == -1) {
//!        return false
//!    } else {
//!        return true
//!    }
//!}
///////////////////////////
// Event handler onkeydown
///////////////////////////
//!mge._keyboard._onKeyDown = function(e) {

    // Shortcuts
//!    let _key = e.key

    // Add _keyPressedDetected array 
//!    if (this._keyPressedDetected.indexOf(_key) == -1) {
//!        this._keyPressedDetected.push(_key)
//!    }

//!}
///////////////////////////
// Event handler onkeyup
///////////////////////////
//!mge._keyboard._onKeyUp = function(e) {

    // Shortcuts
//!    let _key = e.key

    // Remove fom _keyPressedDetected array 
//!    let indexOfKey = this._keyPressedDetected.indexOf(_key)
//!    if (indexOfKey != -1) {
//!        this._keyPressedDetected.splice(indexOfKey,1)
//!    }
//!}
///////////////////////////
// Reset keyboard information
///////////////////////////
//!mge._keyboard._reset = function() {
//!    this._keyPressed = []
//!    this._keyPressedDetected = []
//!}
///////////////////////////
// Update keyboard properties
///////////////////////////
//!mge._keyboard._update = function() {

    // Set list of pressed keys
//!    this._keyPressed = this._keyPressedDetected.slice()

//!}
 ///////////////////////////
// Create the keayboard
///////////////////////////
//!mge._keyboard._create = function() {

    // Properties
//!    this._keyPressed = []
//!    this._keyPressedDetected = []

    // Create listeners
//!    document.onkeydown = function(e) {
//!        mge._keyboard._onKeyDown(e)
//!    }

//!    document.onkeyup = function(e) {
//!        mge._keyboard._onKeyUp(e)
//!    }

//!}
///////////////////////////
// Create the loop
///////////////////////////
mge._loop._create = function() {

    // Properties
    this._lastTick = 0
    this._currentTick = 0
    this._elapsedTick = 0
    this._fps = 0
    this._status = 'stopped'

}

///////////////////////////
// Start game loop
///////////////////////////
mge._loop._start = function() {
    this._status = 'running'
    this._tick()
}

///////////////////////////
// Stop game loop
///////////////////////////
mge._loop._stop = function() {
    this._status = 'stopped'
    this._tick()
}

///////////////////////////
// Loop tick
///////////////////////////

mge._loop._tick = function () {

    // Dependencies
    let _canvas = mge._canvas
    let _game = mge._game
    let _mouse = mge._mouse
//!    let _keyboard = mge._keyboard
    let _sequencer = mge._sequencer

    // Shortcuts
    let _renderContext = _canvas._renderContext
    let _renderCanvas = _canvas._renderCanvas
    let _loop = mge._loop
    let _spritesList = _game._spritesList

    // Update tick metrics
    _loop._currentTick = performance.now()
    _loop._elapsedTick = _loop._currentTick - _loop._lastTick
    _loop._fps = 1 / (_loop._elapsedTick / 1000)

    // Get mouse & keyboard information
    _mouse._update() 
//!    _keyboard._update() 

    // Check if the scene must change
    if (_game._curScene != _game._nextScene) {
        // Update curScene, reset controls and launch the start function of the new scene
        _game._curScene = _game._nextScene
        _mouse._reset()
//!        _keyboard._reset()
        _game._curScene.start()
    }

    // Call update function
    _game._curScene.update()

    // Clean the clone list of each sprite
    _spritesList.forEach(_sprite => {
        _sprite._cloneCleanList()
    })

    // Clear screen
    _renderContext.clearRect(0,0,_renderCanvas.width,_renderCanvas.height)

    // Call draw function
    _game._curScene.draw()

    // Scale the game render canvas in order to fit window size
    _canvas._fitToScreen()

    // Call audio sequencer
    _sequencer._play()
    
    // Update tick timestamp
    _loop._lastTick = _loop._currentTick

    // Loop if status is running
    if (_loop._status == 'running') {
        requestAnimationFrame(_loop._tick)
    }
}

///////////////////////////
// Event handler onmouseclick
///////////////////////////
mge._mouse._onClick = function(e) {
    this._clickDetected = true
    this._xDetected = e.offsetX
    this._yDetected = e.offsetY
}
///////////////////////////
// Event handler onmousemouve
///////////////////////////
mge._mouse._onMove = function(e) {
    this._xDetected = e.offsetX
    this._yDetected = e.offsetY
}
///////////////////////////
// Event handler onmouseout
///////////////////////////
mge._mouse._onOut = function(e) {
    this._xDetected = ''
    this._yDetected = ''
}
///////////////////////////
// Reset mouse information
///////////////////////////
mge._mouse._reset = function() {
    this._x = 0
    this._y = 0
    this._isClicked = false
    this._xDetected = 0
    this._yDetected = 0
    this._clickDetected = false
}
///////////////////////////
// Update mouse properties
///////////////////////////
mge._mouse._update = function() {

    // Set the new mouse coordinates
    this._x = this._xDetected
    this._y = this._yDetected

    // Take into account click
    this._isClicked = this._clickDetected
    this._clickDetected = false

}
///////////////////////////
// Create the mouse
///////////////////////////
mge._mouse._create = function(_HtmlCanvas) {

    // Properties
    this._x = 0
    this._y = 0
    this._isClicked = false
    this._xDetected = 0
    this._yDetected = 0
    this._clickDetected = false

    // Create listeners
    _HtmlCanvas.onclick = function(e) {
        mge._mouse._onClick(e)
    }

    _HtmlCanvas.onmousemove = function(e) {
        mge._mouse._onMove(e)
    }
    
    _HtmlCanvas.onmouseout = function(e) {
        mge._mouse._onOut(e)
    }

}
///////////////////////////
// Create the sprite
///////////////////////////
mge._sprite._create = function(_ctx) {

    // Properties
    this._ctx = _ctx
    this._drawFunction = function () {}
    this._width = 100
    this._height = 100
    this._x = 0
    this._y = 0
    this._scaleX = 1
    this._scaleY = 1
    this._isVisible = true
    this._drawBoundaries = false

    // Clone properties
    this._clonesList = []
    this._cloneIsValid = false


}
///////////////////////////
// Draw the sprite
///////////////////////////
mge._sprite._draw = function() {

    // Draw only if sprite is visible
    if (this._isVisible) {

        // Shortcuts
        let _ctx = this._ctx

        // Save context
        _ctx.save()

        // Apply transformations
        _ctx.translate(this._x - this._width * this._scaleX / 2, this._y - this._height * this._scaleY / 2)
        _ctx.scale(this._scaleX, this._scaleY)

        // Draw
        this._drawFunction(_ctx)   

        // Draw boundaries if needed
        if (this._drawBoundaries) {
            _ctx.strokeStyle = 'red'
            _ctx.strokeRect(0, 0, this._width, this._height)
            _ctx.strokeRect(this._width / 2, this._height / 2, 1, 1)
        }

        // Restore context
        _ctx.restore()
    }
}
///////////////////////////
// Check if the sprite is
// touched and if there is
// a click
///////////////////////////
mge._sprite._isClicked = function(_xTouched, _yTouched, _click) {

    if (this._isTouched(_xTouched, _yTouched) && _click) {
        return true
    } else {
        return false
    }
}
///////////////////////////
// Check if the sprite is
// colliding with another
// sprite.
// The collision detection
// is based on width and
// height (box collision)
///////////////////////////
//!mge._sprite._isColliding = function(_spriteToCheck) {

    // Calculate min distance between sprites without collision
//!    let _minXDistance = (this._width / 2) * this._scaleX + (_spriteToCheck._width / 2) * _spriteToCheck._scaleX
//!    let _minYDistance = (this._height / 2) * this._scaleY + (_spriteToCheck._height / 2) * _spriteToCheck._scaleY

    // Calculate real distance between the 2 sprites
//!    let _realXDistance = Math.abs(this._x - _spriteToCheck._x)
//!    let _realYDistance = Math.abs(this._y - _spriteToCheck._y)
    
    // Check collision
//!   if (_realXDistance < _minXDistance && _realYDistance < _minYDistance) {
//!        return true
//!    } else {
//!        return false
//!    }
//!}
///////////////////////////
// Check if the sprite is
// touch for given x and y
///////////////////////////
mge._sprite._isTouched = function(_xTouched, _yTouched) {

    // Calculate sprite min and max coordinates
    // based in its width and height
    let _xMaxSprite = this._x + (this._width / 2) * this._scaleX
    let _xMinSprite = this._x - (this._width / 2) * this._scaleX
    let _yMaxSprite = this._y + (this._height / 2) * this._scaleY
    let _yMinSprite = this._y - (this._height / 2) * this._scaleY

    // Check if inside
    if (_xTouched >= _xMinSprite && _xTouched <= _xMaxSprite && _yTouched >= _yMinSprite && _yTouched <= _yMaxSprite) {
        return true
    } else {
        return false
    }
}
///////////////////////////
// Clean the list of clones
// (deletes items for which
// _cloneIsValid is false)
///////////////////////////
mge._sprite._cloneCleanList = function() {

    // Create an empty cleaned list
    let _cleanedList = []

    // Put in the clean list all the clones that are valid
    this._clonesList.forEach(_clone => {
        if (_clone._cloneIsValid) {
            _cleanedList.push(_clone)
        }
    })

    // Put the result in the clone list
    this._clonesList = _cleanedList

}

///////////////////////////
// Create a clone of 
// the sprite
///////////////////////////
mge._sprite._cloneCreate = function() {

    // Create the clone
    let _clone = Object.create(this)
    _clone._cloneIsValid = true

    // Put it in the list of clones
    this._clonesList.push(_clone)

    // Return the clone
    return _clone

}
///////////////////////////
// Delete a clone of 
// the sprite
///////////////////////////
mge._sprite._cloneDelete = function() {

    // Delete the clone
    this._cloneIsValid = false

}
///////////////////////////
// Delete all the clones
///////////////////////////
mge._sprite._cloneDeleteAll = function() {

    // Empty the clones list
    this._clonesList = []

}

///////////////////////////
// Execute a method for
// each clone
///////////////////////////
mge._sprite._cloneExecuteForEach = function(_method) {

    // Execute the method for eah clone
    this._clonesList.forEach(_clone => {
        _clone[_method]()
    })

}

///////////////////////////
// Check if the sprite is
// collinding with clones
// of another srpite.
// Returns the list of
// clones colliding with
// him
///////////////////////////
//!mge._sprite._listCollisionsWithClones = function(_spriteToCheck) {

    // Create an empty array to store the touched clones
//!    let _touchedClones = []

    // Add in this array the clones that are touched
//!    _spriteToCheck._clonesList.forEach(_clone => {
//!        if (this._isColliding(_clone)) {
//!            _touchedClones.push(_clone)
//!        }
//!    })

    // Return the list of clones touhced by the sprite
//!    return _touchedClones
//!}
///////////////////////////
// Create the sequencer
///////////////////////////
mge._sequencer._create = function() {

    // Properties
    this._tracks = []
    this._bpm = 60
    this._nextBarNum = 1
    this._nextBarStartTime = 0
    this._nextBarTriggerTime = 0
    this._status = 'stopped'

}


///////////////////////////
// Get the frequency in Hz
// of a given note on a given
// octave.
// Example E2
///////////////////////////
mge._sequencer._noteToFrequency = function(_noteToEvaluate) {
    // List of basic frequence octave 0
    let _notesFrequence = {C:32.7,Db:34.6,D:36.7,Eb:38.9,E:41.2,F:43.6,Gb:46.2,G:49,Ab:51.9,A:55,Bb:58.3,B:61.7}
    // Get the note and the octave
    let _octave = parseInt(_noteToEvaluate.substr(_noteToEvaluate.length-1,_noteToEvaluate.length),10)
    let _note = _noteToEvaluate.substr(0,_noteToEvaluate.length-1)
    // Calculate the frequency
    let _frequency = _notesFrequence[_note] * Math.pow(2,_octave)
    return Math.round(_frequency)
}
///////////////////////////
// Create a track with
// - a list of bars
// - an instrument with a "play" function
// - the volume of the track
///////////////////////////
mge._sequencer._createTrack = function(_bars, _instrument, _volume) {
        
    // Dependencies
    let _track = mge._sequencer._track
    let _tracks = mge._sequencer._tracks
    
    // Create the track object
    let _newTrack = Object.create(_track)
    _newTrack._bars = _bars
    _newTrack._instrument = _instrument
    _newTrack._volume = _volume

    // Add it to the list of sequencer tracks
    _tracks.push(_newTrack)

    // And return the track 
    return _newTrack

}
///////////////////////////
// Play a bar of a track
///////////////////////////
mge._sequencer._playTrackBar = function(_track, _barNum) {

    // Get instrument information
    let _instrument = _track._instrument
    let _volume = _track._volume

    // Get the bar to be played
    let _bar = _track._getBar(_barNum)

    // Initialze current time 
    let _curTime = this._nextBarStartTime

    // Play each note
    for (let i=0; i < _bar.length; i+=2) {

        // Get note and duration
        let _note = _bar[i]
        let _noteFrequency = this._noteToFrequency(_note)
        let _duration = _bar[i+1] * 60 / this._bpm

        // Play the note
        _instrument.play(_noteFrequency, _curTime, _duration, _volume)

        // Update current time
        _curTime += _duration

    }
    
}


///////////////////////////
// Schedule playing next bar
// for all the tracks
///////////////////////////
mge._sequencer._play = function() {

    // Alias
    let _currentAudioTime = mge._audio._audioContext.currentTime

    // Play the bar only if is time to schedule it and if sequencer is started
    if (_currentAudioTime >= this._nextBarTriggerTime && this._status == 'started') {

        // Play all trakcs
        for (let i=0; i < this._tracks.length; i++) {
            // Get track and play it
            let _track = this._tracks[i]
            this._playTrackBar(_track, this._nextBarNum)
        }

        // Update sequencer information
        this._nextBarNum += 1
        this._nextBarTriggerTime = this._nextBarStartTime + 3 * 60 / this._bpm
        this._nextBarStartTime += 4 * 60 / this._bpm

    }

}


///////////////////////////
// Start the sequencer
///////////////////////////
mge._sequencer._start = function() {
    
    this._nextBarNum = 1
    this._nextBarStartTime = mge._audio._audioContext.currentTime
    this._nextBarTriggerTime = 0
    this._status = 'started'

}
///////////////////////////
// Stop the sequencer
///////////////////////////
mge._sequencer._stop = function() {
    
    this._status = 'stopped'

}
///////////////////////////
// Track object
///////////////////////////
mge._sequencer._track = {
    _bars: [],
    _instrument: {},
    _volume: 1,
    _setVolume: function(_volume) {
        // Change the volume of the track
        if (_volume <= 0) {
            this._volume = 0
        } 
        else if (_volume >= 1) {
            this._volume = 1
        } 
        else {
            this._volume = _volume
        }
    },
    _getBar: function (_numBar) {
        // Get the content of a given bar
        let _nbBars = this._bars.length
        if (_nbBars == 0) {
          return ''
        }
        else if (_numBar%_nbBars == 0) {
          return this._bars[_nbBars-1]
        }
        else {
          return this._bars[_numBar%_nbBars-1]
        }
      }
}


///////////////////////////
// Game object creation
///////////////////////////
mge._game._create(640,360)