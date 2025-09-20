import { IPoint, IKeyboardInputState } from "./interfaces";
export class KeyboardInput {

    keyboardInputState: IKeyboardInputState = { left: 0, right: 0, up: 0, down: 0 };
    normalizedPos: IPoint =  {x:0,y:0};
    callback: () => void;
    constructor(window: Window, callback: () => void) {
        window.addEventListener("keydown", this.keyDownHandler.bind(this), { capture: true, passive: true});
        window.addEventListener("keyup", this.keyUpHandler.bind(this), { capture: true, passive: true});
        this.callback = callback;
    }
    keyDownHandler(e: KeyboardEvent) {
        // e.preventDefault();
        switch (e.key) {
            case "ArrowLeft":
                this.keyboardInputState.left = 1;
                break;
            case "ArrowRight":
                this.keyboardInputState.right = 1;
                break;
            case "ArrowUp":
                this.keyboardInputState.up = 1;
                break;
            case "ArrowDown":
                this.keyboardInputState.down = 1;
                break;
        }

        this.normalizedPos.x = this.keyboardInputState.right - this.keyboardInputState.left;
        // this.normalizedPos.y =  this.keyboardInputState.up - this.keyboardInputState.down;
        this.normalizedPos.y =  this.keyboardInputState.up;

        this.callback();
    }
    keyUpHandler(e: KeyboardEvent) {
        // e.preventDefault();
        switch (e.key) {
            case "ArrowLeft":
                this.keyboardInputState.left = 0;
                break;
            case "ArrowRight":
                this.keyboardInputState.right = 0;
                break;
            case "ArrowUp":
                this.keyboardInputState.up = 0;
                break;
            case "ArrowDown":
                this.keyboardInputState.down = 0;
                break;
            default:
                return;
        }

        this.normalizedPos.x = this.keyboardInputState.right - this.keyboardInputState.left;
        this.normalizedPos.y =  this.keyboardInputState.up - this.keyboardInputState.down;

        this.callback();
    }
}