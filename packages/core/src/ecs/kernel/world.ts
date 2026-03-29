import { Entity, ComponentId } from '../types';

/**
 * The ECS World structure. 
 * Internal data is prefixed with '_' to discourage direct access.
 */
export interface World {
    readonly entities: {
        nextId: number;
        active: Set<Entity>;
        /** Pool of IDs available for reuse */
        recycled: Entity[];
    };
    /** @internal Internal component storage - Use API functions to access */
    readonly _components: Map<ComponentId, Map<Entity, unknown>>;
}

/**
 * Creates a fresh, empty World state.
 * @returns A new World instance.
 */
export const createWorld = (): World => ({
    entities: {
        nextId: 0,
        active: new Set<Entity>(),
        recycled: [],
    },
    _components: new Map<ComponentId, Map<Entity, unknown>>(),
});