package ecs;

@:allow(ecs.Engine)
class System {

    private var engine:Engine;
    private var classes:Array<String> = [];
    private var entities:Array<Entity> = [];

    public function new() {
    }

    private function addComponentClass(klass:Class<Dynamic>) {
        classes.push(Type.getClassName(klass));
    }

    public function update(dt:Float) {
        for(entity in entities) {
            updateSingle(dt, entity);
        }
    }

    public function updateSingle(dt:Float, entity:Entity) {
    }

    public function onResume() {
    }

    public function onSuspend() {
    }
}
