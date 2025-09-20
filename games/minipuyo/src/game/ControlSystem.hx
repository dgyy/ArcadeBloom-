package game;

class ControlSystem extends ecs.System {

    private var moveRequesteds = [false, false];
    private var rotateRequesteds = [false, false];

    public function new() {
        super();
        addComponentClass(math.Transform);
        addComponentClass(Puyo);
        addComponentClass(Control);
    }

    override public function update(dt) {
        moveRequesteds = [false, false];
        rotateRequesteds = [false, false];
        super.update(dt);
        var main = Main.instance;

        for(team in 0...2) {
            if(main.countEntities(team, Control) == 2) {
                var es = main.getEntities(team, Control);
                var all_valid = true;

                for(e in es) {
                    var puyo = e.get(Puyo);

                    if(puyo.desiredCol == null || puyo.desiredRow == null || !Main.instance.session.isFree(puyo.team, puyo.desiredCol, puyo.desiredRow)) {
                        all_valid = false;
                        break;
                    }
                }

                if(all_valid) {
                    for(e in es) {
                        var puyo = e.get(Puyo);

                        if(puyo.col != puyo.desiredCol || puyo.row != puyo.desiredRow) {
                            main.sfx(0.2, .05, 1040, .05, .02, .04, 0, 1.97, 0, 0, -224, .05, .02, .1, 1, .5, .01, .43, 0, .01);
                        }

                        puyo.col = puyo.desiredCol;
                        puyo.row = puyo.desiredRow;
                    }
                }
            }
        }
    }

    override public function updateSingle(dt:Float, e:ecs.Entity) {
        var puyo = e.get(Puyo);
        var control = e.get(Control);
        var offset_col = 0;
        var offset_row = 0;
        var main = Main.instance;
        var control_request = main.session.controlRequests[puyo.team];
        control.time += dt;
        control.time2 += dt;
        puyo.desiredRow = puyo.row;
        puyo.desiredCol = puyo.col;

        if(!moveRequesteds[puyo.team]) {
            if(control.second) {
                var o_pressed = control_request.rotate == 0;
                var p_pressed = control_request.rotate2 == 0;
                var es = main.getEntities(puyo.team, Control);
                var other:Puyo = null;

                for(e2 in es) {
                    if(!e2.get(Control).second) {
                        other = e2.get(Puyo);
                    }
                }

                if(o_pressed || p_pressed) {
                    var dir = o_pressed ? 1 : -1;

                    if(other.col == puyo.col) {
                        puyo.desiredRow = other.row;

                        if(other.row == puyo.row + 1) {
                            puyo.desiredCol = puyo.col - dir;
                        } else {
                            puyo.desiredCol = puyo.col + dir;
                        }

                        if(puyo.desiredCol < 0) {
                            puyo.desiredCol++;
                            other.desiredCol++;
                        } else if(puyo.desiredCol >= main.session.width) {
                            puyo.desiredCol--;
                            other.desiredCol--;
                        }
                    } else {
                        puyo.desiredCol = other.col;

                        if(other.col == puyo.col + 1) {
                            puyo.desiredRow = puyo.row + dir;
                        } else {
                            puyo.desiredRow = puyo.row - dir;
                        }
                    }

                    rotateRequesteds[puyo.team] = true;
                    return;
                }
            }
        }

        if(!rotateRequesteds[puyo.team]) {
            if(control_request.left >= 0) {
                if(control_request.left == 0) {
                    control.time = 1.0;
                }

                offset_col -= 1;
            } else if(control_request.right >= 0) {
                if(control_request.right == 0) {
                    control.time = 1.0;
                }

                offset_col += 1;
            }

            if(control_request.down >= 0) {
                if(control_request.down == 0) {
                    control.time2 = 1.0;
                }

                offset_row -= 1;
            }

            if(offset_col != 0 && control.time >= 0.1) {
                puyo.desiredCol = puyo.col + offset_col;
                moveRequesteds[puyo.team] = true;
                control.time = 0.0;
            }

            if(offset_row != 0 && control.time2 >= 0.1) {
                puyo.desiredRow = puyo.row + offset_row;
                moveRequesteds[puyo.team] = true;
                control.time2 = 0.0;
            }
        }
    }
}
