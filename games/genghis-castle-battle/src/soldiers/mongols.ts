import { Context } from "../canvas";
import { Duration } from "../duration";
import { Soldier, SoldierPalette, SoldierRank, SoldierType } from "./soldier";

const colors: { [key in SoldierRank]: SoldierPalette } = {
    [SoldierRank.BASE]: {
        main: '#794100',
        accent: '#c37100',
        skin: '#ffdba2'
    },
    [SoldierRank.UPGRADED]: {
        main: '#004391',
        accent: '#264044',
        skin: '#ffdba2'
    },
    [SoldierRank.ELITE]: {
        main: '#000000',
        accent: '#880000',
        skin: '#ffdba2'
    }
};

export class MongolSoldier extends Soldier {
    public name = 'Foot Soldier';
    public type = SoldierType.MELEE;
    public cost = 1;
    public upgradeCost = 2;
    public healCost = 1;

    public attack = 1;
    public speed = .4;
    public maxHealth = 4;
    public health = this.maxHealth;
    public attackRange = 50;
    public attackRate = new Duration(1000);

    public goldValue = 1;

    public animateMeleeAttack(ctx: Context) {
        if (this.meleeAttack && this.target) {
            ctx.save();
            ctx.fillStyle = 'white';

            const offset = this.meleeAttackFrames - (this.meleeAttack * 2);
            const offsetRadians = offset * (0.0174533 * 2);
            ctx.translate(this.pos.x, this.pos.y);
            if (this.target.pos.x < this.pos.x) {
                ctx.rotate(this.attackAngle - offsetRadians);
            } else {
                ctx.rotate(this.attackAngle + offsetRadians);
            }
            ctx.lineWidth = 2;
            ctx.fillStyle = 'black';
            ctx.moveTo(0, 0);
            ctx.lineTo(this.attackRange - this.width, 0);
            ctx.stroke();
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(this.attackRange - this.width, 0, this.width / 3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    public draw(ctx: Context) {
        const { x, y } = this.pos;
        this.drawHealthBar(ctx);
        this.animateMeleeAttack(ctx);

        ctx.save();
        ctx.translate(x, y);

        ctx.lineWidth = 2;

        // helmet spike
        ctx.beginPath();
        ctx.arc(0, -this.height, this.width / 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fill();
        ctx.stroke();

        // helmet arc
        ctx.beginPath();
        ctx.arc(0, 0, this.width, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fill();
        ctx.stroke();

        // helmet visor
        ctx.fillStyle = colors[this.rank].main;
        ctx.fillRect(-this.width, -this.height / 2, this.width * 2, this.height / 2);
        ctx.strokeRect(-this.width, -this.height / 2, this.width * 2, this.height / 2);

        // face
        ctx.beginPath();
        ctx.arc(0, 0, this.width, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].skin;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        super.draw(ctx);
    }

    public upgrade(): void {
        super.upgrade();

        if (this.rank === SoldierRank.UPGRADED) {
            this.speed += .25;
            this.health += 1;
        }

        if (this.rank === SoldierRank.ELITE) {
            this.attack += .2;
        }
    }
}

export class MongolHorseArcher extends Soldier {
    public name = 'Horse Archer';
    public type = SoldierType.RANGED;
    public cost = 8;
    public upgradeCost = 4;
    public healCost = 2;

    public goldValue = 2;

    public attack = 1;
    public speed = .8;
    public maxHealth = 4;
    public health = this.maxHealth;
    public attackRange = 180;
    public attackRate = new Duration(1000);

    public draw(ctx: Context) {
        const { x, y } = this.pos;

        this.drawHealthBar(ctx);

        ctx.save();
        ctx.translate(x, y);

        ctx.lineWidth = 2;

        // helmet spike
        ctx.beginPath();
        ctx.ellipse(0, -this.height, this.width / 3, this.height / 4, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fill();
        ctx.stroke();

        // helmet arc
        ctx.beginPath();
        ctx.arc(0, 0, this.width, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].main;
        ctx.fill();
        ctx.stroke();

        // face
        ctx.beginPath();
        ctx.arc(0, 0, this.width, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].skin;
        ctx.fill();
        ctx.stroke();

        // helmet visor
        ctx.beginPath();
        ctx.moveTo(-this.width, -this.height / 2);
        ctx.lineTo(-this.width, 0);
        ctx.lineTo(0, this.height / 3);
        ctx.lineTo(this.width, 0);
        ctx.lineTo(this.width, -this.height / 2);
        ctx.lineTo(0, -this.height / 4);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        super.draw(ctx);
    }

    public upgrade(): void {
        super.upgrade();

        if (this.rank === SoldierRank.UPGRADED) {
            this.speed += .10;
            this.attackRange += 20;
        }

        if (this.rank === SoldierRank.ELITE) {
            this.attack += 1;
        }
    }
}

export class MongolHorseMan extends Soldier {
    public name = 'Mounted Knight';
    public type = SoldierType.MOUNTED;
    public cost = 4;
    public upgradeCost = 3;
    public healCost = 3;

    public goldValue = 3;

    public attack = 2;
    public speed = .7;
    public maxHealth = 7;
    public health = this.maxHealth;
    public attackRange = 60;
    public attackRate = new Duration(1000);

    public draw(ctx: Context) {
        const { x, y } = this.pos;
        this.drawHealthBar(ctx);

        this.animateMeleeAttack(ctx);

        ctx.save();
        ctx.translate(x, y);

        ctx.lineWidth = 2;

        // helmet spike
        ctx.beginPath();
        ctx.ellipse(0, -this.height, this.width / 5, this.height / 3, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fill();
        ctx.stroke();

        // helmet arc
        ctx.beginPath();
        ctx.arc(0, 0, this.width, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].main;
        ctx.fill();
        ctx.stroke();

        // cape
        ctx.beginPath();
        ctx.moveTo(-this.width * 1.25, this.height / 1.5);
        ctx.lineTo(-this.width, -this.height / 3);
        ctx.lineTo(this.width, -this.height / 3);
        ctx.lineTo(this.width * 1.25, this.height / 1.5);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].main;
        ctx.fill();
        ctx.stroke();

        // helmet visor
        ctx.fillStyle = colors[this.rank].accent;
        ctx.fillRect(-this.width, -this.height / 2, this.width * 2, this.height / 2);
        ctx.strokeRect(-this.width, -this.height / 2, this.width * 2, this.height / 2);

        // face
        ctx.beginPath();
        ctx.arc(0, 0, this.width, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = colors[this.rank].skin;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        super.draw(ctx);
    }

    public upgrade(): void {
        super.upgrade();

        if (this.rank === SoldierRank.UPGRADED) {
            this.speed += .25;
            this.attack + 1;
        }

        if (this.rank === SoldierRank.ELITE) {
            this.health += 3;
        }
    }
}