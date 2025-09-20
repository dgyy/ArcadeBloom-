package ecs;

@:allow(ecs.Engine)
class Entity {
    private var components:Map<String, Dynamic> = new Map();

    public function new() {
    }

    public function add<T>(component:T, componentClass:Class<T> = null) {
        components[Type.getClassName(Type.getClass(component))] = component;
    }

    public function get<T>(componentClass:Class<T>):T {
        return components.get(Type.getClassName(componentClass));
    }

    public function remove<T>(componentClass:Class<T>) {
        components.remove(Type.getClassName(componentClass));
    }
}
