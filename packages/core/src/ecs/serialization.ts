import { World, createWorld } from './world';
import { Entity, ComponentId } from './types';
import { addComponent } from './component';

/**
 * Portable representation of the World state.
 * Maps are converted to nested objects for JSON compatibility.
 */
export interface SerializedWorld {
    nextId: number;
    entities: Entity[];
    components: Record<ComponentId, Record<string, unknown>>;
}

/**
 * Converts a live ECS World into a serializable plain object.
 * @param world - The active ECS world state.
 * @returns A JSON-friendly object structure.
 */
export const serializeWorld = (world: World): SerializedWorld => {
    const serialized: SerializedWorld = {
        nextId: world.entities.nextId,
        entities: Array.from(world.entities.active),
        components: {}
    };

    // Transform Map<ComponentId, Map<Entity, Data>> into a plain Record structure
    world._components.forEach((store, componentId) => {
        serialized.components[componentId] = Object.fromEntries(store);
    });

    return serialized;
};

/**
 * Reconstructs an ECS World from a serialized data object.
 * @param data - The serialized world data.
 * @returns A fresh, fully populated World instance.
 */
export const deserializeWorld = (data: SerializedWorld): World => {
    const world = createWorld();

    // 1. Restore internal entity counters and active set
    world.entities.nextId = data.nextId;
    data.entities.forEach(id => world.entities.active.add(id));

    // 2. Restore all component stores
    for (const [componentId, storeData] of Object.entries(data.components)) {
        for (const [entityStringId, componentData] of Object.entries(storeData)) {
            // Important: JSON keys are always strings, we must cast back to Entity (number)
            const entityId = Number(entityStringId);
            addComponent(world, entityId, componentId, componentData);
        }
    }

    return world;
};