package game;

class BlinkSystem extends ecs.System {

    public function new() {
        super();
        addComponentClass(math.Transform);
        addComponentClass(PuyoDisplay);
        addComponentClass(Blink);
    }

    override public function updateSingle(dt:Float, e:ecs.Entity) {
        var pd = e.get(PuyoDisplay);
        var blink = e.get(Blink);
        blink.time += dt;
        pd.alpha = 0.5 + Math.cos(blink.time * 50) * 0.5;

        if(blink.time > 0.5) {
            e.remove(Blink);
            engine.removeEntity(e);
            destroyPuyo(e);
        }
    }

    static var deltas:Array<math.Point> = [ [0, 1], [0, -1], [1, 0], [-1, 0]];
    function destroyPuyo(e:ecs.Entity) {
        var puyo = e.get(Puyo);
        var team = puyo.team;
        Main.instance.session.setGrid(team, puyo.col, puyo.row, null);

        for(delta in deltas) {
            var new_pos = puyo.getPosition() + delta;
            var new_col = Std.int(new_pos.x);
            var new_row = Std.int(new_pos.y);
            var e = Main.instance.session.getEntity(team, new_col, new_row);

            if(e != null) {
                var puyo = e.get(Puyo);

                if(puyo.garbage) {
                    Main.instance.session.setGrid(team, new_col, new_row, null);
                    engine.removeEntity(e);
                }
            }
        }
    }
}
