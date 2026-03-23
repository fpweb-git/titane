import { World } from './world';
import { Entity, ComponentId } from './types';

/**
 * Filters the world for all entities that possess the full set of required components.
 * Optimization: Iterates over the smallest component store first to reduce checks.
 * @param world The world state to query.
 * @param componentIds An array of component string identifiers.
 * @returns An array of matching Entity IDs.
 */
export const query = (world: World, componentIds: ComponentId[]): Entity[] => {
    if (componentIds.length === 0) return [];

    // 1. Get the stores corresponding to the requested IDs
    // Ignore IDs that don't exist yet in the World
    const stores = componentIds
        .map(id => world._components.get(id))
        .filter((store): store is Map<Entity, any> => !!store);

    // If we haven't found all the requested stores, no one can have all the components
    if (stores.length !== componentIds.length) return [];

    // 2. OPTIMIZATION: Sort stores by size (number of entities)
    // We want to iterate over the "rarest" store to minimize loops
    stores.sort((a, b) => a.size - b.size);
    const [smallestStore, ...otherStores] = stores;

    const matchingEntities: Entity[] = [];

    // 3. Iterate only over the keys of the smallest store
    for (const entityId of smallestStore.keys()) {
        let hasAllComponents = true;

        // Check for the presence of the ID in all other required stores
        for (const store of otherStores) {
            if (!store.has(entityId)) {
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