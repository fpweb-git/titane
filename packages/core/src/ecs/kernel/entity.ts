import { World } from './world';
import { Entity } from '../types';

/**
 * Spawns a new entity in the specified world.
 * Will prioritize reusing IDs from the recycled pool.
 * @param world The target world state.
 * @returns The unique Entity ID.
 */
export const createEntity = (world: World): Entity => {
    // 1. Try to get a recycled ID
    const recycledId = world.entities.recycled.pop();

    // 2. Otherwise create a new one
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
    // Safety: don't destroy an entity that isn't active
    if (!world.entities.active.has(entityId)) return;

    // 1. Clean up all component stores for this specific entity
    world._components.forEach((store) => {
        store.delete(entityId);
    });

    // 2. Remove the ID from the active set
    world.entities.active.delete(entityId);

    // 3. Put the ID back into the recycled pool
    world.entities.recycled.push(entityId);
};