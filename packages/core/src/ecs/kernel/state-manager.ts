import { World } from './world';
import { cloneWorld } from './world-utils';

/**
 * Captures the current state of the world as a deep clone.
 * This is used to create a "checkpoint" before starting a simulation.
 * * @param world - The source world to snapshot.
 * @returns A structurally identical but independent World instance.
 */
export const captureWorldState = (world: World): World => {
    return cloneWorld(world);
};

/**
 * Restores a world instance using data from a snapshot.
 * * IMPORTANT: This function performs an IN-PLACE mutation of the target world.
 * We do not replace the 'target' reference or its component Maps. This ensures that 
 * external systems (UI, Renderers, InputDrivers) holding references to these 
 * objects do not lose track of the data.
 * * @param target - The active world instance to overwrite.
 * @param source - The snapshot world containing the data to restore.
 */
export const restoreWorldState = (target: World, source: World): void => {
    // 1. Sync Entity metadata
    target.entities.nextId = source.entities.nextId;
    target.entities.active = new Set(source.entities.active);
    target.entities.recycled = [...source.entities.recycled];

    // 2. Sync Component Stores
    source._components.forEach((sourceStore, componentId) => {
        let targetStore = target._components.get(componentId);

        // If the store doesn't exist in target, create it
        if (!targetStore) {
            targetStore = new Map();
            target._components.set(componentId, targetStore);
        }

        /**
         * We clear the existing Map instead of reassigning it.
         * This preserves the object reference for UI reactivity (Vue/Nuxt).
         */
        targetStore.clear();

        // Inject snapshot data back into the persistent reference
        sourceStore.forEach((data, entityId) => {
            // structuredClone ensures the snapshot remains immutable during gameplay
            targetStore!.set(entityId, structuredClone(data));
        });
    });

    // 3. Cleanup: Remove any component stores that are not present in the source
    target._components.forEach((_, id) => {
        if (!source._components.has(id)) {
            target._components.delete(id);
        }
    });
};