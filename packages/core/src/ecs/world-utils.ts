import { World } from './world';
import { Entity, ComponentId } from './types';

/**
 * Creates a deep copy of the entire ECS World.
 * Essential for "Save/Load" features and Scene Reset after simulation.
 * @param world - The source world to clone.
 * @returns A completely independent copy of the world.
 */
export const cloneWorld = (world: World): World => {
    // Clone entity metadata
    const clonedEntities = {
        nextId: world.entities.nextId,
        active: new Set(world.entities.active),
        recycled: [...world.entities.recycled]
    };

    // Clone component stores
    const clonedComponents = new Map<ComponentId, Map<Entity, unknown>>();

    world._components.forEach((store, componentId) => {
        const newStore = new Map<Entity, unknown>();

        store.forEach((data, entityId) => {
            // structuredClone ensures a deep copy of the pure data
            newStore.set(entityId, structuredClone(data));
        });

        clonedComponents.set(componentId, newStore);
    });

    return {
        entities: clonedEntities,
        _components: clonedComponents
    };
};