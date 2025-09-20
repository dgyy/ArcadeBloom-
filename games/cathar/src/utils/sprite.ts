import {Sprite, SpriteSheet} from "kontra";
import {colorizeImage, PenColor} from "./colorize";
import {img} from "./utils";

function getSpriteById(id: number, color: PenColor = PenColor.Green, additional: object = {}, image = img): Sprite {
    return Sprite({
        anchor: centeredAnchor,
        ...additional,
        animations: SpriteSheet({
            frameHeight: 8,
            frameWidth: 8,
            image: colorizeImage(image, color),
            animations: {
                i: {
                    frames: id
                }
            }
        }).animations
    });
}

const centeredAnchor = {x: 0.5, y: 0.5}

export {getSpriteById, centeredAnchor};
