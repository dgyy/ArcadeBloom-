import {GameObject, Sprite, TileEngine} from "kontra";
import {Player} from "../entities/player";
import {Reward} from "../entities/reward";
import {Enemy} from "../entities/enemies/enemy";
import Interactable from "../entities/interactable";
import {getCanvasWidth, wallHeight} from "../utils/utils";
import Game from "../game";
import { Spell } from "../entities/weapons/spells/spell";

type SortedComponents = {
    interactables: Interactable[],
    backgroundObjects: GameObject[],
    enemies: Enemy[],
    rewards: Reward[],
    player: Player[],
    spells: Spell[],
    gui: GameObject[],
}

export default class Room {
    tileEngine?: TileEngine

    components: SortedComponents = {
        interactables: [],
        backgroundObjects: [],
        enemies: [],
        rewards: [],
        player: [],
        spells: [],
        gui: [],
    }

    get gui(){
        return this.components.gui;
    }

    get backgroundObjects(){
        return this.components.backgroundObjects;
    }

    get interactables(){
        return this.components.interactables;
    }

    get enemies(){
        return this.components.enemies;
    }

    deleteSpells(){
        this.components.spells.forEach(s => {
            s.lifeTime = 0
            s.isCasting = false;
        });
    }

    deleteEnemies(){
        this.enemies.forEach(e => e.removeFlag = true);
    }

    addInteractable(interactable: Interactable){
        interactable.setRoom(this);
        this.interactables.push(interactable);
    }

    addSpell(spell: Spell){
        this.components.spells.push(spell);
    }

    init(){

    }

    render() {
        this.tileEngine?.render();
        Object.entries(this.components).forEach(
            ([key, value]) => value.forEach(c => c.render())
        );
    }

    update() {
        Object.entries(this.components).forEach(
            ([key, value]) => {
                // @ts-ignore
                this.components[key] = value.filter(c => {
                    c.update()
                    return !c?.removeFlag ?? true;
                });
            }
        );
    }
}
