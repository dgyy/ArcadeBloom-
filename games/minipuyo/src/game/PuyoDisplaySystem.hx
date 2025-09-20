package game;

class PuyoDisplaySystem extends ecs.System {
    public function new() {
        super();
        addComponentClass(math.Transform);
        addComponentClass(PuyoDisplay);
    }

    override public function update(dt:Float) {
        super.update(dt);
        var main = Main.instance;
        var ctx = Main.instance.ctx;
        ctx.globalAlpha = 1.0;
    }

    override public function updateSingle(dt:Float, e:ecs.Entity) {
        var puyod = e.get(PuyoDisplay);
        var puyo = e.get(Puyo);
        var pos = e.get(math.Transform).position;
        puyod.time -= dt;

        if(puyod.time < 0) {
            puyod.eyeFlip = Std.random(2) == 1;
            puyod.time = 0.5 + Std.random(3);
        }

        {
            var ctx = Main.instance.ctx;
            //body
            ctx.globalAlpha = puyod.alpha;
            ctx.fillStyle = puyod.color;
            ctx.fillRect(pos.x + 1, pos.y, 2, 4);
            ctx.fillRect(pos.x, pos.y+1, 4, 2);

            if(puyo != null && e.get(Fall) == null && !puyo.garbage) {
                var session = Main.instance.session;

                if(session.getColor(puyo.team, puyo.col - 1, puyo.row) == puyo.color) {
                    ctx.fillRect(pos.x, pos.y, 1, 4);
                }

                if(session.getColor(puyo.team, puyo.col + 1, puyo.row) == puyo.color) {
                    ctx.fillRect(pos.x + 3, pos.y, 1, 4);
                }

                if(session.getColor(puyo.team, puyo.col, puyo.row + 1) == puyo.color) {
                    ctx.fillRect(pos.x, pos.y, 4, 1);
                }

                if(session.getColor(puyo.team, puyo.col, puyo.row - 1) == puyo.color) {
                    ctx.fillRect(pos.x, pos.y + 3, 4, 1);
                }
            }

            //eye

            if(puyo == null  || !puyo.garbage) {
                ctx.fillStyle = puyod.eyeFlip ? "#55a" : "#fff";
                ctx.fillRect(pos.x+1, pos.y+1, 1, 1);
                ctx.fillStyle = !puyod.eyeFlip ? "#55a" : "#fff";
                ctx.fillRect(pos.x+2, pos.y+1, 1, 1);
            } else {
                ctx.fillStyle = "#444";
                ctx.fillRect(pos.x+1, pos.y+1, 1, 1);
            }
        }
    }
}
