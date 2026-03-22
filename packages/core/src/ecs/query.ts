import { World } from './world';
import { Entity, ComponentId } from './types';

/**
 * Filters the world for all entities that possess the full set of required components.
 * @param world The world state to query.
 * @param componentIds An array of component string identifiers.
 * @returns An array of matching Entity IDs.
 */
export const query = (world: World, componentIds: ComponentId[]): Entity[] => {
    if (componentIds.length === 0) return [];

    // Optimization: start with the smallest store if possible (currently uses the first one)
    const firstStore = world.components.get(componentIds[0]);
    if (!firstStore) return [];

    const matchingEntities: Entity[] = [];

    for (const entityId of firstStore.keys()) {
        let hasAllComponents = true;

        for (let index = 1; index < componentIds.length; index++) {
            const store = world.components.get(componentIds[index]);
            if (!store || !store.has(entityId)) {
                hasAllComponents = false;
                break;
            }
        }

        if (hasAllComponents) {
            matchingEntities.push(entityId);
        }
    }

    return matchingEntities;
};