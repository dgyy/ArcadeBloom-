// Note: this is copy paste (with some modifications) from https://maxwellforbes.com/posts/typescript-ecs-implementation/
// Thanks to Maxwell Forbes for the great article!
/**
 * An entity is just an ID. This is used to look up its associated
 * Components.
 */

import { EventEmitter } from './utils'

// eslint-disable-next-line max-classes-per-file
export type Entity = number;

/**
 * A Component is a bundle of state. Each instance of a Component is
 * associated with a single Entity.
 *
 * Components have no API to fulfill.
 */
export abstract class Component {}

/**
 * A System cares about a set of Components. It will run on every Entity
 * that has that set of Components.
 *
 * A System must specify two things:
 *
 *  (1) The immutable set of Components it needs at compile time. (Its
 *      immutability isn't enforced by anything but my wrath.) We use the
 *      type `Function` to refer to a Component's class; i.e., `Position`
 *      (class) rather than `new Position()` (instance).
 *
 *  (2) An update() method for what to do every frame (if anything).
 */
export abstract class System {
  /**
   * Set of Component classes, ALL of which are required before the
   * system is run on an entity.
   *
   * This should be defined at compile time and should never change.
   */
  public abstract componentsRequired: Set<Function>;

  /**
   * addEntity() and removeEntity() are called when an Entity is added/removed if implemented
   */
  public addEntity?(entity: Entity, componentContainer: ComponentContainer): void;
  public removeEntity?(entity: Entity): void;

  /**
   * update() is called on the System every frame.
   */
  public abstract update(entities: Set<Entity>): void;

  /**
   * The ECS is given to all Systems. Systems contain most of the game
   * code, so they need to be able to create, mutate, and destroy
   * Entities and Components.
   */
  // eslint-disable-next-line no-use-before-define
  public ecs!: ECS
}

/**
 * This type is so functions like the ComponentContainer's get(...) will
 * automatically tell TypeScript the type of the Component returned. In
 * other words, we can say get(Position) and TypeScript will know that an
 * instance of Position was returned. This is amazingly helpful.
 */
export type ComponentClass<T extends Component> = new (...args: any[]) => T;

/**
 * This custom container is so that calling code can provide the
 * Component *instance* when adding (e.g., add(new Position(...))), and
 * provide the Component *class* otherwise (e.g., get(Position),
 * has(Position), delete(Position)).
 *
 * We also use two different types to refer to the Component's class:
 * `Function` and `ComponentClass<T>`. We use `Function` in most cases
 * because it is simpler to write. We use `ComponentClass<T>` in the
 * `get()` method, when we want TypeScript to know the type of the
 * instance that is returned. Just think of these both as referring to
 * the same thing: the underlying class of the Component.
 *
 * You might notice a footgun here: code that gets this object can
 * directly modify the Components inside (with add(...) and delete(...)).
 * This would screw up our ECS bookkeeping of mapping Systems to
 * Entities! We'll fix this later by only returning callers a view onto
 * the Components that can't change them.
 */
export class ComponentContainer {
  private map = new Map<Function, Component>()

  public add (component: Component): void {
    this.map.set(component.constructor, component)
  }

  public get<T extends Component> (componentClass: ComponentClass<T>): T {
    return this.map.get(componentClass) as T
  }

  public has (componentClass: Function): boolean {
    return this.map.has(componentClass)
  }

  public hasAll (componentClasses: Iterable<Function>): boolean {
    for (const cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false
      }
    }
    return true
  }

  public delete (componentClass: Function): void {
    this.map.delete(componentClass)
  }
}

/**
 * The ECS is the main driver; it's the backbone of the engine that
 * coordinates Entities, Components, and Systems. You could have a single
 * one for your game, or make a different one for every level, or have
 * multiple for different purposes.
 */
export class ECS {
  // Main state
  private entities = new Map<Entity, ComponentContainer>()
  private systems = new Map<System, Set<Entity>>()

  // Bookkeeping for entities.
  private nextEntityID = 0
  private entitiesToDestroy: Entity[] = []

  public currentDelta = 0
  public ee = EventEmitter()

  // API: Entities

  public addEntity (): Entity {
    const entity = this.nextEntityID
    this.nextEntityID++
    this.entities.set(entity, new ComponentContainer())
    return entity
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  public removeEntity (entity: Entity): void {
    this.entitiesToDestroy.push(entity)
  }

  // API: Components

  public addComponent (entity: Entity, component: Component): void {
    this.entities.get(entity)!.add(component)
    this.checkE(entity)
  }

  public getComponents (entity: Entity): ComponentContainer {
    return this.entities.get(entity)!
  }

  public removeComponent (entity: Entity, componentClass: Function): void {
    this.entities.get(entity)!.delete(componentClass)
    this.checkE(entity)
  }

  // API: Systems

  public addSystem (system: System): void {
    // Checking invariant: systems should not have an empty
    // Components list, or they'll run on every entity. Simply remove
    // or special case this check if you do want a System that runs
    // on everything.
    if (system.componentsRequired.size === 0) {
      console.warn('System not added: empty Components list.')
      console.warn(system)
      return
    }

    // Give system a reference to the ECS so it can actually do
    // anything.
    system.ecs = this

    // Save system and set who it should track immediately.
    this.systems.set(system, new Set())
    for (const entity of this.entities.keys()) {
      this.checkES(entity, system)
    }
  }

  /**
   * Note: I never actually had a removeSystem() method for the entire
   * time I was programming the game Fallgate (2 years!). I just added
   * one here for a specific testing reason (see the next post).
   * Because it's just for demo purposes, this requires an actual
   * instance of a System to remove (which would be clunky as a real
   * API).
   */
  public removeSystem (system: System): void {
    this.systems.delete(system)
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   */
  public update (): void {
    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (const [system, entities] of this.systems.entries()) {
      system.update(entities)
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop()!)
    }
  }

  // Private methods for doing internal state checks and mutations.

  private destroyEntity (entity: Entity): void {
    this.entities.delete(entity)
    for (const entities of this.systems.values()) {
      entities.delete(entity) // no-op if doesn't have it
    }
  }

  private checkE (entity: Entity): void {
    for (const system of this.systems.keys()) {
      this.checkES(entity, system)
    }
  }

  private checkES (entity: Entity, system: System): void {
    const have = this.entities.get(entity)

    const need = system.componentsRequired
    if (have?.hasAll(need)) {
      this.systems.get(system)!.add(entity) // no-op if in
      if (system.addEntity) {
        system.addEntity(entity, have)
      }
    } else {
      this.systems.get(system)!.delete(entity) // no-op if out
      if (system.removeEntity) {
        system.removeEntity(entity)
      }
    }
  }
}
