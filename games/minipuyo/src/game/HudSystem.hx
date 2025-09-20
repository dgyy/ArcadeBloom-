package game;

class HudSystem extends ecs.System {

    var time = 0.0;

    public function new() {
        super();
    }

    override public function onResume() {
    }

    override public function update(dt) {
        time += dt;
        var main = Main.instance;

        if(main.session.gameFinished) {
            endGame();
        } else if(main.session.gameStarted) {
            display(0);
            display(1);
        } else {
            mainMenu();
        }
    }

    function display(team) {
        var main = Main.instance;
        var session = main.session;
        var ctx = main.ctx;
        ctx.fillStyle = "#AF8D8B";
        var offset = team == 0 ? 2 : 38;
        var count = session.garbages[team];

        for(i in 0...count) {
            ctx.fillRect(offset, 6, 1, 3);
            offset += 1;
        }
    }

    function mainMenu() {
        var main = Main.instance;
        var session = main.session;
        var ctx = main.ctx;
        ctx.fillStyle = "#444";
        ctx.fillRect(2, 6, 60, 52);
        ctx.fillStyle = "#57e";
        ctx.font = "12px pixel";
        ctx.textBaseline = "top";
        ctx.fillText("MiniPuyo!", 7, 10);
        var draw = (Std.int(time) % 2) == 0;

        if(draw) {
            ctx.font = "10px pixel";
            ctx.fillText("Press", 20, 38);
            ctx.fillText("Enter", 20, 47);
        }

        if(main.isJustPressed("Enter")) {
            session.gameStarted = true;
            main.sfx(0.5, .05, 543, .02, .28, .41, 2, 1.94, -1.3, 0, 316, .03, .05, 0, 0, 0, 0, .67, .17, .08);
        }
    }

    function endGame() {
        var main = Main.instance;
        var session = main.session;
        var ctx = main.ctx;
        ctx.fillStyle = "#444";
        ctx.fillRect(2, 6, 60, 52);
        ctx.font = "12px pixel";
        ctx.textBaseline = "top";

        if(session.winner == 1) {
            ctx.fillStyle = "#d33";
            ctx.fillText(session.playerNames[session.winner], 6, 10);
            ctx.fillText("has won!", 10, 22);
        } else {
            ctx.fillStyle = "#e8e";
            ctx.fillText("You", 20, 10);
            ctx.fillText("win!", 20, 22);
        }

        var draw = (Std.int(time) % 2) == 0;

        if(draw) {
            ctx.fillStyle = "#57e";
            ctx.font = "10px pixel";
            ctx.fillText("Press", 20, 38);
            ctx.fillText("Enter", 20, 47);
        }

        if(main.isJustPressed("Enter")) {
            main.start();
        }
    }
}
