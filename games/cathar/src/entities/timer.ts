export class Timer{
    maxTime!: number;
    time: number = 0;
    isActive: boolean = false;
    repeat: boolean = false;
    onEnd: () => void;

    constructor(maxTime: number = 60, onEnd = () => {}, repeat: boolean = false) {
        this.setMax(maxTime);
        this.onEnd = onEnd;
        this.repeat = repeat;
    }

    setMax(max: number){
        this.maxTime = Math.floor(max);
    }

    update(){
        if(!this.isActive) return;
        this.time = (this.time + 1) % this.maxTime;

        if(this.time == 0){
            this.onEnd();
            this.isActive = this.repeat;
        }
    }

    start (maxTime: number = -1) {
        this.maxTime = maxTime >= 0 ? maxTime : this.maxTime;
        this.time = 0;
        this.isActive = true;
        return this;
    }

    stop(){
        this.time = 0;
        this.isActive = false;
    }
}