// imports
import {GameObjectClass} from 'kontra';

export default class Line extends GameObjectClass {

    private properties: LineProperties;
    public length: number;

    constructor(properties: LineProperties) {
        super({
            x: properties.x,
            y: properties.y,
        });

        this.properties = properties
        this.length = this.properties.length;
    }

    draw() {

        this.context!.strokeStyle = this.properties.color;

        this.context!.beginPath();
        this.context!.moveTo(0, 0);

        if (this.properties.horizontal) {                               // line is horizontal
            this.context!.lineTo(this.properties.length, 0);
        }
        else {
            this.context!.lineTo(0, this.properties.length);        // line is vertical
        }

        this.context!.lineWidth = this.properties.width;
        this.context!.stroke();
    }

}