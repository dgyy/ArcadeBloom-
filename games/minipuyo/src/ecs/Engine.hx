package ecs;

class Engine {
    private var systems:Array<System> = [];
    private var suspended:Array<System> = [];
    private var entities:Array<Entity> = [];

    public function new() {
    }

    public function addSystem<T:System>(system:T, priority:Int, klass:Class<T> = null):T {
        systems.push(system);
        system.engine = this;
        system.onResume();
        return system;
    }

    public function removeSystem(system_to_remove:System) {
        system_to_remove.engine = null;
        systems.remove(system_to_remove);
    }

    public function suspendSystem<T:System>(klass:Class<T> = null) {
        var type_to_suspend = Type.getClassName(klass);

        for(system in systems) {
            var type = Type.getClassName(Type.getClass(system));

            if(type == type_to_suspend) {
                suspended.push(system);
                system.onSuspend();
                break;
            }
        }
    }

    public function resumeSystem<T:System>(klass:Class<T> = null) {
        var type_to_resume = Type.getClassName(klass);

        for(system in suspended) {
            var type = Type.getClassName(Type.getClass(system));

            if(type == type_to_resume) {
                suspended.remove(system);
                system.onResume();
                break;
            }
        }
    }

    public function isActive<T:System>(klass:Class<T> = null) {
        var type_to_check = Type.getClassName(klass);

        for(system in systems) {
            var type = Type.getClassName(Type.getClass(system));

            if(type == type_to_check) {
                return true;
            }
        }

        return false;
    }

    public function update(dt:Float) {
        var systems_copy = systems.slice(0);
        var entities_copy = entities.slice(0);

        for(system in systems_copy) {
            if(suspended.contains(system)) {
                continue;
            }

            system.entities = [];

            for(entity in entities_copy) {
                var matches = true;

                for(klass in system.classes) {
                    if(entity.components.get(klass) == null) {
                        matches = false;
                        break;
                    }
                }

                if(matches) {
                    system.entities.push(entity);
                }
            }

            system.update(dt);
        }
    }

    public function getMatchingEntities(klass:Class<Dynamic>):Array<Entity> {
        var name = Type.getClassName(klass);
        var result = [];

        for(entity in entities) {
            if(entity.components.get(name) != null) {
                result.push(entity);
            }
        }

        return result;

    }

    public function addEntity(entity:Entity) {
        entities.push(entity);
    }

    public function removeEntity(entity:Entity) {
        entities.remove(entity);
    }
}
