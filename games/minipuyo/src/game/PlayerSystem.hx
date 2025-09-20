package game;

class PlayerSystem extends ecs.System {

    public function new() {
        super();
    }

    override public function onResume() {
    }

    override public function update(dt) {
        var main = Main.instance;
        var cr = main.session.controlRequests[0];

        if(main.isJustPressed('a') || main.isJustPressed('ArrowLeft')) {
            cr.left = 0.0;
        } else if(main.isPressed('a') || main.isPressed('ArrowLeft')) {
            cr.left += dt;
        } else {
            cr.left = -1;
        }

        if(main.isJustPressed('d') || main.isJustPressed('ArrowRight')) {
            cr.right = 0.0;
        } else if(main.isPressed('d') || main.isPressed('ArrowRight')) {
            cr.right += dt;
        } else {
            cr.right = -1;
        }

        if(main.isJustPressed('s') || main.isJustPressed('ArrowDown')) {
            cr.down = 0.0;
        } else if(main.isPressed('s') || main.isPressed('ArrowDown')) {
            cr.down += dt;
        } else {
            cr.down = -1;
        }

        cr.rotate = main.isJustPressed('o') ? 0.0 : -1.0;
        cr.rotate2 = main.isJustPressed('p') ? 0.0 : -1.0;
    }
}
