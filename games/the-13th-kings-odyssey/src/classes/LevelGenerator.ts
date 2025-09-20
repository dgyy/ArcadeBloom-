import { drawEngine } from '@/core/draw-engine';
import { ILevelGen } from '@/model/ilevelGen';

import levelTileData from '@/data/levelTilesData.json'
import { BACK_GROUND, OBJECT_TILES, PLATFORM_TILES } from '@/constants/game-conts';
import { parse2D, collisions } from '@/core/utils';

export class LevelGenerator {

    protected buffer: CanvasRenderingContext2D;
    protected tileData: ILevelGen;
    protected tileDataArray: Array<ILevelGen>;
    protected tileSize: number;
    protected tileColumns: number;
    protected tileRows: number;
    protected mapWidth: number
    protected mapHeight: number;

    protected platformData: Array<number>;
    protected isPlatformTileLoaded: boolean = false;
    protected platformTileSheetImage: HTMLImageElement;
    protected platformSheetColCount: number;
    protected platformSpriteStartingIndex: number;

    protected bgData: Array<number>;
    protected backGroundTileImage: HTMLImageElement;
    protected isBGTileLoaded: boolean = false;
    protected bgSheetColCount: number;
    protected bgSpriteStartingIndex: number;

    protected objectData: Array<number>;
    protected isObjectTileLoaded: boolean = false;
    protected objectTileImage: HTMLImageElement;
    protected objectSheetColCount: number;
    protected objectSpriteStartingIndex: number;

    public collisions: Array<number>;



    constructor(tileDataKey: string) {
        this.buffer = drawEngine.getBuffer();
        this.tileDataArray = levelTileData;
        this.tileData = this.tileDataArray.find((dataObj: ILevelGen) => dataObj.key === tileDataKey) as ILevelGen;

        this.platformData = this.tileData.platform.data;
        this.bgData = this.tileData.backGround.data;
        this.objectData = this.tileData.objectsTiles.data;

        // Background tiles setup.
        this.backGroundTileImage = new Image();
        this.backGroundTileImage.src = this.tileData.backGround.spriteSrc;
        this.backGroundTileImage.onload = () => {
            if (!this.backGroundTileImage) return;
            this.isBGTileLoaded = true;
        }
        this.bgSheetColCount = this.tileData.backGround.tileSheetColumns;
        this.bgSpriteStartingIndex = this.tileData.backGround.tileIndexStart;

        // Platform tiles setup.
        this.platformTileSheetImage = new Image();
        this.platformTileSheetImage.src = this.tileData.platform.spriteSrc;
        this.platformTileSheetImage.onload = () => {
            if (!this.platformTileSheetImage) return;
            this.isPlatformTileLoaded = true;
        }
        this.platformSheetColCount = this.tileData.platform.tileSheetColumns;
        this.platformSpriteStartingIndex = this.tileData.platform.tileIndexStart;

        // Object tiles setup.
        this.objectTileImage = new Image();
        this.objectTileImage.src = this.tileData.objectsTiles.spriteSrc;

        this.objectTileImage.onload = () => {
            if (!this.objectTileImage) return;
            this.isObjectTileLoaded = true;
        }
        this.objectSpriteStartingIndex = this.tileData.objectsTiles.tileIndexStart;
        this.objectSheetColCount = this.tileData.objectsTiles.tileSheetColumns;


        this.tileSize = this.tileData.tileSize;
        this.tileColumns = this.tileData.width;
        this.tileRows = this.tileData.height;

        this.mapWidth = this.tileData.width * this.tileData.tileSize;
        this.mapHeight = this.tileData.height * this.tileData.tileSize;

        this.collisions = this.tileData.collision;
    }

    // This will calculate the tile's source position in the tile sheet given the number of columns in the tile sheet and the index of the tile in the tile sheet.
    protected calculateTileSourcePosition(tileIndex: number, tileSheetColumns: number, tileType: string) {
        let tileStartingIndex: number = 0;
        if (tileType === BACK_GROUND) {
            tileStartingIndex = this.bgSpriteStartingIndex;
        } else if (tileType === OBJECT_TILES) {
            tileStartingIndex = this.objectSpriteStartingIndex;
        } else if (tileType === PLATFORM_TILES) {
            tileStartingIndex = this.platformSpriteStartingIndex;
        }
        let index = tileIndex - tileStartingIndex;
        let xPos = index % tileSheetColumns * this.tileSize;
        let yPos = Math.floor(index / tileSheetColumns) * this.tileSize;

        return new DOMPoint(xPos, yPos);
        // return {
        //     x: xPos,
        //     y: yPos
        // };
    }

    protected renderTiles(tileType: string) {
        let tileMapData: Array<number> = [];

        if (tileType === PLATFORM_TILES) {
            tileMapData = this.platformData;
        } else if (tileType === BACK_GROUND) {
            tileMapData = this.bgData;
        } else if (tileType === OBJECT_TILES) {
            tileMapData = this.objectData;
        }

        const map2DArray = parse2D(tileMapData);
        // console.log(map2DArray);

        for (let mapRow = 0; mapRow < this.tileRows; mapRow++) {
            for (let mapColumn = 0; mapColumn < this.tileColumns; mapColumn++) {
                const tileValue = map2DArray[mapRow][mapColumn];

                let tileSourcePosition: DOMPoint = new DOMPoint();
                let displayTile: HTMLImageElement = new Image();

                if (tileValue === 0) continue;

                if (tileType === BACK_GROUND) {
                    displayTile = this.backGroundTileImage;
                    tileSourcePosition = this.calculateTileSourcePosition(tileValue, this.bgSheetColCount, tileType);
                } else if (tileType === OBJECT_TILES) {
                    displayTile = this.objectTileImage;
                    tileSourcePosition = this.calculateTileSourcePosition(tileValue, this.objectSheetColCount, tileType);
                } else if (tileType === PLATFORM_TILES) {
                    displayTile = this.platformTileSheetImage;
                    tileSourcePosition = this.calculateTileSourcePosition(tileValue, this.platformSheetColCount, tileType);
                }

                this.buffer.drawImage(
                    displayTile,
                    tileSourcePosition.x,
                    tileSourcePosition.y,
                    this.tileSize,
                    this.tileSize,

                    mapColumn * this.tileSize,
                    mapRow * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    protected renderMap() {
        drawEngine.context.drawImage(this.buffer.canvas, 0, 0);
    }

    public draw() {
        // console.log('msg from level gen' + this.tileData)
        this.drawBgTiles();
        this.drawObjectTiles();
        this.drawPlatformTiles();
    }

    protected drawBgTiles() {
        if (this.isBGTileLoaded && BACK_GROUND) {
            this.renderTiles(BACK_GROUND);
            this.renderMap();
        }
    }

    protected drawPlatformTiles() {
        if (this.isPlatformTileLoaded && PLATFORM_TILES) {
            this.renderTiles(PLATFORM_TILES);
            this.renderMap();
        }
    }

    protected drawObjectTiles() {
        if (this.isObjectTileLoaded) {
            this.renderTiles(OBJECT_TILES);
            this.renderMap();
        }
    }
}