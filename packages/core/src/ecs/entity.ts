import { World } from './world';
import { Entity } from './types';

/**
 * Spawns a new entity in the specified world.
 * Will prioritize reusing IDs from the recycled pool.
 * @param world The target world state.
 * @returns The unique Entity ID.
 */
export const createEntity = (world: World): Entity => {
    const recycledId = world.entities.recycled.pop();
    const entityId = recycledId !== undefined ? recycledId : world.entities.nextId++;

    world.entities.active.add(entityId);
    return entityId;
};

/**
 * Completely removes an entity and its associated components from the world.
 * Reclaims the ID for future use.
 * @param world The world state to modify.
 * @param entityId The ID of the entity to destroy.
 */
export const destroyEntity = (world: World, entityId: Entity): void => {
    if (!world.entities.active.has(entityId)) return;

    // Clean up all component stores for this specific entity
    world.components.forEach((store) => {
        store.delete(entityId);
    });

    world.entities.active.delete(entityId);
    world.entities.recycled.push(entityId);
};