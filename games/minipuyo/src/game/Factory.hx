package game;

class Factory {
    static public function createPuyo(color) {
        var e = new ecs.Entity();
        e.add(new math.Transform());
        e.add(new Puyo());
        e.get(Puyo).color = color;
        e.add(new PuyoDisplay());
        e.get(PuyoDisplay).color = color;
        return e;
    }

    static public function createPuyoDisplay(color) {
        var e = new ecs.Entity();
        e.add(new math.Transform());
        e.add(new PuyoDisplay());
        e.get(PuyoDisplay).color = color;
        return e;
    }
}
