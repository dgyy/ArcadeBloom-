package game;

class ControlRequest {
    public function new() {}
    public var left:Float = -1.0;
    public var right:Float = -1.0;
    public var down:Float = -1.0;
    public var rotate:Float = -1.0;
    public var rotate2:Float = -1.0;
}

class Session {
    public var grids:Array<Array<Array<ecs.Entity>>>;
    public var width = 6;
    public var height = 12;
    public var puyoCount = [0, 0];
    public var garbages = [0, 0];
    public var currentMatchCounts = [0, 0];
    public var preGarbages = [0, 0];
    public var playerNames = ["You", "Computer"];

    public var colors = ["#CC8497", "#00C892", "#7F87F1", "#EEE8A9"];

    public var gameStarted = false;
    public var gameFinished = false;
    public var winner:Int;

    public var rseed:Int;

    public var controlRequests:Array<ControlRequest> = [new ControlRequest(), new ControlRequest()];

    public function new() {
        grids = [];

        for(g in 0...2) {
            var grid = [];

            for(i in 0...14) {
                grid[i] = [];
            }

            grids[g] = grid;
        }

        rseed = Std.random(1000);
    }

    public function isValid(col, row) {
        if(col<0 || col>5) {
            return false;
        }

        if(row<0) {
            return false;
        }

        return true;
    }

    public function isFree(team, col, row) {
        if(isValid(col, row)) {
            if(row >=12) { return true; }

            return grids[team][row][col] == null;
        }

        return false;
    }

    public function getEntity(team, col, row) {
        if(isValid(col, row)) {
            return grids[team][row][col];
        }

        return null;
    }

    public function setGrid(team, col, row, value) {
        grids[team][row][col] = value;
    }

    public function getColor(team, col, row) {
        var e = getEntity(team, col, row);

        if(e != null) {
            return e.get(Puyo).color;
        }

        return null;
    }

    public function getRandomColor(seed) {
        var r = Main.instance.getRandomInt(rseed + seed, colors.length);
        return colors[r];
    }
}
