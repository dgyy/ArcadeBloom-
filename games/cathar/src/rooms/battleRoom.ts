import {imageAssets, randInt, TileEngine, Vector} from "kontra";
import {getBackGroundTileMap} from "../utils/tile-maps";
import {Enemy} from "../entities/enemies/enemy";
import {Timer} from "../entities/timer";
import {Reward, WeaponReward} from "../entities/reward";
import {getRewards} from "../utils/reward-util";
import Interactable from "../entities/interactable";
import {getCanvasHeight, getCanvasWidth, img, wallHeight} from "../utils/utils";
import Teleporter from "../entities/teleporter";
import StageDisplay from "../gui/stage-display";
import Pope from "../entities/enemies/pope";
import GameRoom from "./gameRoom";
import BossHealthBar from "../gui/bossHealthBar";
import WinRoom from "./winRoom";
import {Villager} from "../entities/enemies/villager";
import {Mage} from "../entities/enemies/mage";
import RewardDisplay from "../gui/reward-display";
import {spawningPattern} from "../entities/enemies/spawning-pattern";
import {Player} from "../entities/player";
import {BigDagger, Sword} from "../entities/weapons/daggers";

class BattleRoom extends GameRoom {
    level: number = 1
    inCombat = false
    reward?: Reward
    spawnTimer: Timer = new Timer(60, () => this.spawnEnemies()).start();

    constructor(reward: Reward | undefined = undefined) {
        super();
        this.reward = reward;

        const xDim = Math.ceil(getCanvasWidth() / 8)
        const yDim = Math.ceil(getCanvasHeight() / 8)

        this.gui.push(new StageDisplay(this))
        this.gui.push(new RewardDisplay(this.components.player[0]))

        this.tileEngine = TileEngine({
            tilewidth: 8,
            tileheight: 8,

            width: xDim,
            height: yDim,

            // tileset object
            tilesets: [{
                firstgid: 1,
                image: img
            }],

            // layer object
            layers: [{
                name: 'ground',
                data: getBackGroundTileMap(xDim, yDim)
            },
            ]
        });
    }


    update() {
        super.update();
        this.spawnTimer.update();

        if (this.enemies.length == 0 && this.inCombat) {
            this.clearRoom()
            this.inCombat = false;
        }
    }

    clearRoom() {
        this.spawnReward();
        this.spawnPortals();
    }

    spawnReward() {
        Player.getInstance().health += 2;
        if (this.reward) {
            const interactable = new Interactable(getCanvasWidth() / 2, getCanvasHeight() / 2, this.reward);
            interactable.setScale(2.5, 2.5);
            this.interactables.push(interactable)
        }
    }

    spawnPortals() {
        if (this.level == spawningPattern.length - 1) {
            const room = new BossRoom(new Pope(getCanvasWidth() / 2, getCanvasHeight() / 2, this))
            this.components.backgroundObjects.push(new Teleporter(getCanvasWidth() / 2, room))
            return;
        }

        if(this.level == 4){
            const dagger = new BigDagger();
            dagger.stabbingDistance = 8;
            dagger.standardDamage = 5;
            const battleRoom1 = new BattleRoom(new WeaponReward(dagger));
            battleRoom1.level = this.level + 1;
            this.components.backgroundObjects.push(new Teleporter(getCanvasWidth() / 3, battleRoom1))

            const battleRoom2 = new BattleRoom(new WeaponReward(new Sword()));
            battleRoom2.level = this.level + 1;
            this.components.backgroundObjects.push(new Teleporter(2 * getCanvasWidth() / 3, battleRoom2))
            return;
        }

        const positions = [getCanvasWidth() / 4, getCanvasWidth() / 2, 3 * getCanvasWidth() / 4]
        const rewards = getRewards(0, 3);

        for (let i = 0; i < positions.length; i++) {
            const battleRoom = new BattleRoom(rewards[i])
            battleRoom.level = this.level + 1;
            this.components.backgroundObjects.push(new Teleporter(positions[i], battleRoom))
        }
    }

    randomPosition = () => Vector(
        randInt(50, getCanvasWidth() - 50),
        randInt(wallHeight + 20, getCanvasHeight() * 0.6)
    )

    spawnEnemies() {
        const enemies = spawningPattern[this.level - 1]
        const enemyTypes = [Villager, Mage]

        enemies.forEach((num, i) => {
            const enemyClass = enemyTypes[i % 2];
            for (let j = 0; j < num; j++) {
                const pos = this.randomPosition();
                this.enemies.push(new enemyClass(pos.x, pos.y, this))
            }
        })

        this.inCombat = true;
    }
}

class BossRoom extends BattleRoom {
    boss: Enemy;

    constructor(boss: Enemy) {
        super(undefined)

        boss.setRoom(this);
        this.gui.push(new BossHealthBar(50, boss))
        this.level = spawningPattern.length
        this.boss = boss;
    }

    spawnEnemies(): void {
        this.enemies.push(this.boss);
        this.inCombat = true;
    }

    spawnPortals() {
        const winRoom = new WinRoom()
        this.components.backgroundObjects.push(new Teleporter(getCanvasWidth() / 2, winRoom))
    }
}

export default BattleRoom