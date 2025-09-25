let wall_textures = [];

class Level {
    static textures = [];
    static scale = 2;
    constructor(level_str) {
        let rows = level_str.trim().split("\n");
        // load level map
        this.level = new Array();
        for (let r of rows) {
            this.level.push(Array.from(r));
        }
        this.level.reverse();
        //
        this.width = this.level[0].length;
        this.height = this.level.length;
        this.x_offset = Math.round(this.width / 2);
        this.y_offset = Math.round(this.height / 2);
        this.generateWalls();
        this.positionCharacters();
    }
    getTile(x, y) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return "+"
        }
        // x = x >= this.width ? this.width - 1 : x;
        // x = x < 0 ? 0 : x;
        // y = y >= this.height ? this.height - 1 : y;
        // y = y < 0 ? 0 : y;
        if (x < 0) {
            x = this.width - x;
        };
        if (y < 0) {
            y = this.height - y;
        };
        return this.level[y][x];
    }
    isWall(x, y) {
        let r = this.getTile(x, y) == "W";
        return r;
    }
    getTexture(x, y) {
        return Level.getTexture(this, x, y);
    }
    generateWalls() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isWall(x, y)) {
                    new Wall(vec2(x - this.x_offset, y - this.y_offset).scale(Level.scale), vec2(1, 1).scale(Level.scale), this.getTexture(x, y))
                }
            }
        }
    }
    positionCharacters() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let pos = vec2(x - this.x_offset, y - this.y_offset).scale(Level.scale);
                if (this.getTile(x, y) == "C") {
                    cat.pos = pos;
                }
                if (this.getTile(x, y) == "M") {
                    mouse.pos = pos;
                }
                if (this.getTile(x, y) == "G") {
                    cheese.pos = pos;
                }
            }
        }
    }
    static getTexture(level, x, y) {
        let index = 0;
        index += (1 * level.isWall(x, y + 1));
        index += (1 * level.isWall(x + 1, y) << 1);
        index += (1 * level.isWall(x, y - 1) << 2);
        index += (1 * level.isWall(x - 1, y) << 3);
        return Level.textures[index];
    }
    static loadWallTextures() {
        for (let y = 0.2; y < 64; y += 16) {
            for (let x = 192.2; x < 256; x += 16) {
                Level.textures.push(new TileInfo(vec2(x, y), vec2(15.6, 15.6)));
            }
        }
    }
}

///////////////LEVELS///////////////
const levels = [

    `
WWWWWWWWW
W++W++C+W
W+++++++W
WM++WW++W
W+++WW+GW
WWWWWWWWW
`,

]