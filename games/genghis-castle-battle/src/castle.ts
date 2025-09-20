import { Context } from "./canvas";
import { PlayingField } from "./playing-field";
import { Vector2 } from "./vector";

export class Castle {
    public pos = new Vector2();

    constructor(public playingField: PlayingField) {
    }

    public update(dt: number) { }
}

export class TopCastle extends Castle {
    constructor(public playingField: PlayingField) {
        super(playingField);

        this.pos.x = playingField.pos.x - 30;
        this.pos.y = playingField.pos.y;
    }

    public draw(ctx: Context) {
        const { playingField, pos: { x, y } } = this;
        const width = playingField.width + 60;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.translate(x, y);

        // side turrets
        const turretWidth = 60;
        const turretHeight = 15;
        ctx.fillStyle = '#4c6389';
        ctx.fillRect(0, -turretHeight, turretWidth, turretHeight);
        ctx.strokeRect(0, -turretHeight, turretWidth, turretHeight);
        ctx.fillRect(playingField.width, -turretHeight, turretWidth, turretHeight);
        ctx.strokeRect(playingField.width, -turretHeight, turretWidth, turretHeight);

        // center tower
        const centerTowerWidth = 120;
        const centerTowerHeight = 20;
        ctx.fillStyle = '#62758e';
        ctx.fillRect(width / 2 - centerTowerWidth / 2, -centerTowerHeight, centerTowerWidth, centerTowerHeight);
        ctx.strokeRect(width / 2 - centerTowerWidth / 2, -centerTowerHeight, centerTowerWidth, centerTowerHeight);

        // main wall
        const wallHeight = 40;
        ctx.fillStyle = '#838cad';
        ctx.fillRect(0, 0, width, wallHeight);
        ctx.strokeRect(0, 0, width, wallHeight);

        // top of wall
        const topWallHeight = 10;
        ctx.fillStyle = '#b5bcd6';
        ctx.fillRect(0, 0, width, topWallHeight);
        ctx.strokeRect(0, 0, width, topWallHeight);

        ctx.restore();
    }
}

export class BottomCastle extends Castle {
    constructor(public playingField: PlayingField) {
        super(playingField);

        this.pos.x = playingField.pos.x - 30;
        this.pos.y = playingField.height + 15;
    }

    public draw(ctx: Context) {
        const { playingField, pos: { x, y } } = this;
        const width = playingField.width + 60;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.translate(x, y);

        // main wall
        const wallHeight = 30;
        ctx.fillStyle = '#c9833e';
        ctx.fillRect(0, 0, width, wallHeight);
        ctx.strokeRect(0, 0, width, wallHeight);

        // top of wall
        const topWallHeight = 15;
        ctx.fillStyle = '#8b4736';
        ctx.fillRect(0, -topWallHeight, width, topWallHeight);
        ctx.strokeRect(0, -topWallHeight, width, topWallHeight);

        // side turrets
        const sideTurretWidth = 60;
        const sideTurretHeight = 30;
        ctx.fillStyle = '#933655';
        ctx.fillRect(0, -sideTurretHeight / 1.3, sideTurretWidth, sideTurretHeight);
        ctx.strokeRect(0, -sideTurretHeight / 1.3, sideTurretWidth, sideTurretHeight);
        ctx.fillRect(width - sideTurretWidth, -sideTurretHeight / 1.3, sideTurretWidth, sideTurretHeight);
        ctx.strokeRect(width - sideTurretWidth, -sideTurretHeight / 1.3, sideTurretWidth, sideTurretHeight);

        // side turret accents
        const accentY = -sideTurretHeight / 1.3 + sideTurretHeight
        const accentTopBuffer = 10
        const accentBottomBuffer = 2
        ctx.fillStyle = '#c13d38';
        ctx.beginPath();
        ctx.moveTo(width, accentY - accentBottomBuffer);
        ctx.lineTo(width - sideTurretWidth / 2, -sideTurretHeight + accentTopBuffer);
        ctx.lineTo(width - sideTurretWidth, accentY - accentBottomBuffer);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, accentY - accentBottomBuffer);
        ctx.lineTo(sideTurretWidth / 2, -sideTurretHeight + accentTopBuffer);
        ctx.lineTo(sideTurretWidth, accentY - accentBottomBuffer);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();

        // center tower
        const centerTowerWidth = 120
        const centerTowerHeight = 50
        ctx.fillStyle = '#933655';
        ctx.fillRect(width / 2 - centerTowerWidth / 2, -centerTowerHeight / 1.5, centerTowerWidth, centerTowerHeight);
        ctx.strokeRect(width / 2 - centerTowerWidth / 2, -centerTowerHeight / 1.5, centerTowerWidth, centerTowerHeight);

        // center tower accent
        const accentHeight = 15
        ctx.fillStyle = '#c13d38';
        ctx.moveTo(width / 2 - centerTowerWidth / 2, accentHeight);
        ctx.lineTo(width / 2 - centerTowerWidth / 4, -accentHeight);
        ctx.lineTo(width / 2 + centerTowerWidth / 4, -accentHeight);
        ctx.lineTo(width / 2 + centerTowerWidth / 2, accentHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}