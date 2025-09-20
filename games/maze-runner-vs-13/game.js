let CELLSIZE = 32;
let GameDimR = 10;
let GameDimC = 10;
const MAZESIZE = 50;
const SOUNDVOLUME = 0.15;
const floor = Math.floor;
var songBgm = {songData: [{ i: [0, 0, 140, 0, 0, 0, 140, 0, 0, 255, 158, 158, 158, 0, 0, 0, 0, 51, 2, 1, 2, 58, 239, 0, 32, 88, 1, 157, 2 ],p: [1,1,1,1],c: [{n: [161,,,,,,,,,,,,,,,,163,,,,,,,,159],f: []}]},{ i: [0, 91, 128, 0, 0, 95, 128, 12, 0, 0, 12, 0, 72, 0, 0, 0, 0, 0, 0, 0, 2, 255, 0, 0, 32, 83, 3, 130, 4 ],p: [1,1,2,1],c: [{n: [144,,151,,149,,147,,146,,147,,146,,144,,144,,151,,149,,147,,146,,147,,146,,144],f: []},{n: [156,,163,,161,,159,,158,,159,,158,,156,,156,,163,,161,,159,,158,,159,,158,,168],f: []}]},{ i: [0, 16, 133, 0, 0, 28, 126, 12, 0, 0, 2, 0, 60, 0, 0, 0, 0, 0, 0, 0, 2, 91, 0, 0, 32, 47, 3, 157, 2 ],p: [1,2,1,2],c: [{n: [144,,151,,149,,147,,146,,147,,146,,144,,144,,151,,149,,147,,146,,147,,146,,144],f: []},{n: [168,,175,,173,,171,,170,,171,,170,,168,,168,,175,,173,,171,,170,,171,,170,,168],f: []}]},{ i: [0, 255, 116, 79, 0, 255, 116, 0, 83, 0, 4, 6, 69, 52, 0, 0, 0, 0, 0, 0, 2, 14, 0, 0, 32, 0, 0, 0, 0 ],p: [1,1,1,1],c: [{n: [144,,151,,149,,147,,146,,147,,146,,144,,144,,151,,149,,147,,146,,147,,146,,144,,,159,,,,159,,,,159,,,,,,,,,,,,159,,159],f: []}]},],rowLen: 8269,   patternLen: 32,  endPattern: 3,  numChannels: 4  };
// var songBgm2 = {songData: [{ i: [2, 100, 128, 0, 3, 201, 128, 0, 0, 0, 5, 6, 58, 0, 0, 0, 0, 195, 6, 1, 2, 135, 0, 0, 32, 147, 6, 121, 6 ],p: [2,2],c: [{n: [155,,160,,155,,160,,162,,160,,162,,163,,162,,160,,158,,155,,160,,155,,160,,155,,160,,158,,157,,155,,,,160,,,,160,,,,,,,,,,,,,,,,,,160,,,,160],f: []},{n: [157,,162,,157,,162,,164,,162,,164,,165,,164,,162,,160,,157,,162,,157,,162,,157,,162,,160,,159,,157,,,,162,,,,162,,,,,,,,,,,,,,,,,,162,,,,162],f: []}]},{ i: [0, 214, 104, 64, 0, 204, 104, 0, 64, 229, 4, 40, 43, 51, 0, 0, 0, 231, 6, 1, 3, 183, 15, 0, 32, 232, 4, 74, 6 ],p: [2,1],c: [{n: [144,,,,,,,,,,,,146,146,,,,,,,135,,,,135,135,,,,,,,135],f: []},{n: [157,,162,,157,,162,,,,,,,,,,,,,,,,,,162,,157,,162,,,,,,,,,,,,,,,,,,162],f: []}]},{ i: [0, 255, 106, 64, 0, 255, 106, 0, 64, 0, 5, 7, 164, 0, 0, 0, 0, 0, 0, 0, 2, 255, 0, 2, 32, 83, 5, 25, 1 ],p: [2,1],c: [{n: [143,,,,,,,,,,,,,,,,,,,,,,143],f: []},{n: [135,,,,,,,,135,,,,,,,,135,,,,,,,,135,,,,,,,,135],f: []}]},{ i: [0, 214, 104, 64, 0, 204, 104, 0, 64, 229, 4, 40, 43, 51, 0, 0, 0, 231, 6, 1, 3, 183, 15, 0, 32, 232, 4, 74, 6 ],p: [1,1],c: [{n: [,,,,,,,,176,,174,,176,,177,,176,,174,,172,,169,,,,,,,,169,,174,,172,,171,,169],f: []}]},{ i: [1, 255, 128, 0, 1, 154, 128, 9, 0, 0, 7, 5, 52, 0, 0, 0, 0, 0, 0, 0, 2, 255, 0, 0, 32, 47, 3, 146, 2 ],p: [2,2],c: [{n: [,,,,,,,,170,,,,,,,,166,,164,,,,,,,,,,170,,,,166,,164,,163],f: []},{n: [,,162,,,,162,,,,,,,,165,,,,,,,,,,162,,,,162,,,,162,,,,159,,,,,,162,,,,162,,,,,,,,,,,,,,,,,,162,,,,162],f: []}]},],rowLen: 5513,   patternLen: 40,  endPattern: 1,  numChannels: 5  };
class CPlayer {
    constructor() {
        this.mOscillators = [
            this.osc_sin,
            this.osc_square,
            this.osc_saw,
            this.osc_tri
        ];
        this.mSong = null;
        this.mLastRow = 0;
        this.mCurrentCol = 0;
        this.mNumWords = 0;
        this.mMixBuf = null;
    }
    osc_sin(value) {
        return Math.sin(value * 6.283184);
    }
    osc_saw(value) {
        return 2 * (value % 1) - 1;
    }
    osc_square(value) {
        return (value % 1) < 0.5 ? 1 : -1;
    }
    osc_tri(value) {
        const v2 = (value % 1) * 4;
        if (v2 < 2) return v2 - 1;
        return 3 - v2;
    }
    getnotefreq(n) {
        return 0.003959503758 * (2 ** ((n - 128) / 12));
    }
    createNote(instr, n, rowLen) {
        const osc1 = this.mOscillators[instr.i[0]];
        const o1vol = instr.i[1];
        const o1xenv = instr.i[3] / 32;
        const osc2 = this.mOscillators[instr.i[4]];
        const o2vol = instr.i[5];
        const o2xenv = instr.i[8] / 32;
        const noiseVol = instr.i[9];
        const attack = instr.i[10] * instr.i[10] * 4;
        const sustain = instr.i[11] * instr.i[11] * 4;
        const release = instr.i[12] * instr.i[12] * 4;
        const releaseInv = 1 / release;
        const expDecay = -instr.i[13] / 16;
        let arp = instr.i[14];
        const arpInterval = rowLen * (2 ** (2 - instr.i[15]));
        const noteBuf = new Int32Array(attack + sustain + release);
        let c1 = 0, c2 = 0;
        let o1t = 0;
        let o2t = 0;
        for (let j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;
                o1t = this.getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = this.getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }
            let e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e = (j - attack - sustain) * releaseInv;
                e = (1 - e) * (3 ** (expDecay * e));
            }
            c1 += o1t * e ** o1xenv;
            let rsample = osc1(c1) * o1vol;
            c2 += o2t * e ** o2xenv;
            rsample += osc2(c2) * o2vol;
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }
            noteBuf[j] = (80 * rsample * e) | 0;
        }
        return noteBuf;
    }
    initGenBuffer(song,context,callback){
        this.init(song);
        var loop = ()=>{
            var done = this.generate();
            if(done == 1){
                var buffer = this.createAudioBuffer(context);
                return callback(buffer);
            }
            else{
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);
    }
    init(song) {
        this.mSong = song;
        this.mLastRow = song.endPattern;
        this.mCurrentCol = 0;
        this.mNumWords = song.rowLen * song.patternLen * (this.mLastRow + 1) * 2;
        this.mMixBuf = new Int32Array(this.mNumWords);
    }
    generate() {
        let i, j, b, p, row, col, n, cp, k, t, lfor, e, x, rsample, rowStartSample, f, da;
        const chnBuf = new Int32Array(this.mNumWords);
        const instr = this.mSong.songData[this.mCurrentCol];
        const rowLen = this.mSong.rowLen;
        const patternLen = this.mSong.patternLen;
        let low = 0, band = 0, high;
        let lsample, filterActive = false;
        const noteCache = [];
        for (p = 0; p <= this.mLastRow; ++p) {
            cp = instr.p[p];
            for (row = 0; row < patternLen; ++row) {
                const cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;
                    if (cmdNo < 17) {
                        noteCache.length = 0;
                    }
                }
                const oscLFO = this.mOscillators[instr.i[16]];
                const lfoAmt = instr.i[17] / 512;
                const lfoFreq = (2 ** (instr.i[18] - 9)) / rowLen;
                const fxLFO = instr.i[19];
                const fxFilter = instr.i[20];
                const fxFreq = instr.i[21] * 43.23529 * 3.141592 / 44100;
                const q = 1 - instr.i[22] / 255;
                const dist = instr.i[23] * 1e-5;
                const drive = instr.i[24] / 32;
                const panAmt = instr.i[25] / 512;
                const panFreq = 6.283184 * (2 ** (instr.i[26] - 9)) / rowLen;
                const dlyAmt = instr.i[27] / 255;
                const dly = instr.i[28] * rowLen & ~1;  
                rowStartSample = (p * patternLen + row) * rowLen;
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = this.createNote(instr, n, rowLen);
                        }
                        const noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }
                for (j = 0; j < rowLen; j++) {
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];
                    if (rsample || filterActive) {
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? this.osc_sin(rsample * .25) : -1 : 1;
                            rsample /= dist;
                        }
                        rsample *= drive;
                        filterActive = rsample * rsample > 1e-5;
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }
                    if (k >= dly) {
                        lsample += chnBuf[k - dly + 1] * dlyAmt;
                        rsample += chnBuf[k - dly] * dlyAmt;
                    }
                    chnBuf[k] = lsample | 0;
                    chnBuf[k + 1] = rsample | 0;
                    this.mMixBuf[k] += lsample | 0;
                    this.mMixBuf[k + 1] += rsample | 0;
                }
            }
        }
        this.mCurrentCol++;
        return this.mCurrentCol / this.mSong.numChannels;
    }
    createAudioBuffer(context) {
        const buffer = context.createBuffer(2, this.mNumWords / 2, 44100);
        for (let i = 0; i < 2; i++) {
            const data = buffer.getChannelData(i);
            for (let j = i; j < this.mNumWords; j += 2) {
                data[j >> 1] = this.mMixBuf[j] / 65536;
            }
        }
        return buffer;
    }
    createWave() {
        const headerLen = 44;
        const l1 = headerLen + this.mNumWords * 2 - 8;
        const l2 = l1 - 36;
        const wave = new Uint8Array(headerLen + this.mNumWords * 2);
        wave.set([
            82, 73, 70, 70, 
            l1 & 255, (l1 >> 8) & 255, (l1 >> 16) & 255, (l1 >> 24) & 255,
            87, 65, 86, 69, 
            102, 109, 116, 32, 
            16, 0, 0, 0, 
            1, 0, 
            2, 0, 
            68, 172, 0, 0, 
            16, 177, 2, 0, 
            4, 0, 
            16, 0, 
            100, 97, 116, 97, 
            l2 & 255, (l2 >> 8) & 255, (l2 >> 16) & 255, (l2 >> 24) & 255
        ]);
        for (let i = 0, idx = headerLen; i < this.mNumWords; ++i) {
            let y = this.mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }
        return wave;
    }
    getData(t, n) {
        const i = 2 * Math.floor(t * 44100);
        const d = new Array(n);
        for (let j = 0; j < 2 * n; j += 1) {
            const k = i + j;
            d[j] = t > 0 && k < this.mMixBuf.length ? this.mMixBuf[k] / 32768 : 0;
        }
        return d;
    }
}
class SoundSystem{
    constructor(autostart = true){
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioContextSingleFire = new (window.AudioContext || window.webkitAudioContext)();
        this.buffer1 = this.generateShootingSound();
        this.buffer2 = this.generateExplosion();
        var cplayer = new CPlayer();
        var cplayer2 = new CPlayer();
        this.bgmTime = 0;
        this.pausedTime = 0;
        this.startTime = 0;
        cplayer.initGenBuffer(songBgm, this.audioContext,(buffer)=>{
            this.bgmBuffer = buffer;
            if(autostart) this.startBgm();
        });
        // cplayer2.initGenBuffer(songBgm2, this.audioContext,(buffer)=>{
        //     this.bgm2Buffer = buffer;
        // });
    }
    generateShootingSound() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.3; 
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            
            data[i] = (Math.random() - 0.5) * 2;
        }
        const attackTime = 0.01; 
        const decayTime = 0.1;  
        const sustainLevel = 0.2; 
        const releaseTime = duration - attackTime - decayTime; 
        for (let i = 0; i < data.length; i++) {
            let time = i / sampleRate;
            if (time < attackTime) {
                data[i] *= time / attackTime; 
            } else if (time < attackTime + decayTime) {
                data[i] *= 1 - (time - attackTime) / decayTime * (1 - sustainLevel); 
            } else if (time > duration - releaseTime) {
                data[i] *= (duration - time) / releaseTime; 
            }
        }
        for (let i = 0; i < data.length; i++) {
            let time = i / sampleRate;
            
            data[i] *= Math.sin(2 * Math.PI * time * (440 + Math.random() * 100)); 
        }
        return buffer;
    }
    generateSound() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.01; 
        const frequency = 10; 
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
        }
        return buffer;
    }
    generateExplosion() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.5; 
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1; 
        }
        const attackTime = 0.05; 
        const decayTime = 0.2; 
        const sustainLevel = 0.0; 
        const releaseTime = duration - attackTime - decayTime; 
        for (let i = 0; i < data.length; i++) {
            let time = i / sampleRate;
            if (time < attackTime) {
                data[i] *= time / attackTime; 
            } else if (time < attackTime + decayTime) {
                data[i] *= 1 - (time - attackTime) / decayTime * (1 - sustainLevel); 
            } else if (time > duration - releaseTime) {
                data[i] *= (duration - time) / releaseTime; 
            }
        }
        return buffer;
    }
    playS1(){
        const source = this.audioContextSingleFire.createBufferSource();
        source.buffer = this.buffer1;
        source.connect(this.audioContextSingleFire.destination);
        source.start();
    }
    playS2(){
        const source = this.audioContextSingleFire.createBufferSource();
        source.buffer = this.buffer2;
        source.connect(this.audioContextSingleFire.destination);
        source.start();
    }
    startBgm(id = 1){
        if(this.bgmsource){
            this.bgmsource.stop();
            this.bgmsource = null;
        }
        if(this.bgmBuffer){
            this.bgmsource = this.audioContext.createBufferSource();
            this.bgmsource.buffer = id==1 ? this.bgmBuffer : this.bgm2Buffer;
            this.bgmsource.connect(this.audioContext.destination);
            this.bgmsource.loop = true;
            this.bgmsource.start(0, this.pausedTime);
            this.startTime = this.audioContext.currentTime - this.pausedTime;
        }
    }
    stopBgm(id){
        if(this.bgmsource){
            this.pausedTime = this.audioContext.currentTime - this.startTime;
            this.bgmsource.stop();
            this.bgmsource = null;
        }
    }
}
class MazeGenerator {
    constructor(rows, cols, border = false) {
        this.rows = rows;
        this.cols = cols;
        this.grid = new Array(rows).fill(null).map(()=>new Array(cols).fill(true));
        this.generateMaze();

        for(var i = 0; i < this.rows; i++){
            this.grid[i][cols-1] = false;
        }
        var gridWithBorder = new Array(rows+2).fill(null).map(()=>new Array(cols+2).fill(true));
        for(var i = 0; i < this.rows; i++){
            for(var j = 0 ; j < this.cols;j++){
                gridWithBorder[i+1][j+1] = this.grid[i][j];
            }
        }
        this.gridWithBorder = gridWithBorder;
    }
    invertGrid(){
        var grid2 = new Array(this.rows).fill(null).map(()=>new Array(this.cols).fill(false));
        for(var i = 0; i < this.rows; i++){
            for(var j = 0 ; j < this.cols ; j++){
                grid2[i][j] = !this.grid[i][j];
            }
        }
        return grid2;
    }
    generateMaze() {this.clearMaze();this.carvePassage(0, 0);return this.grid;}
    clearMaze() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = true;
            }
        }
    }
    carvePassage(row, col) {
        this.grid[row][col] = false;
        const directions = this.shuffleDirections();
        for (const direction of directions) {
            const newRow = row + direction[0];
            const newCol = col + direction[1];
            if (this.isValidCell(newRow, newCol) && this.grid[newRow][newCol]) {
                const betweenRow = row + direction[0] / 2;
                const betweenCol = col + direction[1] / 2;
                this.grid[betweenRow][betweenCol] = false;
                this.carvePassage(newRow, newCol);
            }
        }
    }
    isValidCell(row, col) {return row >= 0 && row < this.rows && col >= 0 && col < this.cols;}
    shuffleDirections() {
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i],directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }
}
class Pathfinder {
    constructor(maze) {
        this.maze = maze;
        this.rows = maze.length;
        this.cols = maze[0].length;
    }
    findPath(startRow, startCol, endRow, endCol) {
        startRow = Math.floor(startRow);
        startCol = Math.floor(startCol);
        endRow = Math.floor(endRow);
        endCol = Math.floor(endCol);
        const openSet = [];
        const closedSet = new Set();
        const cameFrom = {};
        const gScore = new Array(this.rows).fill(null).map(()=>new Array(this.cols).fill(Infinity));
        gScore[startRow][startCol] = 0;
        const fScore = new Array(this.rows).fill(null).map(()=>new Array(this.cols).fill(Infinity));
        fScore[startRow][startCol] = this.heuristic(startRow, startCol, endRow, endCol);
        openSet.push([startRow, startCol]);
        while (openSet.length > 0) {
            const current = this.findLowestFScore(openSet, fScore);
            const [currentRow,currentCol] = current;
            if (currentRow === endRow && currentCol === endCol) {
                return this.reconstructPath(cameFrom, current);
            }
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(`${currentRow}-${currentCol}`);
            const neighbors = this.getNeighbors(currentRow, currentCol);
            for (const neighbor of neighbors) {
                const [neighborRow,neighborCol] = neighbor;
                if (closedSet.has(`${neighborRow}-${neighborCol}`) || this.maze[neighborRow][neighborCol]) {
                    continue;
                }
                const tentativeGScore = gScore[currentRow][currentCol] + 1;
                if (tentativeGScore < gScore[neighborRow][neighborCol]) {
                    cameFrom[`${neighborRow}-${neighborCol}`] = current;
                    gScore[neighborRow][neighborCol] = tentativeGScore;
                    fScore[neighborRow][neighborCol] = tentativeGScore + this.heuristic(neighborRow, neighborCol, endRow, endCol);
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        return null;
    }
    heuristic(row1, col1, row2, col2) {
        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }
    findLowestFScore(nodes, fScore) {
        let lowestNode = nodes[0];
        let lowestFScore = fScore[lowestNode[0]][lowestNode[1]];
        for (const node of nodes) {
            const [row,col] = node;
            if (fScore[row][col] < lowestFScore) {
                lowestNode = node;
                lowestFScore = fScore[row][col];
            }
        }
        return lowestNode;
    }
    getNeighbors(row, col) {
        const neighbors = [];
        if (row > 0)
            neighbors.push([row - 1, col]);
        if (row < this.rows - 1)
            neighbors.push([row + 1, col]);
        if (col > 0)
            neighbors.push([row, col - 1]);
        if (col < this.cols - 1)
            neighbors.push([row, col + 1]);
        return neighbors;
    }
    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.hasOwnProperty(`${current[0]}-${current[1]}`)) {
            current = cameFrom[`${current[0]}-${current[1]}`];
            path.unshift(current);
        }
        return path;
    }
}
class G{
    static makeCanvas(w=0,h=0){
        let c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.w=w;
        c.h=h;
        c.ctx = c.getContext('2d');
        c.center = {x: w/2,y:h/2}
        c.clear = ()=>{
            c.ctx.clearRect(0,0,w,h);
        }
        c.fill = (color)=>{
            c.ctx.fillStyle = color;
            c.ctx.fillRect(0,0,w,h);
        }
        c.fillPatern = (img)=>{
            const pattern = c.ctx.createPattern(img, "repeat");
            c.ctx.fillStyle = pattern;
            c.ctx.fillRect(0, 0, w, h);
        }
        return c;
    }
    static GenTable(rows,cols){
        var html = ``;
        for(let i = 0 ; i < rows ; i++){
            html += `<tr>`;
            for(let j = 0 ; j < cols;j++){
                html += `<td></td>`;
            }
            html += `</tr>`;
        }
        var table = document.createElement('table');
        table.innerHTML = html;
        var entities = [];
        var trs = table.querySelectorAll('tr');
        for(let i = 0 ; i < trs.length; i++){
            var tds = trs[i].querySelectorAll('td');
            tds.forEach(x=> x.html = (html)=>x.innerHTML=html);
            entities[i] = [...tds];
        }
        table.entities = entities;
        return table;
    }
    static Point(pos){
        return new Point(pos);
    }
    static getEmojiSprite(emoji,size,factor = 1.3, color = '#000', font = 'sans-serif'){
        let canvas = G.makeCanvas(size,size);
        var ctx = canvas.ctx;
        ctx.font = `${size/factor}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        ctx.fillText(emoji,size/2, size*1.1/2);
        return canvas;
    }
    static getTextSprite(text,size, color,  factor = 0.8, font = 'sans-serif'){
        text = text.toUpperCase();
        let canvas = G.makeCanvas(size * text.length, size);
        for(let i = 0 ; i < text.length;i++){
            var ls = G.getEmojiSprite(text[i],size,factor, color, font);
            canvas.ctx.drawImage(ls,i * size,0);
        }
        return canvas;
        
    }
    static fuseImage(canvas,canvas2,composite = 'source-atop'){
        let buffer = G.makeCanvas(canvas.width,canvas.height);
        let ctx = buffer.ctx;
        ctx.drawImage(canvas,0,0);
        ctx.globalCompositeOperation = composite;
        for(let i = 0 ; i < canvas.width/canvas2.width;i++){
            for(let j = 0 ; j < canvas.height/canvas2.height;j++){
                ctx.drawImage(canvas2,i * canvas2.width,j * canvas2.height);
            }
        }
        return buffer;
    }
    static rotateCanvas(_image,deg){
        var image = (deg % 90 != 0) ? G.prepForRotate(_image) : _image;
        var canvas = G.makeCanvas(image.width,image.height);
        var ctx = canvas.ctx;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(deg * Math.PI / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
        return canvas;
    }
    static prepForRotate(image){
        let d = Math.sqrt( Math.pow(image.width,2)+Math.pow(image.height,2));
        let buffer = G.makeCanvas(d,d);
        buffer.ctx.drawImage(image,(d - image.width) /2,(d - image.height) /2);
        return buffer;
    }
    static mirror(canvas,hor = true){
        let buffer = G.makeCanvas(canvas.width,canvas.height);
        let context = buffer.ctx;
        context.save();
        if(hor){
            context.scale(-1, 1);
            context.drawImage(canvas, 0, 0, canvas.width*-1, canvas.height);
        }
        else{
            context.scale(1, -1);
            context.drawImage(canvas, 0, 0, canvas.width, canvas.height*-1);
        }
        context.restore();
        return buffer;
    }
    static gridBG(color1 = "lightgrey",color2 = null, scale = 8, width=1){
        var canvas = G.makeCanvas(scale,scale);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,scale,scale);
        if(color2 == null){
            ctx.clearRect(0,0,scale-width,scale-width);
        }
        else{
            ctx.fillStyle = color2;
            ctx.fillRect(0,0,scale-width,scale-width);
        }
        return canvas;
    }
    static Lightify(canvas,opacity){
        let buffer = G.makeCanvas(canvas.width,canvas.height);
        buffer.ctx.globalAlpha = opacity;
        buffer.ctx.drawImage(canvas,0,0);
        buffer.ctx.globalAlpha = 1;
        return buffer;
    }
    static makeDom(html){
        var h = document.createElement('div');
        h.innerHTML = html;
        return h.firstChild;
    }
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]];}return array;
    }
    static repeatCanvas(canvas,r,c=0){
        if (c == 0) c = r;
        var buffer = G.makeCanvas(canvas.width * c, canvas.height * r);
        var pattern = buffer.ctx.createPattern(canvas, 'repeat');
        buffer.ctx.fillStyle = pattern;
        buffer.ctx.fillRect(0, 0, buffer.w, buffer.h);
        return buffer;
    }
    static merge(list,w,h){
        var c = G.makeCanvas(w,h);
        for(let i in list){
            c.ctx.drawImage(list[i],0,0);
        }
        return c;
    }
    static brickPattern(color1 = "#fff",color2 = "#000", r = 1){
        var canvas = G.makeCanvas(8,8);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color2;
        ctx.fillRect(7,0,1,4);
        ctx.fillRect(0,3,8,1);
        ctx.fillRect(4,4,1,4);
        ctx.fillRect(0,7,8,1);
        if(r > 1){return G.repeatCanvas(canvas,r,r);}
        return canvas;
    }
    static randomPattern(color1,color2,bias = 0.3,w=8,h=8){
        var canvas = G.makeCanvas(w,h);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color2;
        for(let i = 0 ; i < h ; i ++){
            for(let j = 0 ; j < w ; j++){
                if(Math.random() < bias) ctx.fillRect(i,j,1,1);
            }
        }
        return canvas;
    }
    static MakeCircle(r,stroke = null,fill = null){
        var s = G.makeCanvas(r*2+2,r*2+2);
        var ctx = s.ctx;
        ctx.beginPath();
        ctx.arc(s.width/2,s.height/2,r,0,Math.PI * 2,false);
        if(stroke != null){ctx.strokeStyle = stroke;ctx.stroke();}
        if(fill != null){ctx.fillStyle = fill;ctx.fill();}
        return s;
    }
    static movePointToward(pos,rotation,distance){
        const rRad = rotation * (Math.PI / 180);
        const vx = distance * Math.cos(rRad);
        const vy = distance * Math.sin(rRad);
        return {
            x : pos.x + vx,
            y : pos.y + vy
        }
    }
    static loadImage(url,callback){
        var img = new Image();
        img.src = url;
        img.addEventListener('load',()=>{
            callback(img);
        });
    }
    static getColor(r, g, b, a){
        if(r+g+b+a == 0){return null;}
        else if(r+g+b == 0){return '#000000';}
        else if (r > 255 || g > 255 || b > 255){return '#000000';}
        return '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
    }
    static getColorMatrix (canvas,changefct){
        var context = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        var imageData = context.getImageData(0, 0, width, height);
        var data = imageData.data;
        var colorMatrix = [];
        for (var i = 0; i < data.length; i += 4) {
            colorMatrix.push(
                G.getColor(
                    data[i],
                    data[i + 1],
                    data[i + 2],
                    data[i + 3]
                    )
                );
        }
        var matrix = [];
        for(let i = 0 ; i < canvas.height;i++){matrix[i] = [];}
        let c = 0, r = 0;
        for(let i = 0 ; i < colorMatrix.length;i++){
            if(c >= canvas.width){r++;c=0}
            matrix[r][c] = colorMatrix[i];
            if(changefct) matrix[r][c] = changefct(matrix[r][c]);
            c++;
        }
        return matrix;
    }
    static imgToCanvas(img){
        var c = G.makeCanvas(img.width,img.height);
        c.ctx.drawImage(img,0,0);
        return c;
    }
    static colorsMatrixToSprite(matrix,scale = 1,deform = null){
        let height = matrix.length;
        let width = Math.max(...matrix.map((row)=> row.length));
        var buffer = G.makeCanvas(width * scale,height* scale);
        var ctx = buffer.ctx;
        for(let i = 0 ; i < height;i++){
            for(let j = 0 ; j < width;j++){
                var color = matrix[i][j];
                if(deform) color = deform(color);
                if(!color || color == '') continue;
                ctx.fillStyle = color;
                ctx.fillRect(j*scale,i*scale,scale,scale);
            }
        }
        return buffer;
    }
    static crop(canvas,x,y,width,height){
        let buffer = G.makeCanvas(width,height);
        buffer.ctx.drawImage(canvas,x,y,width,height,0,0,width,height);
        return buffer;
    }
    static randomColor(){
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {color += letters[Math.floor(Math.random() * 16)];}
        return color; 
    }
    static cssrotateCanvasInY(canvas, degrees) {
        var buffer = G.makeCanvas(canvas.width,canvas.height);
        buffer.ctx.drawImage(canvas,0,0);
        buffer.style.transform = `rotateY(${degrees}deg)`;
        buffer.style.transformOrigin = 'center';
        buffer.style.transition = 'transform 0.5s';
        return buffer;
    }
    static zoomCanvasAlongX(canvas, zoomFactor) {
        // Create a new canvas to hold the transformed content
        const transformedCanvas = document.createElement('canvas');
        transformedCanvas.width = canvas.width;
        transformedCanvas.height = canvas.height;
        
        const ctx = transformedCanvas.getContext('2d');
        
        // Save the original state of the context
        ctx.save();
        
        // Move the origin to the center of the canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Scale along the X axis by the zoom factor (stretch or compress)
        ctx.scale(zoomFactor, 1);
        
        // Move back the origin to the top left
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        // Draw the original canvas content onto the transformed context
        ctx.drawImage(canvas, 0, 0);
        
        // Restore the context to its original state
        ctx.restore();
        
        return transformedCanvas;
    }
    static rotateCanvasInY(canvas, degrees) {
        const buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        const ctx = buffer.getContext('2d');
        
        const width = canvas.width;
        const height = canvas.height;
        
        // Calculate the rotation in radians
        const angle = degrees * Math.PI / 180;
        const perspective = 400; // Change to control depth illusion
        
        // Clear buffer canvas
        ctx.clearRect(0, 0, buffer.width, buffer.height);
        
        // Loop over canvas content to apply Y-axis rotation
        for (let x = 0; x < width; x++) {
            const offset = Math.cos(angle) * (x - width / 2);
            const scale = perspective / (perspective - offset);
            
            ctx.drawImage(
                canvas,        // Source canvas
                x, 0, 1, height, // Source position and size (1-pixel slice)
                (x - width / 2) * scale + width / 2, // X position with scaling
                0, width * scale, height // Destination size with scaling
            );
        }
        
        return buffer;
    }
    static rand (a=1, b=0){ return b + (a-b)*Math.random();}
    static randInt (a=1, b=0){ return G.rand(a,b)|0;}
}
class Point{
    constructor(pos){
        this.x = pos.x;
        this.y = pos.y;
    }
    moveToward(p2,dist=1){
        var vx = this.x == p2.x ? 0 : this.x < p2.x ? dist : -dist;
        var vy = this.y == p2.y ? 0 : this.y < p2.y ? dist : -dist;
        this.x += vx;
        this.y += vy;
    }
    distance(p2){
        let distance = 0;
        distance += Math.pow((this.x - p2.x), 2);
        distance += Math.pow((this.y - p2.y), 2);
        distance = Math.sqrt(distance);
        return distance;
    }
    getAngleTo(target){
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        
        let angleRadians = Math.atan2(dy, dx);
        return angleRadians * 180/Math.PI;
    }
    moveByAngle(rotation,distance){
        const rRad = rotation * (Math.PI / 180);
        const vx = distance * Math.cos(rRad);
        const vy = distance * Math.sin(rRad);
        this.x = this.x + vx;
        this.y = this.y + vy;
    }
}
class SpriteEngine{
    constructor(img){
        var imgCanvas = G.imgToCanvas(img);
        var mat = G.getColorMatrix(imgCanvas,(r)=>{
            if(r == '') return null;
            if(r == '#fff') return null;
            if(r == '#ffffff') return null;
            return r;
        });
        var MULT = CELLSIZE/16;
        var cvs = G.colorsMatrixToSprite(mat,MULT);
        this.player = G.crop(cvs,MULT*0,0,MULT*16,MULT*16);
        this.mob = G.crop(cvs,MULT*16,0,MULT*16,MULT*16);
        this.mobAnimations = this.AnimateEnemy(this.mob);
        this.playerAnimations = this.AnimatePlayer(this.player);
        this.cursor = this.GenerateCursor();
        this.castle = this.GetCastle();
    }
    GetZapTower(base){
        var mat = G.getColorMatrix(base,(r)=>{
            if(r == '#ff0000') return `#fbf236`;
            if(r == '#a30000') return `#a79e03`;
            return r;
        });
        var canvas = G.colorsMatrixToSprite(mat,1);
        var zapEmoji = G.getEmojiSprite(`⚡`,CELLSIZE/2,1.2);
        canvas.ctx.drawImage(zapEmoji,
            canvas.w/2 - zapEmoji.w/2,
            canvas.h/2 - zapEmoji.h/2,
        );
        return canvas;
    }
    GetFireTower(base){
        var canvas = G.imgToCanvas(base);
        var zapEmoji = G.getEmojiSprite(`🔥`,CELLSIZE/2,1.2);
        canvas.ctx.drawImage(zapEmoji,canvas.w/2 - zapEmoji.w/2,canvas.h/2 - zapEmoji.h/2);
        return canvas;
    }
    GetLeftAndMirror(canvas){
        var left = G.crop(canvas,0,0,canvas.width/2,canvas.height);
        var right = G.mirror(left);
        var canvas2 = G.makeCanvas(canvas.w,canvas.h);
        canvas2.ctx.drawImage(left,0,0);
        canvas2.ctx.drawImage(right,canvas2.w/2,0);
        return canvas2;
    }
    GetRightAndMirror(canvas){
        var right = G.crop(canvas,canvas.width/2,0,canvas.width/2,canvas.height);
        var left = G.mirror(right);
        var canvas2 = G.makeCanvas(canvas.w,canvas.h);
        canvas2.ctx.drawImage(left,0,0);
        canvas2.ctx.drawImage(right,canvas2.w/2,0);
        return canvas2;
    }
    AnimateEnemy(mob){
        var mainSprite = G.imgToCanvas(mob);
        var sprites = [];
        var MULT = CELLSIZE/16;
        var LegL = G.crop(mainSprite, MULT*4,MULT*12,MULT*4,MULT*4);
        var LegR = G.crop(mainSprite, MULT*8,MULT*12,MULT*4,MULT*4);
        var Spear = G.crop(mainSprite, MULT*12,0,MULT*4,MULT*16);
        
        mainSprite.ctx.clearRect(MULT*4,MULT*12,MULT*4,MULT*4);
        mainSprite.ctx.clearRect(MULT*8,MULT*12,MULT*4,MULT*4);
        mainSprite.ctx.clearRect(MULT*12,0,MULT*4,MULT*16);
        var spriteSpec = [
            {L : -1 , R : 0 , S : -1},
            {L : 0 , R : 0 , S : 0},
            {L : 0 , R : -1 , S : 1},
            {L : 0 , R : -1 , S : 1},
            {L : 0 , R : 0 , S : 0},
        ];
        for(let i in spriteSpec){
            var spec = spriteSpec[i];
            var clone = G.imgToCanvas(mainSprite);
            clone.ctx.drawImage(LegL, MULT*4, MULT*12 + MULT*spec.L);
            clone.ctx.drawImage(LegR, MULT*8, MULT*12 + MULT*spec.R);
            clone.ctx.drawImage(Spear, MULT*12,0 + MULT*spec.S);
            sprites.push(clone);
        }
        return sprites;
    }
    AnimatePlayer(sprite){
        var mainSprite = G.imgToCanvas(sprite);
        var croppedmainSprite = G.imgToCanvas(sprite);
        var sprites = [];
        var MULT = CELLSIZE/16;

        var crops = [
            {n: 'LegL',  x:  MULT*4,    y: MULT*12, w:MULT*4,   h:MULT*4 , s: null},
            {n: 'LegR',  x:  MULT*8,    y: MULT*12, w:MULT*4,   h:MULT*4 , s: null},
            {n: 'HandL', x:  0,         y: MULT*8,  w:MULT*4,   h:MULT*4 , s: null},
            {n: 'HandR', x:  MULT*12,   y: MULT*8,  w:MULT*4,   h:MULT*4 , s: null},
        ]
        crops.forEach(c=>{
            c.s = G.crop(mainSprite, c.x, c.y, c.w, c.h);
            croppedmainSprite.ctx.clearRect(c.x, c.y, c.w, c.h);
        });

        var LegL = crops.find(x=>x.n=='LegL');
        var LegR = crops.find(x=>x.n=='LegR');
        var HndL = crops.find(x=>x.n=='HandL');
        var HndR = crops.find(x=>x.n=='HandR');

        var spriteSpec = [
            {L : -1 ,   R : 0 ,     S : -1},
            {L : 0 ,    R : 0 ,     S : 0},
            {L : 0 ,    R : -1 ,    S : 1},
            {L : 0 ,    R : -1 ,    S : 1},
            {L : 0 ,    R : 0 ,     S : 0},
        ];
        for(let i in spriteSpec){
            var spec = spriteSpec[i];
            var buffer = G.makeCanvas(croppedmainSprite.w,croppedmainSprite.h);
            buffer.ctx.drawImage(LegL.s, LegL.x, LegL.y + MULT * spec.L);
            buffer.ctx.drawImage(LegR.s, LegR.x, LegR.y + MULT * spec.R);
            buffer.ctx.drawImage(HndL.s, HndL.x, HndL.y + MULT * spec.L);
            buffer.ctx.drawImage(HndR.s, HndR.x, HndR.y + MULT * spec.R);
            buffer.ctx.drawImage(croppedmainSprite, 0,0);
            sprites.push(buffer);
        }
        return sprites;
    }
    GenerateCursor(){
        var canvas = G.makeCanvas(CELLSIZE,CELLSIZE);
        var ctx = canvas.ctx;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,canvas.w,canvas.h);
        ctx.clearRect(2,2,canvas.w-4,canvas.h-4);
        ctx.clearRect(CELLSIZE/4,0,CELLSIZE/2,CELLSIZE);
        ctx.clearRect(0,CELLSIZE/4,CELLSIZE,CELLSIZE/2);
        return canvas;
    }
    GetCastle(){
        var castle =  G.getEmojiSprite(`🏰`,CELLSIZE,1.1);
        return castle;
    }
}
class Mob{
    constructor(game, pos){
        this.game=game;
        this.mobAnimations = game.spriteEngine.mobAnimations;
        this.currentAnimation = 0;
        this.sprite = this.mobAnimations[this.currentAnimation];
        this.pos = G.Point(pos);
        this.destination = G.Point(this.pos);
        this.target = this.getNextToPlayerLocation();
        this.power = 2;
        this.timer = 2;
        this.speed = CELLSIZE/16;
        this.time = 0;
        this.animationframes = 16;
        this.framesPassed = 0;
        this.waitFrameCount = 2;
    }
    getNextToPlayerLocation(){
        var playerpospos = this.game.player.pos;
        if(this.pos.distance(playerpospos) <= CELLSIZE/2){
            this.game.player.life -= this.power;
            if(this.game.player.life <= 0){
                this.game.player.life = 0;
                this.game.gameOverScene();
            }
        }
        var path = this.game.findPath(
            this.destination,
            playerpospos
        );
        if(path != null && path.length > 1){
            var pp = this.game.normalizePoint({x:path[1][1],y:path[1][0]});
            return G.Point(pp);
        }
        return G.Point(this.destination);
    }
    update(t){
        this.framesPassed++;
        this.currentAnimation++;
        
        this.sprite = this.mobAnimations[Math.floor(this.currentAnimation/this.animationframes)];
        if(this.currentAnimation > (this.mobAnimations.length-1) * this.animationframes){
            this.currentAnimation = 0;
        }
        if(this.framesPassed >= this.waitFrameCount){
            this.move();
            this.framesPassed = 0;
        }
        // this.game.helpdom.innerHTML = `mob ${this.currentAnimation} ${this.mobAnimations.length}`;
        var t = G.GenTable(5,5);
        var e = t.entities;
        e[0][0].innerHTML = `pos`;
        e[1][0].innerHTML = `destination`;
        e[2][0].innerHTML = `target`;
        e[0][1].innerHTML = `${this.pos.x}`;
        e[1][1].innerHTML = `${this.destination.x}`;
        e[2][1].innerHTML = `${this.target.x}`;
        e[0][2].innerHTML = `${this.pos.y}`;
        e[1][2].innerHTML = `${this.destination.y}`;
        e[2][2].innerHTML = `${this.target.y}`;

        // this.game.helpdom.append(t);
        // this.game.helpdom.append(this.sprite);
        
    }
    move(){
        if(this.pos.distance(this.destination) <= this.speed){
            this.target = this.getNextToPlayerLocation();
            this.destination = G.Point(this.target);
        }
        else{
            // debugger;
            var distance = this.pos.distance(this.destination);
            if(distance >= this.speed){
                this.pos.moveToward(this.destination,this.speed);
            }
            else{
                this.pos = G.Point(this.destination);
            }
        }
    }
    draw(ctx){
        ctx.drawImage(this.sprite,
            this.pos.x - this.sprite.w/2,
            this.pos.y - this.sprite.h/2
        )
    }
}
class MobGenerator{
    constructor(game,pos){
        this.game = game;
        this.pos = G.Point(pos);
        this.timer = 500;
        this.time = 0;
        this.framespassed = 0;
        this.counter = 0;
        this.counterCap = 13;
    }
    update(t){
        this.framespassed++;
        var dt = (t - this.time)/1000;
        if(this.framespassed > this.timer && this.counter < this.counterCap){
            this.timer += 100;
            this.counter++;
            this.time = t;
            var mob = new Mob(this.game,this.pos);
            this.game.objects.push(mob);
        }
        
    }
    draw(ctx){
         
    }
}
class Key{
    constructor(){
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
    }
    keyup(code){
        
        switch(code.toLowerCase()){
            case 'a' : this.a = false; break;
            case 'w' : this.w = false; break;
            case 's' : this.s = false; break;
            case 'd' : this.d = false; break;
        }
    }
    keydown(code){
        switch(code.toLowerCase()){
            case 'a' : this.a = true;this.d = false; break;
            case 'w' : this.w = true;this.s = false; break;
            case 's' : this.s = true;this.w = false; break;
            case 'd' : this.d = true;this.a = false; break;
        }
    }
}
class Player{
    constructor(game, pos){
        this.game = game;
        this.pos = G.Point(pos);
        this.destination = G.Point(pos);
        this.sprite = game.spriteEngine.player;
        this.animations = game.spriteEngine.playerAnimations;
        this.currentAnimation = 0;
        this.animationframes = 5;
        this.speed = CELLSIZE/16;
        this.keys= new Key();
        this.life = 100;
        this.enableEventListners();
    }
    resetKeys(){
        this.keys = new Key();
    }
    resetPos(pos){
        this.pos = G.Point(pos);
        this.destination = G.Point(pos);
        this.keys = new Key();
    }
    enableEventListners(){
        window.addEventListener('keydown',(e)=>{
            this.keys.keydown(e.key);
        });
        window.addEventListener('keyup',(e)=>{
            this.keys.keyup(e.key);
        });
    }
    update(t){
        this.game.playerhealthdom.innerHTML = this.life;
        var d = this.destination.distance(this.pos);
        if( d > this.speed ){
            this.pos.moveToward(this.destination,this.speed);
            this.sprite = this.animations[Math.floor(this.currentAnimation/this.animationframes)];
            this.currentAnimation++;
            if(this.currentAnimation > (this.animations.length-1) * this.animationframes){
                this.currentAnimation = 0;
            }
        }
        else{
            this.sprite = this.animations[1];
            this.pos = G.Point(this.destination);
            var dest = G.Point(this.destination);
            var cx = 0, cy = 0;
            if(this.keys.w)     {cy = -CELLSIZE;}
            if(this.keys.s)     {cy = CELLSIZE;}

            if(this.keys.a)     {cx = -CELLSIZE;}
            if(this.keys.d)     {cx = CELLSIZE;}

            if(cx != 0 && cy != 0){   
                var destX = G.Point(this.destination);
                destX.x += cx;
                var destY = G.Point(this.destination);
                destY.y += cy;
                var validX = this.game.validPath(destX);
                var validY = this.game.validPath(destY);

                if(validX && validY || validX){
                    this.destination = G.Point(destX);
                }
                else if(validY){
                    this.destination = G.Point(destY);
                }
            }
            else if(cx != 0){
                dest.x += cx;
                if(this.game.validPath(dest)){
                    this.destination = G.Point(dest);
                }
            }
            else if(cy != 0){
                dest.y += cy;
                if(this.game.validPath(dest)){
                    this.destination = G.Point(dest);
                }
            }
        }
    }
    getCamPov(w,h){
        var ix = this.pos.x - this.sprite.w/2;
        var iy = this.pos.y - this.sprite.h/2;

        var x = ix , y = iy;

        var bufferdd = {
            w: this.game.buffer.w,
            h: this.game.buffer.h
        }

        x = Math.max(x - w/2,0);
        y = Math.max(y - h/2,0);

        if(x + w > bufferdd.w) x = bufferdd.w-w;
        if(y + h > bufferdd.h) y = bufferdd.h-h;

        // var xm = Math.min(x + w,bufferdd.w - x - w);
        // var ym = Math.min(y + h,bufferdd.h - x - h);
        // x = Math.min(Math.max(x - w/2,0), Math.min(x + w/2,bufferdd.w - x - w/2));
        // y = Math.min(Math.max(y - h/2,0), Math.min(y + h/2,bufferdd.h - y - h/2));

        var t = G.GenTable(6,6);
        var e = t.entities;


        e[0][0].innerHTML = 'n';
        e[0][1].innerHTML = 'x';
        e[0][2].innerHTML = 'y';

        e[1][0].innerHTML = 'player';
        e[1][1].innerHTML = `${ix}`;
        e[1][2].innerHTML = `${iy}`;

        e[2][0].innerHTML = 'camera';
        e[2][1].innerHTML = `${x}`;
        e[2][2].innerHTML = `${y}`;

        e[3][0].innerHTML = 'buffer';
        e[3][1].innerHTML = `${bufferdd.w}`;
        e[3][2].innerHTML = `${bufferdd.h}`;


        e[2][0].innerHTML = 'camera+h';
        e[2][1].innerHTML = `${x+w}`;
        e[2][2].innerHTML = `${y+h}`;

        // this.game.helpdom.innerHTML = ``;
        // this.game.helpdom.append(t);
        return {x,y};
    }
    draw(ctx){
        ctx.drawImage(this.sprite,
            this.pos.x - this.sprite.w/2,
            this.pos.y - this.sprite.h/2
        )
        // var campos = this.getCamPov(this.cameraRect.w,this.cameraRect.h);
        // ctx.drawImage(this.cameraRect,
        //     campos.x,
        //     campos.y
        // )
    }
}
class E{
    constructor(game,pos){
        this.game = game;
        this.pos = G.Point(pos);
        this.sprite = G.getEmojiSprite(`E`,CELLSIZE,1.1);
        this.life = 1;
    }
    update(t){

    }
    draw(ctx){
        ctx.drawImage(this.sprite,this.pos.x - this.sprite.w/2,this.pos.y - this.sprite.h/2);
    }
}
class EndOfMaze extends E{
    constructor(game,pos){
        super(game,pos);
        this.sprite =  G.getEmojiSprite(`🏆`,CELLSIZE,1.1);
    }
    update(t){
        if(this.game.player.pos.distance(this.pos) < CELLSIZE){
            this.game.LevelEndScene();
        }
    }
}
class Cookie extends E{
    constructor(game,pos){
        super(game,pos);
        this.sprite = G.getEmojiSprite(`🍪`,CELLSIZE*0.8,1.1);
        this.rotation = 0;

        this.animations = [
            G.getEmojiSprite(`🍪`,CELLSIZE*0.8,1.1),
            G.getEmojiSprite(`🍪`,CELLSIZE*0.7,1.1),
            G.getEmojiSprite(`🍪`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`🍪`,CELLSIZE*0.5,1.1),
            G.getEmojiSprite(`🍪`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`🍪`,CELLSIZE*0.7,1.1),
        ];
        this.currentAnimation = 0;
        this.currentAnimationFrames = 10;
    }
    update(t){
        this.rotation++;
        this.currentAnimation++;
        if(this.rotation > 360) this.rotation = 0;
        // this.sprite = G.rotateCanvas(this.animations[floor(this.currentAnimation/this.currentAnimationFrames)],this.rotation);
        this.sprite = this.animations[floor(this.currentAnimation/this.currentAnimationFrames)],this.rotation;
        if(this.currentAnimation > (this.animations.length-1) * this.currentAnimationFrames){
            this.currentAnimation = 0;
        }
        if(this.game && this.game.player && this.pos.distance(this.game.player.pos) < CELLSIZE/2){
            this.game.cookies += 1;
            this.game.objects = this.game.objects.filter(x=>x!=this);
        }
    }
}
class Heart extends E{
    constructor(game,pos){
        super(game,pos);
        this.sprite = G.getEmojiSprite(`💓`,CELLSIZE*0.8,1.1);
        this.animations = [
            G.getEmojiSprite(`💓`,CELLSIZE*0.8,1.1),
            G.getEmojiSprite(`💓`,CELLSIZE*0.7,1.1),
            G.getEmojiSprite(`💓`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`💓`,CELLSIZE*0.5,1.1),
            G.getEmojiSprite(`💓`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`💓`,CELLSIZE*0.7,1.1),
        ];
        this.currentAnimation = 0;
        this.currentAnimationFrames = 10;
    }
    update(t){
        this.currentAnimation++;
        this.sprite = this.animations[floor(this.currentAnimation/this.currentAnimationFrames)],this.rotation;
        if(this.currentAnimation > (this.animations.length-1) * this.currentAnimationFrames){
            this.currentAnimation = 0;
        }
        if(this.game && this.game.player && this.pos.distance(this.game.player.pos) < CELLSIZE/2){
            this.game.player.life += 20;
            this.game.objects = this.game.objects.filter(x=>x!=this);
        }
    }
}
class TimePickUp extends E{
    constructor(game,pos){
        super(game,pos);
        this.sprite = G.getEmojiSprite(`⌛`,CELLSIZE*0.8,1.1);
        this.animations = [
            G.getEmojiSprite(`⌛`,CELLSIZE*0.8,1.1),
            G.getEmojiSprite(`⌛`,CELLSIZE*0.7,1.1),
            G.getEmojiSprite(`⌛`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`⌛`,CELLSIZE*0.5,1.1),
            G.getEmojiSprite(`⌛`,CELLSIZE*0.6,1.1),
            G.getEmojiSprite(`⌛`,CELLSIZE*0.7,1.1),
        ];
        this.currentAnimation = 0;
        this.currentAnimationFrames = 10;
    }
    update(t){
        this.currentAnimation++;
        this.sprite = this.animations[floor(this.currentAnimation/this.currentAnimationFrames)],this.rotation;
        if(this.currentAnimation > (this.animations.length-1) * this.currentAnimationFrames){
            this.currentAnimation = 0;
        }
        if(this.game && this.game.player && this.pos.distance(this.game.player.pos) < CELLSIZE/2){
            this.game.timeremaining += 15;
            this.game.objects = this.game.objects.filter(x=>x!=this);
        }
    }
}
class Game{
    constructor(c){
        this.config = {
            music : false,
            sound : false,
            song : 1,
            playrate : 1,
            controls:false
        };
        this.resetBody();
        this.preLoading();
        this.touchTh = CELLSIZE/4;
        this.spriteTocuhPos = G.MakeCircle(this.touchTh*3,'#11009ead','#b2a9ff91');
        this.windowaspect = window.innerHeight/window.innerWidth;
        if(this.windowaspect > 1){
            CELLSIZE = 16*2;
        }
        GameDimR = Math.floor(window.innerHeight/CELLSIZE) - 1.5;
        GameDimC = Math.floor(window.innerWidth/CELLSIZE)- 1;
        this.helpdom = document.createElement('div');
        document.body.innerHTML = ``;
        G.loadImage('spritesheet.gif?'+Math.random(),img=>{
            
            CELLSIZE = CELLSIZE;
            this.spriteEngine = new SpriteEngine(img);
            this.cursorSprite = this.spriteEngine.GenerateCursor();
            this.mousePos = {x:0,y:0};
            this.objects = [];
            // this.fortesting();
            this.mainScene();
            // var cover = this.getCover();
            // var th = this.getThumbnail();
            // document.body.append(cover);
            // document.body.append(th);
        })
    }
    prepheader(){
        var headerTable = G.GenTable(2,6);
        headerTable.style.width = GameDimC * CELLSIZE + "px";
        var entities = headerTable.entities;
        this.leveldom = document.createElement('div');
        this.cookiedom = document.createElement('div');
        this.timedom = document.createElement('div');
        this.playerhealthdom = document.createElement('div');
        this.menuDom = document.createElement('div');

        entities[0][0].append(G.getEmojiSprite('🍪',32,1.4));
        entities[1][0].append(this.cookiedom);

        entities[0][1].append(G.getEmojiSprite('💓',32,1.4));
        entities[1][1].append(this.playerhealthdom);

        entities[0][2].append(G.getEmojiSprite('⌛',32,1.4));
        entities[1][2].append(this.timedom);

        entities[0][4].append(`Level`);
        entities[1][4].append(this.leveldom);
        
        entities[0][5].rowSpan = 2;
        entities[0][5].append(G.getEmojiSprite('📋',40,1.4));

        entities[1][5].remove();
        entities[0][5].onclick = ()=>{this.showMenu();}

        this.header.append(headerTable);
    }
    prepFootercontrols(){
        if(this.config.controls == false){
            this.footer.innerHTML = '';
            return;
        }
        this.footer.innerHTML = '';
        var table = G.GenTable(2,3);
        table.classList.add('gamecontrolstable');
        table.style.width = GameDimC * CELLSIZE + "px";
        var entities = table.entities;
        var keys = [
            {html : '<span> <h1>w</h1> </span>', f : 'w' , r : 0 , c : 1},
            {html : '<span> <h1>s</h1> </span>', f : 's' , r : 1 , c : 1},
            {html : '<span> <h1>a</h1> </span>', f : 'a' , r : 0 , c : 0},
            {html : '<span> <h1>d</h1> </span>', f : 'd' , r : 0 , c : 2},
        ]
        keys.forEach(k=>{
            var dom = G.makeDom(k.html);
            entities[k.r][k.c].addEventListener('touchstart',(e)=> this.player.keys.keydown(k.f));
            entities[k.r][k.c].addEventListener('touchend',(e)=> this.player.keys.keyup(k.f));
            entities[k.r][k.c].addEventListener('mousedown',(e)=> this.player.keys.keydown(k.f));
            entities[k.r][k.c].addEventListener('mouseup',(e)=> this.player.keys.keyup(k.f));
            entities[k.r][k.c].append(dom) ;
            entities[k.r][k.c].style.border = '2px solid black';
            entities[k.r][k.c].style.background = 'blue';
            entities[k.r][k.c].style.color = '#fff';
        })
        entities[0][2].rowSpan = 2;
        entities[1][2].remove();
        entities[0][0].rowSpan = 2;
        entities[1][0].remove();

        this.footer.appendChild(table);

    }
    mainScene(){
        this.gameover = true;
        this.gamePased = true;
        this.resetBody();
        var canvas = G.makeCanvas(GameDimC*CELLSIZE,GameDimR*CELLSIZE);
        canvas.fill('#000');
        
        // var cover = this.getCover();
        // canvas.ctx.drawImage(cover,0,0, canvas.w,canvas.h);
        this.getMainMenuBg(canvas);

        this.body.append(canvas);
        this.showMenu();
    }
    showMenu(){
        this.gamePased = true;
        if(this.dialog != null){this.dialog.remove();}
        this.dialog = Object.assign(document.createElement('div'), { className: 'menuDialog'});
        
        var navItems = [];
        if(this.gameover){
            navItems.push({html : '<button >New Game</button>', f:'newgame'});
        }
        else{
            navItems.push({html : '<button >Resume</button>', f:'resume'});
        }
        navItems.push(...[
            {html : '<button >Help</button>',   f:'help'},
            {html : `<button >Music ${this.config.music ? 'ON': 'OFF'}</button>`,   f:'music'},
            {html : `<button >Controls ${this.config.controls ? 'ON': 'OFF'}</button>`,   f:'controls'},
        ]);
        if(!this.gameover){
            navItems.push({html : '<button >Quit</button>',   f:'quit'},);
        }
        var nav = G.GenTable(navItems.length,1);
        for(let i in navItems){
            var dom = G.makeDom(navItems[i].html)
            dom.style.width = `${GameDimC*CELLSIZE * 0.9}px`;
            dom.style.fontSize = `24pt`;

            nav.entities[i][0].append(dom);
            nav.entities[i][0].onclick = ()=>{
                this.ApplyMenuItem(navItems[i].f);
            }
        }
        this.dialog.append(nav);
        this.body.append(this.dialog);
    }
    newGame(){
        this.resetBody();
        this.prepheader();
        this.prepFootercontrols();
        // document.body.requestFullscreen();
        this.windowaspect = window.innerHeight/window.innerWidth;
        this.startingMazePoint = G.Point({x:CELLSIZE/2,y:CELLSIZE/2});
        this.player = new Player(this,this.startingMazePoint);
        this.objects = [];
        this.level = 1;
        this.newLevel(this.level);
        window.addEventListener('keyup',(e)=>{
            if(e.key=='Escape'){
                this.showMenu();
            }
        })
    }
    newLevel(level){
        this.cookies = 0;
        this.timeremaining = 13*60;
        this.timeup = false;
        this.gameover = false;
        this.gamePased = false;
        this.level = level;
        this.leveldom.innerHTML = this.level;
        var r = 40 + this.level * 5;
        var c = 40 + this.level * 5;
        this.objects = [];
        this.player.resetPos(this.startingMazePoint);
        this.mazeMap = new MazeGenerator(c,r);
        this.mazeGrid = this.mazeMap.grid;
        this.mazePathfinder = new Pathfinder(this.mazeGrid);
        this.finishingMazePoint = G.Point({x: r*CELLSIZE-CELLSIZE/2,y:c*CELLSIZE-CELLSIZE/2 });
        this.eom = null;
        // this.eom = new EndOfMaze(this,this.finishingMazePoint);
        this.mobgen = new MobGenerator(this,this.startingMazePoint);
        this.objects = [
            this.player,
            this.mobgen,
            // this.eom
        ];
        let cookiesO = [];
        let possibleEOM = [];
        for(let i = 0 ; i < r ; i++){
            for(let j = 0 ; j < c ;j++){
                if(this.mazeGrid[i][j] == true){
                    if(Math.random() < 0.3){
                        this.mazeGrid[i][j] = false;
                    }
                }
            }
        }
        for(let i = 0 ; i < r ; i++){
            for(let j = 0 ; j < c ;j++){
                if(this.mazeGrid[i][j] == false){
                    if((i == 0 || this.mazeGrid[i-1][j] == false) ||
                    (i == r-1 || this.mazeGrid[i+1][j] == false) ||
                    (j == 0 || this.mazeGrid[i][j-1] == false) ||
                    (j == c-1 || this.mazeGrid[i][j+1] == false)){
                        var pp = this.normalizePoint({x:j,y:i});
                        if(Math.random() < 0.3){
                            var cookie = new Cookie(this,pp);
                            cookiesO.push(cookie);
                        }
                        else if(Math.random() < 0.01){
                            var heart = new Heart(this,pp);
                            this.objects.push(heart);
                        }
                        else if(Math.random() < 0.005){
                            var timepu = new TimePickUp(this,pp);
                            this.objects.push(timepu);
                        }
                        else{
                            possibleEOM.push(pp);
                        }
                    }
                    else{
                        console.log(`trapped point`);
                    }
                }
            }
        }
        this.possibleEOM = G.shuffleArray(possibleEOM);
        cookiesO = G.shuffleArray(cookiesO);
        cookiesO = cookiesO.splice(0, Math.min(13 * this.level, cookiesO.length-5));

        this.levelCookies = cookiesO.length;
        this.objects.push(...cookiesO);

        this.mapcanvas = this.genMap(r,c,CELLSIZE,this.mazeGrid);
        this.buffer = G.makeCanvas(r*CELLSIZE,c*CELLSIZE);
        this.canvas = G.makeCanvas(GameDimC*CELLSIZE,GameDimR*CELLSIZE);
        
        // document.body.append(this.mapcanvas);
        this.body.innerHTML = '';
        this.body.appendChild(this.canvas);
        // this.body.appendChild(this.buffer);
        this.body.appendChild(this.helpdom);
        this.update(0);

        this.events = {
            touchstart : false
        }

        this.touchPos = null;

        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mouseup', () => this.handleEnd());
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleStart(e));
        this.canvas.addEventListener('touchend', () => this.handleEnd());
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e));

        

        

        return;
        if(this.SoundSystem) this.SoundSystem.stopBgm();
        if(this.config.music) this.SoundSystem.startBgm(this.config.song);
        this.level = level;
        this.canvas.addEventListener('click',(e)=>{
            this.handleClick(e);
        });
        /*var events = [`mousemove`,`touchmove`];
        events.forEach(event=>{
            this.canvas.addEventListener(event,(e)=>{
                var rect = this.canvas.getBoundingClientRect();
                var x = e.clientX - rect.left + window.scrollX;
                var y = e.clientY - rect.top + window.scrollY;
                x = Math.floor(x/CELLSIZE) * CELLSIZE;
                y = Math.floor(y/CELLSIZE) * CELLSIZE;
                this.mousePos = {x:x,y:y};
            });
        })*/
    }
    getTp(e){
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left + window.scrollX;
        var y = e.clientY - rect.top + window.scrollY;
        return { x: x, y: y };
    }
    handleStart(e) {
        const touch = e.touches ? e.touches[0] : e; // Handle single touch or mouse event
        this.touchPos = this.getTp(touch);
    }
    handleEnd() {
        this.touchPos = null;
        this.player.resetKeys();
    }
    handleMove(e) {
        if (this.touchPos) {
            const touch = e.touches ? e.touches[0] : e; // Handle single touch or mouse event
            const tp2 = this.getTp(touch);
            this.touchPosMove = tp2;
            const deltaX = tp2.x - this.touchPos.x;
            const deltaY = tp2.y - this.touchPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > this.touchTh) {
                this.player.keys.d = deltaX > this.touchTh;
                this.player.keys.a = deltaX < -this.touchTh;
                this.player.keys.w = deltaY < -this.touchTh;
                this.player.keys.s = deltaY > this.touchTh;


                // For diagonal movement
                if (Math.abs(deltaX) > this.touchTh && Math.abs(deltaY) > this.touchTh) {
                    if (deltaX > this.touchTh && deltaY < -this.touchTh) {
                        this.player.keys.d = true;
                        this.player.keys.w = true;
                    }
                    if (deltaX < -this.touchTh && deltaY < -this.touchTh) {
                        this.player.keys.a = true;
                        this.player.keys.w = true;
                    }
                    if (deltaX < -this.touchTh && deltaY > this.touchTh) {
                        this.player.keys.a = true;
                        this.player.keys.s = true;
                    }
                    if (deltaX > this.touchTh && deltaY > this.touchTh) {
                        this.player.keys.d = true;
                        this.player.keys.s = true;
                    }
                }

            }
        }
    }
    preLoading(){
        var about = G.makeDom(`<div>Loading....</div>`);
        this.body.append(about);
    }
    LevelEndScene(){
        this.gamePased = true;
        if(this.dialog != null){this.dialog.remove();}
        this.dialog = Object.assign(document.createElement('div'), { className: 'menuDialog'});
        this.dialog.innerHTML = `<h1>Well Done<h1><h2> Level ${this.level} finished</h2>`;
        var nextLevelButton = G.makeDom(`<button id="nextLevel"><h3>Next Level</h3></button>`);
        
        nextLevelButton.onclick = ()=>{
            this.newLevel(this.level+1);
        }
        this.dialog.append(nextLevelButton);
        this.body.append(this.dialog);
    }
    handleClick(e){
        if(this.dialog != null){this.dialog.remove();}
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left + window.scrollX;
        var y = e.clientY - rect.top + window.scrollY;
        x = Math.floor(x/CELLSIZE) * CELLSIZE + CELLSIZE / 2;
        y = Math.floor(y/CELLSIZE) * CELLSIZE + CELLSIZE / 2;
        var pos = {x:x,y:y};
        this.mousePos = {x:x-CELLSIZE/2,y:y-CELLSIZE/2};
        return;
    }
    resetBody(){
        var div_w_class = `<div class='_class_'></div>`;
        this.layout = G.makeDom(div_w_class.replace('_class_','layout'));
        this.header = G.makeDom(div_w_class.replace('_class_','header'));
        this.body = G.makeDom(div_w_class.replace('_class_','body'));
        this.footer = G.makeDom(div_w_class.replace('_class_','footer'));
        this.layout.appendChild(this.header);
        this.layout.appendChild(this.body);
        this.layout.appendChild(this.footer);

        

        document.body.innerHTML = ``;
        document.body.appendChild(this.layout);
    }
    gameOverScene(){
        this.gamePased = true;
        this.gameover = true;
        if(this.dialog != null){this.dialog.remove();}
        
        this.dialog = Object.assign(document.createElement('div'), { className: 'menuDialog'});
        
        this.dialog.style.width = `${GameDimC*CELLSIZE}px`;
        this.dialog.style.height = `${GameDimR*CELLSIZE * 0.8}px`;

        this.dialog.innerHTML = `<h1>Game Over</h1>`;
        if(this.timeup){
            this.dialog.innerHTML = `<h2>Time Up</h2>`;
        }
        var button = G.makeDom(`<button id="nextLevel"><h2>New Game</h2></button>`);
        button.style.width = `${GameDimC*CELLSIZE * 0.90}px`;

        button.onclick = ()=>{
            this.newGame();
        }
        this.dialog.append(button);
        this.body.append(this.dialog);

    }
    midLevelScene(nextLevel){
        this.objects = [];
        var canvas2 = G.makeCanvas(this.canvas.w,this.canvas.h);
        var size = 32;
        var lines = [
            G.getTextSprite(`Level ${nextLevel-1}`,size, 'red'),
            G.getTextSprite(`Completed`,size, 'green'),
            G.getTextSprite(`click for `,size, '#00'),
            G.getTextSprite(`next level`,size, '#000'),
        ]
        var sy = size;
        var vx = this.windowaspect > 1 ? 0 : size*2;
        for(let i = 0 ; i < lines.length;i++){
            var s = lines[i];
            canvas2.ctx.drawImage(s,
                vx,
                sy
            );
            sy+= size*1.2;
        }
        canvas2.addEventListener('click',(e)=>{
            this.newLevel(nextLevel);
        })
        this.body.innerHTML = '';
        this.body.appendChild(canvas2);
    }
    normalizePath(path){
        var normalizedPath = [];
        path.forEach(p=>{
            var [r,c] = p;
            var x = c * CELLSIZE + CELLSIZE / 2;  
            var y = r * CELLSIZE + CELLSIZE / 2;
            normalizedPath.push({x:x,y:y});
        })
        return normalizedPath;
    }
    normalizePoint(pos){
        var x = pos.x * CELLSIZE + CELLSIZE / 2;  
        var y = pos.y * CELLSIZE + CELLSIZE / 2;
        return {x ,y};
    }
    findPath(o1,o2){
        var p1 = {x : o1.x / CELLSIZE, y : o1.y/ CELLSIZE};
        var p2 = {x : o2.x / CELLSIZE, y : o2.y/ CELLSIZE};
        var path = this.mazePathfinder.findPath(
            p1.y,p1.x,p2.y,p2.x
        );
        return path;
    }
    validPath(pos){
        try{
            if(pos.x < 0 ) return false;
            if(pos.y <0 ) return false;
            if(pos.x > this.buffer.w) return false;
            if(pos.y > this.buffer.h) return false;
            var r = Math.floor(pos.y / CELLSIZE);
            var c = Math.floor(pos.x / CELLSIZE);
            if(r >= 0 && c >= 0){
                var gridval = this.mazeMap.grid[r][c] || false;
                return !gridval;
            }
            return false;
        }
        catch(e){
            console.log(e);
            return false;
        }
        
    }
    ApplyMenuItem(item){
        if(item == 'newgame'){
            this.gamePased = false;
            this.gameover = false;
            this.newGame();
        }
        else if(item == 'resume'){
            this.gamePased = false;
            this.dialog.remove();
            this.update(this.time);
        }
        else if(item == 'controls'){
            this.config.controls = !this.config.controls;
            this.prepFootercontrols();
            this.showMenu();
            this.update(this.time);
        }
        else if(item == 'music'){
            if(!this.SoundSystem){
                this.SoundSystem = new SoundSystem();
            }
            var currentval = this.config.music;
            if(currentval){
                this.SoundSystem.stopBgm();
            }
            else{
                this.SoundSystem.startBgm();
            }
            this.config.music = !this.config.music;
            this.dialog.remove();
            this.showMenu();
        }
        else if(item == 'quit'){
            if(document.webkitIsFullScreen) document.exitFullscreen();
            this.gamePased = true;
            this.gameover = true;
            this.dialog.remove();
            this.mainScene();
        }
        else if(item == `help`){
            this.gamePased = true;
            if(this.dialog != null){this.dialog.remove();}
            this.dialog = Object.assign(document.createElement('div'), { className: 'menuDialog'});
            this.dialog.style.width = `${GameDimC*CELLSIZE}px`;
            var h2 = `
                <div class="helpDiv">
                    <h2>Help</h2>
                    <p>You are trapped in a maze </p>
                    <p>Gather cookies (🍪) and avoid the walking thirteens</p>
                    <p>After Collecting all cookies find (🏆) to finish level</p>
                    <p>you have only 13 minutes to finish the maze</p>
                    <p>if a thirteen catch up to you it will take from your life</p>
                    <p>collect hearts(💓) to extend your life</p>
                    <p>collect time(⌛) to extend your time</p>
                    <p></p>
                    <p></p>
                </div>
            `;
            var mdom = G.makeDom('<button>Menu</button>');
            mdom.onclick = ()=>{
                this.gamePased = false;
                this.dialog.remove();
                this.showMenu();
                // this.update(this.time);
            }
            this.dialog.innerHTML += h2;
            var helpDiv = this.dialog.querySelector('.helpDiv');
            helpDiv.style['overflow-y'] = `auto`;
            helpDiv.style.height = GameDimR*CELLSIZE * 0.8  + `px`;
            this.dialog.append(mdom);
            this.body.append(this.dialog);
        }
    }
    genMap(rows,cols, cellSize, grid, path = false){
        var grass = G.randomPattern('#2d7d00','#509e26',0.1,cellSize,cellSize);
        var dirt = G.randomPattern('#924200','#3d1c00',0.01,cellSize,cellSize);

        var brick = G.brickPattern('#BC4A3C','black', CELLSIZE/8);

        var canvas = G.makeCanvas(cols*cellSize,rows*cellSize);
        var ctx = canvas.ctx;
        for(let i = 0 ; i < rows ; i++){
            var row = grid[i];
            for(let j = 0 ; j < cols ; j++){
                var s = row[j] == path ? grass : brick;
                ctx.drawImage(s,
                    j*s.width,
                    i*s.height
                );
            }
        }
        return canvas;
    }
    parseNum(v){
        if(v >= 10000000000) return `${(v/10000000000).toFixed(1)}T`;
        if(v >= 100000000) return `${(v/100000000).toFixed(1)}B`;
        if(v >= 1000000) return `${(v/1000000).toFixed(1)}M`;
        if(v >= 1000) return `${(v/1000).toFixed(1)}k`;
        return `${v}`;
    }
    updateBuffer(){
        this.buffer.clear();
        this.buffer.ctx.drawImage(this.mapcanvas,0,0);
        this.objects.sort((a, b) => {return a.pos ? a.pos?.y : Infinity - b.pos ? b.pos?.y : Infinity;});
        this.objects.forEach(x=> x.draw(this.buffer.ctx));

        var w = this.canvas.w;
        var h = this.canvas.h;
        var cxy = this.player.getCamPov(w,h);
        return G.crop(this.buffer,cxy.x,cxy.y,w,h);

    }
    update(t){
        if(this.gameover == true) return this.gameOverScene();
        var tins = parseInt(t/1000);
        var timeremaining = this.timeremaining - tins;
        this.timedom.innerHTML = `${this.parseTime(timeremaining)}`;
        if(timeremaining <=0){
            this.gameover == true;
            this.timeup == true;
            this.gameOverScene()
        }
        if(this.gamePased == true){return;}

        this.playerhealthdom.innerHTML = `${this.player.life}`;
        this.cookiedom.innerHTML = `${this.cookies}/${this.levelCookies}`;
        if(this.cookies == this.levelCookies && this.eom == null){
            this.eom = new EndOfMaze(this,this.possibleEOM[0]);
            this.objects.push(this.eom);
        }
        for(let i = 0 ; i < this.config.playrate;i++){
            this.objects.forEach(x=> x.update(t + i*1000));
        }
        var crop = this.updateBuffer();
        this.canvas.clear();
        this.canvas.ctx.drawImage(crop,0,0);

        if(this.touchPos){
            this.canvas.ctx.drawImage(this.spriteTocuhPos,
                this.touchPos.x - this.spriteTocuhPos.w/2,
                this.touchPos.y - this.spriteTocuhPos.h/2,
            )
            if(this.touchPosMove){
                this.canvas.ctx.fillRect(
                    this.touchPosMove.x,this.touchPosMove.y,
                    2,2
                )
            }
        }

        this.time = t;
        requestAnimationFrame(newtime=>this.update(newtime));
    }
    parseTime(s){
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        h = h == 0 ? '' : h < 10 ? `0${h}:` : `${h}:`;
        m = Math.floor(m % 60);
        m = m == 0 ? '' : m < 10 ? `0${m}:` : `${m}:`;
        s = Math.floor(s % 60);
        return `${h}${m}${s}`;
    }
    getThumbnail(){
        var mob = this.spriteEngine.mob;
        var ply = this.spriteEngine.player;
        var brick = G.brickPattern('#BC4A3C','black', CELLSIZE/8);
        var grass = G.randomPattern('#2d7d00','#509e26',0.1,CELLSIZE,CELLSIZE);
        var Thumbnail = G.makeCanvas(320,320);
        
        var ctx = Thumbnail.ctx;

        Thumbnail.fillPatern(grass);

        var cookiedim = G.Lightify(G.getEmojiSprite(`🍪`,CELLSIZE,1.1),0.3);
        ctx.drawImage(cookiedim, 0 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*1 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*2 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*3 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*4 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*5 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*6 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*7 , 0);

        var credit = G.getTextSprite(`BY MHMDJAWADZD`,   18, `#fff`, 1.5, 'cursive');
        var pattern = ctx.createPattern(brick,'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, 320, 20);
        ctx.fillRect(0, 300, 320, 20);
        var text1 = G.getTextSprite(`MAZE`,   46, `#fff`, 1.5,'cursive');
        var text2 = G.getTextSprite(`Runner`,  36, `#fff`, 1.5,'cursive');
        var text3 = G.getTextSprite(`1`,  80, `#ff0000`, 1.5,'cursive');
        var text4 = G.getTextSprite(`3`,  80, `#1a00ff`, 1.5,'cursive');


        ctx.drawImage(credit, 0, 300);
        // ctx.drawImage(text1, 20, 120);
        // ctx.drawImage(text2, 20, 150);
        // ctx.drawImage(text3, 220, 110);
        // ctx.drawImage(text4, 240, 110);

        ctx.drawImage(mob, 30, 200);
        ctx.drawImage(ply, 100, 200);
        ctx.drawImage(mob, 170, 200);
        return Thumbnail;
        // document.body.append(Thumbnail);
    }
    getCover(){
        var mob = this.spriteEngine.mob;
        var ply = this.spriteEngine.player;
        var brick = G.brickPattern('#BC4A3C','black', CELLSIZE/8);
        var grass = G.randomPattern('#2d7d00','#509e26',0.1,CELLSIZE,CELLSIZE);
        var Cover = G.makeCanvas(800,500);
        Cover.fillPatern(grass);
        var ctx = Cover.ctx;
        var cookiedim = G.Lightify(G.getEmojiSprite(`🍪`,CELLSIZE,1.1),0.3);
        ctx.drawImage(cookiedim, 0 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*1 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*2 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*3 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*4 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*5 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*6 , 0);
        ctx.drawImage(cookiedim, cookiedim.w*7 , 0);

        var credit = G.getTextSprite(`BY MHMDJAWADZD`,   50, `#fff`, 1.5, 'cursive');
        var pattern = ctx.createPattern(brick,'repeat');
        ctx.fillStyle = pattern;
        
        ctx.fillRect(0, 0, Cover.w, 50);
        ctx.fillRect(0, Cover.h-50, Cover.w, 50);

        var text1 = G.getTextSprite(`MAZE`,   80, `#fff`, 1.5,'cursive');
        var text2 = G.getTextSprite(`Runner`,  70, `#fff`, 1.5,'cursive');
        var text3 = G.getTextSprite(`1`,  180, `#ff0000`, 1.5,'cursive');
        var text4 = G.getTextSprite(`3`,  180, `#1a00ff`, 1.5,'cursive');

        ctx.drawImage(credit, 0,  Cover.h - credit.h);

        // ctx.drawImage(text1, 20, 120);
        // ctx.drawImage(text2, 20, 100 + text1.h);
        // ctx.drawImage(text3, 20+text1.w + 10, 110);
        // ctx.drawImage(text4, 20+text1.w + 50, 110);

        ctx.drawImage(ply, 30, 320);

        ctx.drawImage(mob, 30 + mob.w * 2, 320);
        ctx.drawImage(mob, 30 + mob.w * 3, 320);
        ctx.drawImage(mob, 30 + mob.w * 4, 320);
        ctx.drawImage(mob, 30 + mob.w * 5, 320);
        ctx.drawImage(mob, 30 + mob.w * 6, 320);
        
        var cookie = G.getEmojiSprite(`🍪`,CELLSIZE*0.4,1.1);

        ctx.drawImage(cookie, 20 + ply.w + cookie.w * 1, 320);
        ctx.drawImage(cookie, 20 + ply.w + cookie.w * 2, 320);
        ctx.drawImage(cookie, 20 + ply.w + cookie.w * 1, 360);
        ctx.drawImage(cookie, 20 + ply.w + cookie.w * 2, 360);

        return Cover;
        // document.body.append(Cover);

    }
    getMainMenuBg(canvas){
        var ctx = canvas.ctx;
        var grass = G.randomPattern('#2d7d00','#509e26',0.1,CELLSIZE,CELLSIZE);
        var cookiedim = G.Lightify(G.getEmojiSprite(`🍪`,CELLSIZE/2,1.1),0.3);
        
        var cookielocs = [];
        for(let i = 0 ; i < 50;i++){
            cookielocs.push(
                {x : G.randInt(cookiedim.w/2,canvas.w) , y : -G.randInt(CELLSIZE,CELLSIZE*4) ,}
            )
        }
        var iy = canvas.h - CELLSIZE;

        var playeranim = this.spriteEngine.playerAnimations;
        var mobsanimation = this.spriteEngine.mobAnimations;

        var mobsloc = [
            { ix : -CELLSIZE*1 , x : canvas.w+1 , y : iy, ca : 0, caf : 10, af : playeranim },
            { ix : -CELLSIZE*2 , x : canvas.w+1 , y : iy, ca : 0, caf : 10, af : mobsanimation },
            { ix : -CELLSIZE*3 , x : canvas.w+1 , y : iy, ca : 0, caf : 10, af : mobsanimation },
        ]
        function upd(t){
            canvas.fill('#000');
            canvas.fillPatern(grass);

            // ctx.clearRect(0,0,canvas.w,canvas.h);
            ctx.fillStyle = '#fff';
            ctx.fillText(t,20,20);
            
            cookielocs.forEach(c=>{
                ctx.drawImage(cookiedim,
                    c.x,c.y
                );
                c.y += G.randInt(1,CELLSIZE/4)
                if(c.y > canvas.h) c.y = -CELLSIZE;
                
            })
            mobsloc.forEach(o=>{
                if( o.x > canvas.w) o.x = o.ix;
                o.x++;
                var s = o.af[Math.floor(o.ca/o.caf)];
                o.ca++;
                if(o.ca > (o.af.length-1) * o.caf) o.ca=0;
                ctx.drawImage(s,o.x,o.y);

            })
            
            
            if(t > 10000) return;
            requestAnimationFrame((t)=>upd(t));
            setTimeout(() => {
            }, 500);
        }
        upd(0);
    }
    fortesting(){
        var canvas = G.makeCanvas(500,500);
        var cookie = new Cookie(this,{x:250,y:250});
        function update(t){
            canvas.clear();
            cookie.update(t);
            cookie.draw(canvas.ctx);
            requestAnimationFrame(update);
        }
        
        document.body.append(canvas);
        requestAnimationFrame(update);

    }
}
document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game("");
}, false);