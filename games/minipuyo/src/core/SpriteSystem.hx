package core;

import math.Point;
import math.Transform;

class SpriteSystem extends ecs.System {

    public function new() {
        super();
        addComponentClass(Sprite);
        addComponentClass(Transform);
    }

    override public function updateSingle(dt:Float, e:ecs.Entity) {
        var p = e.get(Transform).position;
        var sprite = e.get(Sprite);
        Main.instance.draw(sprite.image, p.x, p.y);
    }
}
