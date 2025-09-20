package game;

class BotSystem extends ecs.System {

    private var time = 0.0;

    public function new() {
        super();
    }

    override public function onResume() {
        time = 0.0;
    }

    override public function update(dt:Float) {
        var main = Main.instance;
        var cr = main.session.controlRequests[1];
        time -= dt;

        if(time < 0) {
            cr.left = Std.random(10) < 5 ? 0 : -1;

            if(cr.left == -1) {
                cr.right = Std.random(10) < 7 ? 0 : -1;
            }

            cr.down = Std.random(10) < 5 ? 0 : -1;
            cr.rotate = Std.random(10) < 5 ? 0 : -1;
            cr.rotate2 = Std.random(10) < 5 ? 0 : -1;
            time = 0.05 + Std.random(5) * 0.05;
        } else {
            cr.left = -1;
            cr.right = -1;
            cr.down = -1;
            cr.rotate = -1;
            cr.rotate2 = -1;
        }
    }
}
