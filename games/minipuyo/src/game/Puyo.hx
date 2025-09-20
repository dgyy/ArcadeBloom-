package game;

class Puyo {
    public var team = 0;
    public var row = 12;
    public var col = 2;
    public var desiredRow:Int;
    public var desiredCol:Int;
    public var color = "red";
    public var garbage = false;
    public var matching = false;

    public function new() {
    }

    public function getPosition():math.Point {
        return [col, row];
    }
}
