package game;

typedef Match = Map<ecs.Entity, Bool>;

class CheckSystem extends ecs.System {
    static var requiredMatchCount = 4;

    var matchings = [false, false];

    public function new() {
        super();
    }

    override public function onResume() {
    }

    override public function update(dt) {
        var main = Main.instance;
        var session = main.session;

        for(team in 0...2) {
            var count = Main.instance.countEntities(team, Fall);

            if(count == 0) {
                var matches = new Array<Match>();

                for(x in 0...session.width) {
                    for(y in 0...session.height) {
                        var e = session.getEntity(team, x, y);

                        if(e != null) {
                            var match:Match = null;

                            for(m in matches) {
                                if(m[e]) {
                                    match = m;
                                }
                            }

                            if(match == null) {
                                var puyo = e.get(Puyo);

                                if(!puyo.garbage && !puyo.matching) {
                                    match = new Match();
                                    matches.push(match);
                                    var current = puyo.getPosition();
                                    match[e] = true;
                                    visit(team, match, current, puyo.color);
                                }
                            }
                        }
                    }
                }

                var did_match = false;
                var garbage_points = 0;

                for(match in matches) {
                    var size = Lambda.count(match);

                    if(size >= requiredMatchCount) {
                        main.session.currentMatchCounts[team]++;
                        var z = size - requiredMatchCount;

                        if(z >= 0) {
                            garbage_points += Std.int(Math.ceil((z * z) / 2));
                        }

                        did_match = true;

                        for(e in match.keys()) {
                            preDestroyPuyo(e);
                        }
                    }
                }

                if(did_match) {
                    matchings[team] = true;
                    main.session.preGarbages[team] += garbage_points;
                    main.sfx(1.2, .9, 130, .09, .27, .45, 1, 1.34, -8.4, 0, 0, 0, .13, 0, 0, 0, 0, .98, .23, .33);
                }
            }

            if(matchings[team]) {
                var count = main.countEntities(team, Blink);

                if(count == 0) {
                    var es = main.getEntities(team, Puyo);

                    for(e in es) {
                        var puyo = e.get(Puyo);
                        main.session.setGrid(team, puyo.col, puyo.row, null);
                        e.add(new Fall());
                    }

                    matchings[team] = false;
                }
            }
        }
    }

    static var deltas:Array<math.Point> = [ [0, 1], [0, -1], [1, 0], [-1, 0]];

    function visit(team:Int, match:Match, position:math.Point, color) {
        for(delta in deltas) {
            var new_pos = position + delta;
            var e = Main.instance.session.getEntity(team, Std.int(new_pos.x), Std.int(new_pos.y));

            if(e != null) {
                if(e.get(Puyo).color == color) {
                    if(!match[e]) {
                        match[e] = true;
                        visit(team, match, new_pos, color);
                    }
                }
            }
        }
    }

    function preDestroyPuyo(e:ecs.Entity) {
        var puyo = e.get(Puyo);
        var team = puyo.team;
        e.add(new Blink());
        puyo.matching = true;
    }
}
