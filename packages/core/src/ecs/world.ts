import { Entity, ComponentId, System } from './types';

/**
 * The World interface holds the entire state of the engine.
 * It is a purely data-driven structure.
 */
export interface World {
    entities: {
        nextId: number;
        recycled: Entity[];
        active: Set<Entity>;
    };
    /** Map of Component IDs to a sub-map of Entity IDs and their respective data */
    components: Map<ComponentId, Map<Entity, any>>;
    systems: System[];
}

/**
 * Creates a fresh, empty World state.
 * @returns A new World instance.
 */
export const createWorld = (): World => ({
    entities: {
        nextId: 0,
        recycled: [],
        active: new Set()
    },
    components: new Map(),
    systems: []
});