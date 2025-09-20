import { Collectibles } from '@/classes/Collectibles';
import { ICollectibles, IDashPoint, IEnemies, IHazard, ILevel } from "@/model/ilevel";
import { CollisionBlock } from "@/classes/CollisionBlock";
import { Player } from "@/classes/Player";
import { Door } from "@/classes/Door";
import { createArrayFrom2D, parse2D } from "@/core/utils";
import { Animations } from "@/model/common.model";
import { Sprite } from "@/classes/Sprite";
import { Hazard } from "@/classes/Hazard";
import { LevelGenerator } from '@/classes/LevelGenerator';
import { DashPoint } from '@/classes/DashPoint';

import playerAnimationData from '@/data/playerAnimationData.json';
import doorAnimationsData from '@/data/doorAnimationData.json';
import spikesAnimationData from '@/data/spikesData.json';
import cupAnimationData from '@/data/cupAnimationData.json';
import dashPointAnimationData from '@/data/dashPointAnimationData.json'
import enemyAnimationData from '@/data/enemyAnimationData.json'
import { Enemy } from './Enemy';

export class Level {
    public levelNumber: number;
    public levelCollisions: Array<CollisionBlock>;
    public player!: Player;
    public door!: Door;
    public hazards: Array<Hazard> = [];
    public dashPoint: Array<DashPoint> = [];
    public collectibles: Array<Collectibles> = [];
    public enemies: Array<Enemy> = [];
    public backGround!: Sprite;
    public levelCollisionBlocks: Array<number> = [];

    public levelGenerator!: LevelGenerator;
    private levelKey: string;
    private collisionSymbolKey: number | undefined;
    // private backGroundSrc: string;

    private parsedCollisions: any;
    private playerPosition: DOMPoint = new DOMPoint();
    private playerSrc: string;
    private playerAnimations: Array<Animations>;

    private doorPosition: DOMPoint = new DOMPoint();
    private doorSrc: string;
    private doorAnimations: Array<Animations>;

    // private dashPointPosition: DOMPoint = new DOMPoint();
    private dashPointSrc!: string;
    private dashPointAnimations!: Array<Animations>;
    private isDashPointAvailable: boolean = false;
    private dashPointArray: Array<IDashPoint> = [];

    private enemySrc!: string;
    private enemyAnimations!: Array<Animations>;
    private isEnemyAvailable: boolean = false;
    private enemyArray: Array<IEnemies> = [];

    // private hazardPosition: DOMPoint = new DOMPoint();
    private hazardSrc!: string;
    private hazardAnimations!: Array<Animations>;
    private isHazardAvailable: boolean = false;
    private hazardArray: Array<IHazard> = [];

    // private collectiblesPosition: DOMPoint = new DOMPoint();
    private collectiblesSrc!: string;
    private collectiblesAnimations!: Array<Animations>;
    private isCollectiblesAvailable: boolean = false;
    private collectiblesArray: Array<ICollectibles> = [];
    public isCollectibleLoaded: boolean = false;

    constructor(level: ILevel, playerObj: Player) {
        this.levelNumber = level.levelNumber;
        this.levelCollisions = level.collisions;
        this.collisionSymbolKey = level.collisionsSymbolKey;
        // this.enemies = level.enemies;
        // this.backGroundSrc = level.backGroundSrc;

        this.levelKey = level.tileDataKey;

        this.playerPosition.x = level.player.positionX;
        this.playerPosition.y = level.player.positionY;
        this.playerSrc = level.player.src;
        this.playerAnimations = playerAnimationData;

        this.doorPosition.x = level.door.positionX;
        this.doorPosition.y = level.door.positionY;
        this.doorSrc = level.door.src;
        this.doorAnimations = doorAnimationsData;

        // this.dashPointPosition.x = level.dashPoints.positionX;
        // this.dashPointPosition.y = level.door.positionY;
        // this.dashPointSrc = level.door.src;
        // this.dashPointAnimations = doorAnimationsData;

        if (level.hazard && level.hazard.length > 0) {
            this.isHazardAvailable = true;
            this.hazardArray = level.hazard;
            // level.hazard.forEach((data: IHazard) => {
            //     this.hazardPosition.x = data.positionX;
            //     this.hazardPosition.y = data.positionY;
            //     this.hazardSrc = data.src;
            //     this.hazardAnimations = spikesAnimationData;

            // });
        } else this.isHazardAvailable = false;

        if (level.collectibales && level.collectibales.length > 0) {
            this.isCollectiblesAvailable = true;
            this.collectiblesArray = level.collectibales;
        } else this.isCollectiblesAvailable = false;

        if (level.dashPoints && level.dashPoints.length > 0) {
            this.isDashPointAvailable = true;
            this.dashPointArray = level.dashPoints;
        } else this.isDashPointAvailable = false;

        if (level.enemies && level.enemies.length > 0) {
            this.isEnemyAvailable = true;
            this.enemyArray = level.enemies;
        } else this.isEnemyAvailable = false;

        this.player = playerObj;
    }

    public init() {
        if (this.levelNumber) {
            this.levelGenerator = new LevelGenerator(`level${this.levelNumber}TilesData`);
            // this.levelGenerator = new LevelGenerator(this.levelKey);
            this.levelCollisionBlocks = this.levelGenerator.collisions;
            this.levelGenerator.draw();
        }

        this.parsedCollisions = parse2D(this.levelCollisionBlocks);
        this.levelCollisions = createArrayFrom2D(this.parsedCollisions, this.collisionSymbolKey);
        this.player.collisionBlocks = this.levelCollisions;

        this.player.dieCallCounter = 0;

        this.player.position.x = this.playerPosition.x;
        this.player.position.y = this.playerPosition.y;

        // this.player = new Player(this.levelCollisions, this.playerPosition, this.playerSrc, this.playerAnimations, 3, 5);

        if (this.player.currentAnimation) {
            this.player.currentAnimation.isActive = false;
        }

        // this.backGround = new Sprite(new DOMPoint(0, 0), this.backGroundSrc);

        this.door = new Door(this.doorPosition, this.doorSrc, this.player, this.doorAnimations);

        if (this.isHazardAvailable) {
            this.hazardArray.forEach((data: IHazard) => {
                // this.hazardPosition.x = data.positionX;
                // this.hazardPosition.y = data.positionY;

                const hazardPosition: DOMPoint = new DOMPoint(data.positionX, data.positionY);

                this.hazardSrc = data.src;
                this.hazardAnimations = spikesAnimationData;
                let hazardObj = new Hazard(hazardPosition, this.hazardSrc, this.player, this.hazardAnimations);
                this.hazards.push(hazardObj);

            });
        }

        if (this.isCollectiblesAvailable && !this.isCollectibleLoaded) {
            this.collectibles = [];
            this.collectiblesArray.forEach((data: ICollectibles, index) => {
                const collectiblesPosition: DOMPoint = new DOMPoint(data.positionX, data.positionY);

                this.collectiblesSrc = data.src;
                this.collectiblesAnimations = cupAnimationData;
                let collisionsObj = new Collectibles(collectiblesPosition, this.collectiblesSrc, this.player, this.collectiblesAnimations);
                collisionsObj.name = 'collectibles_' + index;
                this.collectibles.push(collisionsObj);
            });
        }

        if (this.isDashPointAvailable) {
            this.dashPoint = [];
            this.dashPointArray.forEach((data: IDashPoint, index) => {

                const dashPointPosition: DOMPoint = new DOMPoint(data.positionX, data.positionY);

                this.dashPointSrc = data.src;
                this.dashPointAnimations = dashPointAnimationData;
                let dashPointObject = new DashPoint(dashPointPosition, this.dashPointSrc, this.player, this.dashPointAnimations);
                dashPointObject.name = 'dash_point_' + index;
                this.dashPoint.push(dashPointObject);

            });
        }

        if (this.isEnemyAvailable) {
            this.enemies = [];
            this.enemyArray.forEach((data: IEnemies, index) => {

                const enemyPosition: DOMPoint = new DOMPoint(data.positionX, data.positionY);

                this.enemySrc = data.src;
                this.enemyAnimations = enemyAnimationData;
                let enemyObject = new Enemy(enemyPosition, this.enemySrc, this.player, this.enemyAnimations);
                enemyObject.moveLength = data.moveLength;
                enemyObject.waitAtEnd = data.waitAtEndTime;
                enemyObject.canMove = data.canMove;
                enemyObject.isMoveHorzontal = data.isMoveHorzontal;
                enemyObject.isMoveVertical = data.isMoveVertical;
                enemyObject.startPositionX = data.positionX;
                enemyObject.startPositionY = data.positionY;
                enemyObject.moveSpeed = data.moveSpeed;
                enemyObject.name = 'enemy_' + index;

                this.enemies.push(enemyObject);

            });
        }

    }

    public loadGameLevel() {
        // this.backGround.draw();
        this.levelGenerator.draw();
        this.door.draw();
        this.door.update();

        if (this.isHazardAvailable) {
            this.hazards.forEach((hazard: Hazard) => {
                // hazard.playAnimation('spikes',true);
                hazard.draw();
                if (this.player.isAlive)
                    hazard.update();
            });
        }

        if (this.isCollectiblesAvailable && this.collectibles && this.collectibles.length > 0) {
            this.collectibles.forEach((collectible: Collectibles) => {
                collectible.draw();
                collectible.update();
            });
        }

        if (this.isDashPointAvailable) {
            this.dashPoint.forEach((dpoint: DashPoint) => {
                dpoint.draw();
                dpoint.update();
            });
        }

        if (this.isEnemyAvailable) {
            this.enemies.forEach((enemy: Enemy) => {
                enemy.draw();
                enemy.update();
            });
        }

        this.levelCollisions.forEach((block: CollisionBlock) => {
            block.draw();
        })
        this.player.draw();
        this.player.update();
    }
}
