import { drawEngine } from "@/core/draw-engine";
import { Animations, Box } from "@/model/common.model";

export class Sprite {
    public position: DOMPoint;
    protected image: HTMLImageElement;
    private isLoaded: boolean = false;
    protected width: number = 0;
    protected height: number = 0;
    public currentAnimation: any;
    public animations: Array<Animations> | undefined = [];

    private cropBox: Box = new Box();
    protected frameCount: number;
    protected currentframe: number = 0;
    private elapsedFrames: number = 0;
    protected frameBuffer: number;
    protected isFlip: boolean | undefined = false;
    protected loop: boolean;
    protected autoplay: boolean;

    constructor(postion: DOMPoint, src: string, animations?: Array<Animations>, frameCount = 1, frameBuffer = 0, loop = true, autoplay = true) {
        this.position = postion;
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => {
            if(!this.image) return;
            this.width = this.image.width / this.frameCount;
            this.height = this.image.height;
            this.isLoaded = true;
        }
        this.frameCount = frameCount;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;

        if (this.animations) {
            this.animations.forEach((animation) => {
                const image = new Image();
                image.src = animation.props.src;
                animation.props.image = image;
            });
            // console.log(this.animations)
        }
        // this.currentAnimation.isActive = false;
    }

    draw() {
        if (!this.isLoaded && !this.image) return;

        this.cropBox.position.x = this.width * this.currentframe;
        this.cropBox.width = this.width;
        this.cropBox.height = this.height;
        drawEngine.context.imageSmoothingEnabled = false;

        if (this.isFlip) {
            drawEngine.context.save();
            drawEngine.context.scale(-1, 1)
            drawEngine.context.drawImage
            (this.image,
                this.cropBox.position.x,
                this.cropBox.position.y,
                this.cropBox.width,
                this.cropBox.height,
                -this.position.x - this.width,
                this.position.y,
                this.width,
                this.height
            );
            drawEngine.context.restore();
        } else {
            drawEngine.context.drawImage
            (this.image,
                this.cropBox.position.x,
                this.cropBox.position.y,
                this.cropBox.width,
                this.cropBox.height,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }

        // drawEngine.context.drawImage
        //     (this.image,
        //         this.cropBox.position.x,
        //         this.cropBox.position.y,
        //         this.cropBox.width,
        //         this.cropBox.height,
        //         this.position.x,
        //         this.position.y,
        //         this.width,
        //         this.height
        //     );

        this.updateFrames();
    }

    play() {
        this.autoplay = true;
    }

    stop() {
        this.autoplay = false;
    }

    updateFrames() {
        if (!this.autoplay) return;
        this.elapsedFrames++;
        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentframe < this.frameCount - 1) {
                this.currentframe++;
            } else if (this.loop) {
                this.currentframe = 0;
            }
        }

        if(this.currentAnimation?.onComplete) {
            if (this.currentframe === this.frameCount - 1 && !this.currentAnimation.isActive) {
                this.currentAnimation.onComplete();
                this.currentAnimation.isActive = true;
            }
        }
    }
}