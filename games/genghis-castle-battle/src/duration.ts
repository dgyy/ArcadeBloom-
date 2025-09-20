export class Duration {
    public elapsed = 0;

    protected current = 0;
    protected previous = 0;

    constructor(public milliseconds: number) { }

    public hasPassed(): boolean {
        this.current = Date.now();

        if (this.previous) {
            this.elapsed += this.current - this.previous;
        }

        this.previous = this.current;

        if (this.elapsed >= this.milliseconds) {
            this.elapsed = 0;
            return true;
        }

        return false;
    }
}