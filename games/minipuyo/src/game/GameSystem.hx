package game;

class GameSystem extends ecs.System {
    var previewPuyos = [];

    public function new() {
        super();
    }

    override public function onResume() {
        var main = Main.instance;
        var session = main.session;
        var color = "red";
        {
            var e = Factory.createPuyoDisplay(color);
            var p = e.get(math.Transform).position;
            p.x = 27;
            p.y = 12;
            engine.addEntity(e);
            previewPuyos[0] = [e];
            var e = Factory.createPuyoDisplay(color);
            var p = e.get(math.Transform).position;
            p.x = 27;
            p.y = 16;
            engine.addEntity(e);
            previewPuyos[0].push(e);
        }
        {
            var e = Factory.createPuyoDisplay(color);
            var p = e.get(math.Transform).position;
            p.x = 33;
            p.y = 12;
            engine.addEntity(e);
            previewPuyos[1] = [e];
            var e = Factory.createPuyoDisplay(color);
            var p = e.get(math.Transform).position;
            p.x = 33;
            p.y = 16;
            engine.addEntity(e);
            previewPuyos[1].push(e);
        }
        updatePreview(0);
        updatePreview(1);
    }

    override public function update(dt) {
        if(Main.instance.session.gameStarted) {
            checkForSpawn(0);
            checkForSpawn(1);
        }
    }

    function createRandomPuyo(team, seed) {
        var color = Main.instance.session.getRandomColor(seed);
        var e = Factory.createPuyo(color);
        e.add(new Fall());
        e.add(new Control());
        e.get(Puyo).team = team;
        return e;
    }

    function createGarbagePuyo(team) {
        var color = "grey";
        var e = Factory.createPuyo(color);
        e.add(new Fall());
        e.add(new Garbage());
        e.get(Puyo).team = team;
        e.get(Puyo).garbage = true;
        return e;
    }

    function spawnRandomDuo(team) {
        var session = Main.instance.session;
        var e = createRandomPuyo(team, session.puyoCount[team]);
        session.puyoCount[team]++;
        engine.addEntity(e);
        var e = createRandomPuyo(team, session.puyoCount[team]);
        session.puyoCount[team]++;
        engine.addEntity(e);
        e.get(Puyo).row++;
        e.get(Control).second = true;
    }

    function checkForSpawn(team) {
        var main = Main.instance;
        var session = main.session;
        var count = main.countEntities(team, Fall);
        var blink_count = main.countEntities(team, Blink);

        if(count == 0 && blink_count == 0) {
            var garbages = session.garbages;

            if(garbages[team] > 0) {
                var row_offset = 0;

                while(garbages[team] >= 6) {
                    for(i in 0...6) {
                        var e = createGarbagePuyo(team);
                        e.get(Puyo).col = i;
                        e.get(Puyo).row += row_offset;
                        engine.addEntity(e);
                    }

                    garbages[team] -= 6;
                    row_offset++;
                }

                var coldone = new Map<Int, Bool>();

                while(garbages[team] > 0) {
                    var r = Std.random(6);

                    while(coldone[r]) {
                        r = Std.random(6);
                    }

                    coldone[r] = true;
                    var e = createGarbagePuyo(team);
                    e.get(Puyo).col = r;
                    e.get(Puyo).row += row_offset;
                    engine.addEntity(e);
                    garbages[team] -= 1;
                }
            } else {
                spawnRandomDuo(team);
                updatePreview(team);
                var n = session.currentMatchCounts[team];

                if(n >= 0) {
                    session.preGarbages[team] += n*(n*n + 1);
                    var total = session.preGarbages[team];
                    session.preGarbages[team] = 0;
                    session.garbages[1 - team] += total;
                    session.currentMatchCounts[team] = 0;
                }
            }
        }
    }

    function updatePreview(team) {
        var session = Main.instance.session;
        var color = session.getRandomColor(session.puyoCount[team]);
        previewPuyos[team][0].get(PuyoDisplay).color = color;
        var color = session.getRandomColor(session.puyoCount[team] + 1);
        previewPuyos[team][1].get(PuyoDisplay).color = color;
    }
}
