/**
  BSD 3-Clause License
  
  Copyright (c) 2023, JOHN SWANA
  
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
  
  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
  
  2. Redistributions in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.
  
  3. Neither the name of the copyright holder nor the names of its
     contributors may be used to endorse or promote products derived from
     this software without specific prior written permission.
  
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import '../main.css';
import { List, Item } from 'linked-list';
import { init, initInput, ButtonClass, TileEngine, initKeys, keyPressed } from 'kontra';
import { zzfxM, zzfx } from '../lib/zzfxm';
import sound_track from '../assets/sound_track.js'
import tileset_packed from '../assets/tilemap_packed_compact_tileset.png';
import tilemap from '../assets/tilemap_packed_compact_tilemap.json';

const tileset = new Image();
let tileEngine;
let canvas, context, width, height;

const fontSize = 14,
    largeFontSize = 24,
    x = 0,
    y = 0,
    margin = 7,
    lineHeight = 1.2;

const fontFamily = 'Arial, sans-serif';
const font = `bold italic ${fontSize}px ${fontFamily}`;
const largeFont = `italic bold ${largeFontSize}px ${fontFamily}`;

const background = 'rgb(132, 198, 105)';
const overlay = 'rgba(0, 0, 0, 0.15)';
const light = 'rgb(251, 251, 251)';
const dark = 'rgb(51, 51, 51)';
const red = 'rgb(251, 51, 51)';
const blue = 'rgb(105, 132, 198)';

const fortuneList = [
    'Fishing is a dirty game\nBut someone has to do it!', // @dragonEnergy
    'My little mermaid',
    'Time Attack!',
    'Use them wisely',
    "There's plenty fish in the sea",
    "Don't count your fish\nbefore they're caught!",
    'Like a fish needs water',
    'Fish or cut bait',
    "Every fish has It's day"
];

const randomArrayElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const imFeelingLucky = () => `"${randomArrayElement(fortuneList)}"`;

const isMobile = () => navigator.userAgent.match(/Mobile|Android/);

let isSound = false;
const sfx1 = () => isSound && zzfx(...[, , 539, 0, .04, .29, 1, 1.92, , , 567, .02, .02, , , , .04]);
const sfx2 = () => isSound && zzfx(...[, , 333, .01, 0, .9, 4, 1.9, , , , , , .5, , .6]);
const sfx3 = () => isSound && zzfx(...[, , 80, .3, .4, .7, 2, .1, -0.73, 3.42, -430, .09, .17, , , , .19]);
const sfx4 = () => isSound && zzfx(...[, , 528, .01, , .48, , .6, -11.6, , , , .32, 4.2]);

const guide = `Hint:
Move the hook above the fish to bait.
use arrow keys to maintain...
acceleration of the hook.
fishing is about patience. enjoy`;

class Slide extends Item {
    constructor(color = background) {
        super();
        this.color = color;
    }
    clear() {
        context.clearRect(x, y, width, height);
        context.fillStyle = this.color;
        context.fillRect(x, y, width, height);
    }
    update() {}
    render() {
        this.clear();
    }
}

class HeaderSlide extends Slide {
    render() {
        context.fillStyle = overlay;
        context.fillRect(x, y, width, height / 5);
    }
}

class TextButton extends ButtonClass {
    constructor(text, x, y) {
        super({ x, y, text: { text, font: font } });
    }
    render() {
        if (this.hovered) {
            canvas.style.cursor = 'pointer';
            this.textNode.color = red;
        } else {
            this.textNode.color = light;
        }
        if (this.disabled)
            this.textNode.color = dark;
        super.render();
    }
}

class WindowHeaderSlide extends HeaderSlide {
    constructor(text) {
        super();
        this.text = text;
        this.xBtn = new TextButton('x', width - (fontSize + margin), margin);
    }
    render() {
        this.clear();
        super.render();
        this.xBtn.render();
        context.save();
        context.translate(margin, (height / 5) + fontSize);
        context.font = font;
        context.fillStyle = light;
        this.text.split(/\n/).forEach((text, index) => {
            context.fillText(text, x, index * (fontSize * lineHeight));
        });
        context.restore();
    }
}

class ConfirmWindow extends WindowHeaderSlide {
    constructor(text, yAct, nAct) {
        super(text);
        this.yAct = yAct;
        this.nAct = nAct;
        this.yBtn = new TextButton('YES', width / 5, height / 1.5);
        this.nBtn = new TextButton('NO', width / 1.25, height / 1.5);
    }
    update() {
        super.update();
        this.yBtn.update();
        this.nBtn.update();
        if (this.yBtn.pressed) {
            this.yAct();
            return;
        }
        if (this.nBtn.pressed || this.xBtn.pressed) {
            this.nAct();
        }
    }
    render() {
        super.render();
        this.yBtn.render();
        this.nBtn.render();
    }
}

class LoadingWindow extends WindowHeaderSlide {
    constructor(text, dur = 3000) {
        super(text);
        this.timer = new Timer(dur);
    }
    update() {
        super.update();
        this.timer.update();
    }
    render() {
        super.render();
        context.save();
        context.translate(margin, height / 1.25);
        context.lineWidth = 4;
        context.strokeStyle = overlay;
        context.fillStyle = light;
        context.fillRect(x, y, width - fontSize, 16);
        context.strokeRect(x, y, width - fontSize, 16);
        context.fillStyle = red;
        context.fillRect(4, 4, (width - fontSize - 8) * this.timer.phita, 8);
        context.restore();
    }
}

class Timer {
    constructor(dur) {
        this.phita = 0;
        this.dur = dur;
        this.before = performance.now();
        this.after = this.before;
    }
    update() {
        this.after = performance.now();
        this.phita = Math.min((this.after - this.before) / this.dur, 1);
    }
}

class Fade extends Slide {
    constructor(dur = 500) {
        super();
        this.timer = new Timer(dur);
    }
    update() { this.timer.update(); }
    render() {
        super.render();
        context.save();
        context.globalAlpha = this.timer.phita <= 0.5 ? this.timer.phita : 1 - this.timer.phita;
        context.fillStyle = light;
        context.fillRect(x, y, width, height);
        context.restore();
    }
}

class Presentation extends List {
    append(slide) {
        const curr = new Slide();
        const fade = new Fade();
        curr.update = () => {
            fade.update();
            if (fade.timer.phita == 1) {
                const next = super.append(slide);
                this.head = next;
                sfx1();
            }
        };
        curr.render = () => fade.render();
        return super.append(curr);
    }
}

class LoadingScreen extends LoadingWindow {
    constructor(text, next) {
        super(text);
        this.nextSlide = next;
    }
    update() {
        super.update();
        if (this.timer.phita == 1 || this.xBtn.pressed || keyPressed('x')) {
            const next = presentation.append(this.nextSlide());
            presentation.head = next;
        }
    }
}

class TitleTextDialog extends WindowHeaderSlide {
    update() {
        super.update();
        if (this.xBtn.pressed) {
            const next = presentation.append(new Title());
            presentation.head = next;
        }
    }
}

class Title extends Slide {
    constructor() {
        super();
        this.text = 'Trench fisher';
        this.dests = ['start', 'help', 'about', 'version']
            .map(function (dest, index) {
                const x = width / 3,
                    y = (height / 3) + index * fontSize * lineHeight;
                return new TextButton(` ${dest}`, x, y);
            });
        this.timer = new Timer(3000);
        const transition = () => {
            this.timer.update();
            tileEngine.sy = (10) - ((10) * this.timer.phita);
            if (this.timer.phita < 1)
                requestAnimationFrame(transition);
        };
        transition();
    }
    update() {
        super.update();
        const handleTextDialog = (text) => {
            const next = presentation.append(new TitleTextDialog(text));
            presentation.head = next;
        };
        const HandleStart = () => {
            const next = presentation.append(new WorldMap());
            presentation.head = next;
        };
        const [startButton, helpButton, aboutButton, versionButton] = this.dests;
        if (startButton.pressed) {
            HandleStart();
        } else if (helpButton.pressed) {
            handleTextDialog(`controls:\n  ArrowLeft: Left dir key\n  ArrowRight: Right dir key`);
        } else if (aboutButton.pressed) {
            handleTextDialog(`author: john swana`);
        } else if (versionButton.pressed) {
            handleTextDialog(`version: 1.0`);
        }
    }
    render() {
        super.render();
        tileEngine.renderLayer('layer-6');
        context.save();
        context.fillStyle = overlay;
        context.fillRect(x, y, width, height);
        context.translate(width / 4, (height / 3) - margin);
        context.fillStyle = red;
        context.font = largeFont;
        context.textBaseline = 'bottom';
        context.strokeStyle = dark;
        context.lineWidth = 2;
        context.strokeText(this.text, x, y);
        context.fillText(this.text, x, y);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(this.timer.phita * 150, y);
        context.closePath();
        context.strokeStyle = red;
        context.lineWidth = 2;
        context.stroke();
        context.restore();
        this.dests.forEach(dest => dest.render());
    }
}

class WorldMapHeaderSlide extends HeaderSlide {
    constructor(text) {
        super();
        this.text = text;
        this.xBtn = new TextButton('x', width - (fontSize + margin), margin);
    }
    render() {
        super.render();
        this.xBtn.render();
        context.font = font;
        context.fillStyle = light;
        context.textBaseline = 'top';
        context.fillText(this.text, margin, margin);
    }
}

const locations = [
        { row: 2, col: 3, data: { name: 'crocodile island' } },
        { row: 7, col: 4, data: { name: 'zambezi' } },
        { row: 8, col: 8, data: { name: 'boiling pot' } },
        { row: 8, col: 12, data: { name: 'baobab island' } },
        { row: 4, col: 13, data: { name: 'falty rocks' } },
        { row: 8, col: 17, data: { name: 'tranquil isle' } },
        { row: 3, col: 15, data: { name: 'Mosi-oa-Tunya' } },
        { row: 3, col: 5, data: { name: 'devils pool' } },
    ]
    .map((location, index) => {
        location.data.id = index + 1;
        location.data.state = new Map([
            ['score', 0]
        ]);
        return location;
    });

class MapLabel extends TextButton {
    constructor(text, row, col, data) {
        const x = col * 16;
        const y = row * 16;
        super(text, x, y);
        this.data = data;
    }
    update() {
        super.update();
        if (this.pressed) {
            const next = presentation.append(new LoadingScreen(imFeelingLucky(), () => new MapLocation(this.data)));
            presentation.head = next;
        }
    }
}

class WorldMap extends WorldMapHeaderSlide {
    constructor() {
        super('WorldMap');
        this.labels = locations.map((location, index, locations) => {
            const label = new MapLabel(`${location.data.id}.`, location.row, location.col, location.data);
            if (locations[index - 1] != null && locations[index - 1].data.state.get('score') < 10)
                label.disabled = true;
            return label;
        });
    }
    update() {
        super.update();
        if (this.xBtn.pressed) {
            const next = presentation.append(new Title());
            presentation.head = next;
        }
        this.labels.forEach(label => label.update());
    }
    render() {
        super.clear();
        tileEngine.renderLayer('layer-2');
        this.labels.forEach(label => {
            context.save();
            context.translate(x, Math.random() - 0.5);
            label.render();
            context.restore();
        });
        super.render();
    }
}

class Hud {
    constructor(state) {
        this.state = state;
    }
    render() {
        context.font = font;
        context.fillStyle = light;
        context.textBaseline = 'top';
        const text = Array.from(this.state.entries()).map(entry => entry.join(': ')).join(' ');
        context.fillText(text, margin, margin);
    }
}

class LocationHeaderSlide extends HeaderSlide {
    constructor(text) {
        super();
        this.text = text;
        this.xBtn = new TextButton('x', width - (fontSize + margin), margin);
    }
    render() {
        super.render();
        this.xBtn.render();
        context.font = font;
        context.fillStyle = light;
        context.fillText(this.text, margin, (height / 5) + fontSize);
    }
}

const subLocations = [
    { row: 4, col: 4, data: {} },
    { row: 5, col: 16, data: {} },
];

class LocationLabel extends MapLabel {
    constructor(text, row, col, data) {
        super(text, row, col);
        this.data = data;
    }
    update() {
        if (this.pressed) {
            const next = new LevelLoadingScreen(guide, () => presentation.append(new FirstLevel('fishing spot', this.data, width / 1.5), 3000));
            presentation.head = next;
        }
    }
}

class MapLocation extends LocationHeaderSlide {
    constructor(data) {
        super(`"${data.name}"`);
        this.data = data;
        this.hud = new Hud(this.data.state);
        this.labels = subLocations.map(({ row, col }, index, subLocations) => {
            const label = new LocationLabel(`${index + 1}.`, row, col, this.data);
            if (subLocations[index - 1] && this.data.state.get('score') < 5)
                label.disabled = true;
            return label;
        });
    }
    update() {
        super.update();
        if (this.xBtn.pressed) {
            const next = presentation.append(new LoadingScreen(imFeelingLucky(), () => new WorldMap()));
            presentation.head = next;
        }
        this.labels.forEach(label => label.update());
    }
    render() {
        super.clear();
        tileEngine.renderLayer('layer-4');
        this.labels.forEach(label => {
            context.save();
            context.translate(x, Math.random() - 0.5);
            label.render();
            context.restore();
        });
        super.render();
        this.hud.render();
    }
}

class GamePadButton extends ButtonClass {
    constructor(text, x, y) {
        super({ x, y, anchor: { x: 0.5, y: 0.5 }, text: { text, color: light, anchor: { x: 0.5, y: 0.5 }, font: largeFont } });
    }
    render() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, largeFontSize * 0.80, Math.PI * 2, 0);
        context.closePath();
        context.fillStyle = overlay;
        context.fill();
        super.render();
    }
}

class LevelLoadingScreen extends WindowHeaderSlide {
    constructor(text, nextSlide, dur = 3000) {
        super(text);
        this.timer = new Timer(dur);
        this.nextSlide = nextSlide;
    }
    update() {
        super.update();
        this.timer.update();
        if (this.timer.phita == 1 || this.xBtn.pressed || keyPressed('x')) {
            ;
            const next = presentation.append(this.nextSlide());
            presentation.head = next;
        }
    }
}

class World {
    constructor(width, ...bodies) {
        this.bodies = [...bodies];
        this.width = width;
    }
    update(elapsed, delta) {
        this.bodies.forEach(body => {
            body.update(elapsed, delta);
            if (body.pos < 0) {
                body.pos = 0;
                body.vel = 0;
            }
            if (body.pos > this.width) {
                body.pos = this.width;
                body.vel = 0;
            }
        });
    }
}

class Level extends LocationHeaderSlide {
    constructor(text, data) {
        super(text);
        this.data = data;
        this.hud = new Hud(data.state);
        this.progress = 0;
        this.yBtn = new GamePadButton('⟨', 24, height - 24, 24);
        this.nBtn = new GamePadButton('⟩', width - 24, height - 24, 24);
        this.dur = 30000;
        this.barW = width / 4;
        this.timer = new Timer(this.dur);
    }
    update() {
        super.update();
        this.timer.update();
        const score = this.hud.state.get('score');
        this.hud.state.clear();
        this.hud.state.set('score', score);
        if (this.xBtn.pressed) {
            const next = presentation.prepend(new LevelLoadingScreen('Saving progress...', () => new MapLocation(this.data)));
            presentation.head = next;
            sfx4();
            return;
        }
        if (this.timer.phita == 1) {
            const next = presentation.prepend(new LevelLoadingScreen('Game Over!', () => new MapLocation(this.data)));
            presentation.head = next;
            sfx2();
            return;
        }
        this.hud.state.set('progress', `${Math.round(this.progress * 100)}%`);
        this.hud.state.set('time', `00:${Math.round((1 - this.timer.phita) * (this.dur / 1000)).toString().padStart(2, 0)}`);
    }
    render() {
        super.render();
        tileEngine.renderLayer('layer-6');
        if (isMobile()) {
            context.fillStyle = overlay;
            const offsetY = (height / 1.5) - margin;
            context.fillRect(x, offsetY, width, height - offsetY);
            this.yBtn.render();
            this.nBtn.render();
        }
    }
}

class Body {
    constructor(pos) {
        this.pos = pos;
        this.vel = 0;
        this.accel = 0;
        this.dir = 1;
    }
    update(elapsed, delta) {
        this.vel += (this.accel * delta) * this.dir;
        this.pos += this.vel * delta;
        if (this.pos < 0 || this.pos > width / 4)
            this.dir *= -1;
    }
}

class Fish extends Body {
    constructor(type, pos) {
        super(pos);
        Object.assign(this, type);
    }
}

const fishTypes = [
    { name: "Tigerfish", accel: 32 },
    { name: "Vundu", accel: 24 },
    { name: "bream", accel: 12 },
    { name: "Tilapia", accel: 22 },
    { name: "pike", accel: 24 },
    { name: "catfish", accel: 40 },
];

class FirstLevel extends Level {
    constructor(text, data, rodX) {
        super(text, data);
        this.hook = new Body(width / 2);
        this.hook.hooked = false;
        this.rodX = rodX;
        this.nextLevel = () => {
            data.rodX = this.rodX;
            const score = this.hud.state.get('score');
            this.hud.state.clear();
            this.hud.state.set('score', score + 5);
            const next = presentation.prepend(new LevelLoadingScreen(`you caught a "${this.target.name}"`, () => new MapLocation(this.data)));
            presentation.head = next;
            sfx3();
        };
        this.offset = (width - this.barW) / 2;
        const type = randomArrayElement(fishTypes);
        this.target = new Fish(type, this.barW / 2);
        this.world = new World(this.barW, this.target, this.hook);
    }
    update(elapsed, delta) {
        const disp = 100;
        let dir = 0;
        if (this.yBtn.pressed || keyPressed('arrowleft'))
            dir -= 1;
        if (this.nBtn.pressed || keyPressed('arrowright'))
            dir += 1;
        this.hook.accel = disp;
        this.hook.dir = dir;
        this.world.update(elapsed, delta);
        if (Math.abs(this.hook.pos - (this.target.pos)) < this.barW / 8) {
            this.hook.hooked = true;
            this.progress += delta / 15;
        } else {
            this.hook.hooked = false;
        }
        if (this.progress >= 1) {
            this.nextLevel();
            return;
        }
        super.update();
    }
    render() {
        super.clear();
        super.render();
        this.hud.render();
        context.save();
        context.beginPath();
        context.moveTo(this.rodX, height / 2);
        context.lineTo(width / 2, height / 3);
        context.translate(this.offset, y);
        context.fillStyle = blue;
        context.fillRect(x, height / 1.25, this.barW, 8);
        context.save();
        context.translate(this.hook.pos, height / 1.25);
        context.lineTo(x, y);
        context.fillStyle = this.hook.hooked ? red : overlay;
        context.fillRect(x - 8, y, 16, 8);
        context.drawImage(tileset, 5 * 16, 2 * 16, 16, 16, x - 4, y, 8, 8);
        context.restore();
        context.translate(this.target.pos, height / 1.25);
        context.moveTo(x, y);
        context.scale((this.target.dir / -2), 1);
        context.drawImage(tileset, 4 * 16, 0 * 16, 16, 16, x, y, 16, 16);
        context.closePath();
        context.strokeStyle = red;
        context.stroke();
        context.restore();
    }
}

const presentation = new Presentation();
let delta;
let elapsed;
let previous;
let next;
const animation = () => {
    next = performance.now();
    previous = previous || next;
    delta = next - previous;
    elapsed += delta;
    previous = next;
    delta /= 1000;
    requestAnimationFrame(animation);
    canvas.style.cursor = 'initial';
    presentation.head.update(elapsed, delta);
    presentation.head.render(elapsed, delta);
};

window.addEventListener('DOMContentLoaded', function () {
    const viewport = init();
    canvas = viewport.canvas;
    context = viewport.context;
    width = canvas.width = 300,
        height = canvas.height = 150;

    initInput();
    initKeys();

    tileset.onload = function () {
        tileEngine = new TileEngine(Object.assign(tilemap, {
            tilesets: [{
                "firstgid": 1,
                "image": tileset
            }]
        }));

        const start = () => {
            const next = presentation.append(new LoadingScreen('Loading', () => new Title()));
            presentation.head = next;
        };

        presentation.head = presentation.prepend(new ConfirmWindow('Do you want sound?', () => {
            isSound = true;
            const node = zzfxP(...buffer);
            node.loop = true;
            start();
        }, start));

        animation();
    };
    tileset.src = tileset_packed;

    const buffer = zzfxM(...sound_track);
});
